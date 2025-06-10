import Router from 'express';
import mockingPets from '../__mocks__/pets/mocksPets.controller.js';
import mockingUsers from '../__mocks__/users/mocksUsers.controller.js';
import generateData from '../__mocks__/generateData/generateData.controller.js';

const router = Router();

router.get('/mockingpets', mockingPets);
router.get('/mockingusers', mockingUsers);
router.post('/generateData', generateData);

export default router;