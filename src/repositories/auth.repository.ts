import User, { IUserModel } from "../models/user";

const findUserByEmail = async (email: string): Promise<IUserModel | null> => {
  return await User.findOne({ email }).populate("role");
};

export const authRepository = {
  findUserByEmail,
};
