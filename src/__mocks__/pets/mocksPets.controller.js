import get from "./mocksPets.services.js";

const mockingPets = async(req,res)=>{
    const pets = await get(req.body.pets);
    res.send({status:"success",payload:pets});
};

export default mockingPets;