import User, { IUserModel } from "../models/user";

const existsByEmail = async (email: string): Promise<boolean> => {
  return !!(await User.exists({ email }));
};

const create = async (data: Partial<IUserModel>): Promise<IUserModel> => {
  const user = new User(data);
  return await user.save();
};

const findByIdWithRole = async (id: string) => {
  return await User.findById(id).populate("role");
};

const findAllWithPagination = async (page: number, limit: number) => {
  const total = await User.countDocuments({});

  const users = await User.find()
    .populate("role")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  return {
    users,
    meta: {
      total,
      limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
};

export const userRepository = {
  existsByEmail,
  create,
  findByIdWithRole,
  findAllWithPagination,
};
