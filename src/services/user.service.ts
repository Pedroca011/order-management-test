import HttpError from "../utils/httpError";
import { hash } from "bcrypt";
import { RoleType } from "../utils/enums";
import Role from "../models/role";
import { userRepository } from "../repositories";
import { IUser } from "../interfaces";
import { IUserModel } from "../models/user";

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/* =========================
   CREATE USER
========================= */
const createUser = async (data: CreateUserData) => {
  const { firstName, lastName, email, password } = data;

  const emailExists = await userRepository.existsByEmail(email);
  if (emailExists) {
    throw new HttpError({
      title: "emailAddress",
      detail: "Email address is already used",
      code: 422,
    });
  }
// To create an admin account, change the type to ADMIN.
  const verifyRole = await Role.findOne({ name: RoleType.USER });
  if (!verifyRole) {
    throw new HttpError({
      title: "role",
      detail: "User role not found",
      code: 422,
    });
  }

  const hashedPassword = await hash(password, 12);

  const userData: Partial<IUserModel> = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: verifyRole._id as any,
  };

  return await userRepository.create(userData);
};

/* =========================
   GET USER BY ID
========================= */
const getUserById = async (userId: string) => {
  const user = await userRepository.findByIdWithRole(userId);

  if (!user) {
    throw new HttpError({
      title: "not_found",
      detail: "User not found",
      code: 404,
    });
  }

  return user;
};

/* =========================
   LIST USERS
========================= */
const listUsers = async (page: number, limit: number) => {
  return await userRepository.findAllWithPagination(page, limit);
};

export default {
  createUser,
  getUserById,
  listUsers,
};
