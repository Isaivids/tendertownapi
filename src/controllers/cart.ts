import { Request, Response } from 'express';
import cartSchema from '../models/Cart';
import UsersSchema from '../models/Users';


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
        //usercheck
        let userCart: any = await cartSchema.findOne({ userId });
        if (!userCart) {
            let user = await UsersSchema.findOne({ name: userId });
            if (!user) {
                user = new UsersSchema({ name: userId, admin: false, active: true });
                await user.save();
            }
            userCart = new cartSchema({ userId, orderedProducts: [] });
            await userCart.save();
        }

        // let userCart:any = await cartSchema.findOne({ userId });
        // if (!userCart) {
        //     userCart = new cartSchema({ userId, orderedProducts: [] });
        //     await userCart.save();
        // }
        await cartSchema.updateOne(
            { userId },
            {
                $pull: { orderedProducts: { productId: { $in: userCart.orderedProducts.map((p:any) => p.productId) } } },
            }
        );
        await cartSchema.updateOne(
            { userId },
            {
                $push: {
                    orderedProducts: {
                        $each: products.map((product: any) => ({
                            productId: product.productId,
                            name: product.name,
                            price: product.price,
                            count: product.count,
                            createdAt: new Date(),
                            gst : product.gst
                        })),
                    },
                },
            }
        );

        // Fetch the final updated cart
        userCart = await cartSchema.findOne({ userId });
        return res.status(201).json({
            status: true,
            message: 'Products added to the cart successfully',
            data: userCart.orderedProducts,
            details : userCart._id,
        });
    } catch (error: any) {
        console.error('Error adding products to the cart:', error);
        return res.status(500).json({
            status: false,
            message: 'Error adding products to the cart',
            error: error.message,
        });
    }
}
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
                details : cartItems._id
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
        const userCart = await cartSchema.findOne({ userId });
        if (!userCart) {
            return res.status(404).json({
                status: false,
                message: 'Cart not found for the specified user ID',
            });
        }
        userCart.orderedProducts = [];
        await userCart.save();
        return res.status(200).json({
            status: true,
            message: 'All products removed from the cart successfully',
            data: userCart.orderedProducts,
            details : userCart._id
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
        const { userId, productId } = req.body;
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