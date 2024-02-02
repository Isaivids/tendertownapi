export const createProduct = async(req:any,res:any) =>{
    const newContact = new ContactSchema(req.body)
    try { 
        await newContact.save();
        res.status(200).json(newContact);
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}