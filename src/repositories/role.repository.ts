import Role from "../models/role";

const count = async (): Promise<number> => {
  return await Role.estimatedDocumentCount();
};

const createMany = async (roles: { name: string }[]) => {
  return await Role.create(roles);
};

const findAllWithPagination = async (page: number, limit: number) => {
  const total = await Role.countDocuments({});

  const roles = await Role.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  return {
    roles,
    meta: {
      total,
      limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
};

export const roleRepository = {
  count,
  createMany,
  findAllWithPagination,
};
