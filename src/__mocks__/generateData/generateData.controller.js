import generateDataMocking from "./generateData.services.js";

export default async (req,res)=>{
    const petsCount = req.body.users;
    const usersCount = req.body.pets;


    if(!petsCount) return res.status(400).send({status:"error",error:"valor de pets incorrecto"});
    if(!usersCount) return res.status(400).send({status:"error",error:"valor de users incorrecto"});
    
    generateDataMocking(petsCount,usersCount);
    res.send({status:"success",message:"Data generated"})

};