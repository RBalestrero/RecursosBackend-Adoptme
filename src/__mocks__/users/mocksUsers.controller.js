import get from "./mocksUsers.services.js";

const mockingUsers = async(req,res)=>{
    const users = await get(req.body.users);
    res.send({status:"success",payload:users});
};

export default mockingUsers;