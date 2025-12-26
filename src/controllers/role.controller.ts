import { NextFunction, Request, Response } from "express";
import { jsonAll } from "../utils/general";
import Role from "../models/role";
import Logging from "../library/Logging";

//CREATE AUTOMATIC ROLE AT FIRST WHEN WE CREATE NEW DB
export async function crateRole() {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      await Role.create([
        { name: "user" },
        { name: "admin" },
      ]);

      Logging.info("✅ Roles 'user' e 'admin' criadas com sucesso");
    } else {
      Logging.info("ℹ️ Roles já existem, seed ignorado");
    }
  } catch (error) {
    console.error("❌ Erro ao criar roles:", error);
  }
}

//GET ROLES LIST
const getAllRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let pageOptions: { page: number; limit: number } = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };
    const count = await Role.countDocuments({});
    //GETING DATA FROM TABLE
    const roles = await Role.find()
      .limit(pageOptions.limit * 1)
      .skip((pageOptions.page - 1) * pageOptions.limit)
      .sort({ createdAt: -1 });
    //CREATE RESPONSE
    const result = {
      roles,
    };
    //CREATE PAGINATION
    const meta = {
      total: count,
      limit: pageOptions.limit,
      totalPages: Math.ceil(count / pageOptions.limit),
      currentPage: pageOptions.page,
    };
    //SEND RESPONSE
    return jsonAll(res, 201, result, meta);
  } catch (error) {
    next(error);
  }
};

//EXPORT
export default {
  getAllRole,
};
