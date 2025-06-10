import { faker } from "@faker-js/faker";


export default async (usersCount) => {
  const users = Array.from({ length: usersCount }, () => ({
    name: faker.animal.petName(),
    birthDate: new Date(faker.date.birthdate()).toISOString().split("T")[0],
    specie: faker.animal.type(),
  }));
  return users;
};