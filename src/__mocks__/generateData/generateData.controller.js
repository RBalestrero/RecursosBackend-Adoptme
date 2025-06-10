import generateDataMocking from "./generateData.services.js";

export default async (req,res)=>{
    const petsCount = req.body.users;
    const usersCount = req.body.pets;

    if(!petsCount||!usersCount) return res.status(400).send({status:"error",error:"valors de pets y users incorrectos"});

    generateDataMocking(petsCount,usersCount);
    res.send({status:"success",message:"Data generated"})

};