import { Request, Response } from 'express';
import cartSchema from '../models/Cart';


//addtocart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const { userId, productId, name, price, count } = req.body;
        // Check if the product already exists in the user's cart
        const existingCartItem = await cartSchema.findOne({
            userId,
            'orderedProducts.productId': productId,
        });

        if (existingCartItem) {
            await cartSchema.updateOne(
                {
                    userId,
                    'orderedProducts.productId': productId,
                },
                {
                    $inc: { 'orderedProducts.$.count': count },
                }
            );
        } else {
            // If the product doesn't exist, add a new ordered product to the cart
            await cartSchema.updateOne(
                { userId },
                {
                    $push: {
                        orderedProducts: {
                            productId,
                            name,
                            price,
                            count,
                            createdAt: new Date(),
                        },
                    },
                },
                { upsert: true }
            );
        }
        const cartItems: any = await cartSchema.findOne({ userId });
        return res.status(201).json({
            status: true,
            message: 'Product added to the cart successfully',
            data: cartItems.orderedProducts
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: 'Error adding product to the cart',
        });
    }
};

//addMultipleItems
export const addMultipleItems = async (req: Request, res: Response) => {
    try {
        const { userId, products } = req.body;

        const bulkUpdateOperations = products.map((product:any) => {
            return {
                updateOne: {
                    filter: {
                        userId,
                        'orderedProducts.productId': product.productId,
                    },
                    update: {
                        $inc: { 'orderedProducts.$.count': product.count },
                    },
                    upsert: true,
                },
            };
        });
        await cartSchema.bulkWrite(bulkUpdateOperations);

        const newProducts = products.filter((product:any) => {
            return !bulkUpdateOperations.some((op:any) => {
                const filter = op.updateOne.filter;
                return (
                    filter.userId === userId &&
                    filter['orderedProducts.productId'] === product.productId
                );
            });
        });

        if (newProducts.length > 0) {
            await cartSchema.updateOne(
                { userId },
                {
                    $push: {
                        orderedProducts: {
                            $each: newProducts.map((product:any) => ({
                                productId: product.productId,
                                name: product.name,
                                price: product.price,
                                count: product.count,
                                createdAt: new Date(),
                            })),
                        },
                    },
                },
                { upsert: true }
            );
        }

        const cartItems: any = await cartSchema.findOne({ userId });
        return res.status(201).json({
            status: true,
            message: 'Products added to the cart successfully',
            data: cartItems.orderedProducts,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: 'Error adding products to the cart',
        });
    }
};


//getusercart
export const getAllCartItems = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const cartItems = await cartSchema.findOne({ userId });

        if (cartItems) {
            return res.status(200).json({
                status: true,
                message: 'Cart items retrieved successfully',
                data: cartItems.orderedProducts,
            });
        } else {
            return res.status(201).json({
                status: false,
                message: 'Cart not found for the specified user ID',
                data: [],
            });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({
            status: false,
            message: 'Error retrieving cart items',
            data: [],
        });
    }
};

//delete entire item
export const deleteCartItem = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        // Find the user's cart
        const userCart = await cartSchema.findOne({ userId });

        if (!userCart) {
            return res.status(404).json({
                status: false,
                message: 'Cart not found for the specified user ID',
            });
        }

        // Remove all products from the orderedProducts array
        userCart.orderedProducts = [];

        // Save the updated cart
        await userCart.save();

        return res.status(200).json({
            status: true,
            message: 'All products removed from the cart successfully',
            data: userCart.orderedProducts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Error removing all products from the cart',
            data: [],
        });
    }
};

export const deleteOneCartItem = async (req: Request, res: Response) => {
    try {
        const { userId,productId } = req.body;
        const userCart = await cartSchema.findOne({ productId });
        if (!userCart) {
            return res.status(404).json({
                status: false,
                message: 'Cart not found for the specified user ID',
            });
        }
        const itemIndex = userCart.orderedProducts.findIndex(
            (item) => item.productId === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                status: false,
                message: 'Item not found in the cart',
            });
        }
        userCart.orderedProducts.splice(itemIndex, 1);
        await userCart.save();
        return res.status(200).json({
            status: true,
            message: 'Item removed from the cart successfully',
            data: userCart.orderedProducts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Error removing item from the cart',
            data: [],
        });
    }
};


export const updateItemCount = async (req: Request, res: Response) => {
    try {
        const { userId, productId, action } = req.body;
        const userCart = await cartSchema.findOne({ userId });

        if (!userCart) {
            return res.status(404).json({
                status: false,
                message: 'Cart not found for the specified user ID',
            });
        }
        const itemIndex = userCart.orderedProducts.findIndex(
            (item) => item.productId === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                status: false,
                message: 'Item not found in the cart',
            });
        }
        if (action === 'increase') {
            userCart.orderedProducts[itemIndex].count += 1;
        } else if (action === 'decrease') {
            if (userCart.orderedProducts[itemIndex].count > 1) {
                userCart.orderedProducts[itemIndex].count -= 1;
            }
            if (userCart.orderedProducts[itemIndex].count === 1) {
                userCart.orderedProducts.splice(itemIndex, 1);
                await userCart.save();
            }
        } else {
            return res.status(400).json({
                status: false,
                message: 'Invalid action. Use "increase" or "decrease"',
            });
        }

        await userCart.save();
        const cartItems: any = await cartSchema.findOne({ userId });
        return res.status(200).json({
            status: true,
            message: `Item count ${action}d successfully`,
            data: cartItems.orderedProducts,
        });
    } catch (error: any) {
        const { action } = req.body;
        return res.status(500).json({
            status: false,
            message: `Error ${action}ing item count`,
            data: [],
        });
    }
};