import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";


export default async (usersCount) => {
  const users = Array.from({ length: usersCount }, () => ({
    password: bcrypt.hashSync("code123", 10),
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [],
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  }));
  return users;
};
