const validateProfileEdit=(req)=>{

   
        const allowedEsitFields=["firstName","lastName","age","gender","photoURL","About","Skills"];
    const isEditAllowed=Object.keys(req.body).every(field=>allowedEsitFields.includes(field));
    return isEditAllowed;
    

}
module.exports=validateProfileEdit;
