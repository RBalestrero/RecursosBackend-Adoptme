import getMockingPets from "../pets/mocksPets.services.js";
import getMockingUsers from "../users/mocksUsers.services.js";

import { usersService, petsService } from "../../services/index.js";


export default async (petsCount,usersCount) =>{
    const pets = await getMockingPets(petsCount);
    const users = await getMockingUsers(usersCount);
    
    usersService.create(users);
    petsService.create(pets);
}