import { NextFunction, Request, Response } from "express";
import HttpError from "../utils/httpError";
import { jsonOne, jsonAll } from "../utils/general";
import { RoleType, OtpType } from "../utils/enums";
import User, { IUserModel } from "../models/user";
import Role from "../models/role";

import { hash } from "bcrypt";
import { IUser } from "../interfaces";

//CREATE USER
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExist = await User.exists({ email });
    if (userExist) {
      throw new HttpError({
        title: "emailAddress",
        detail: "Email address is already used",
        code: 422,
      });
    }

    const role = await Role.findOne({ name: RoleType.USER });
    if (!role) {
      throw new HttpError({
        title: "role",
        detail: "User role not found",
        code: 422,
      });
    }

    const hashPassword = await hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role: role._id,
      isProfileCompleted: false,
    });

    const savedUser = await user.save();

    return jsonOne<IUserModel>(res, 201, savedUser);
  } catch (error) {
    next(error);
  }
};

//GET USER DETAILS BY ID
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;

    const data = await User.findById(userId).populate("role");
    if (!data) {
      throw new HttpError({
        title: "not_found",
        detail: "User not found",
        code: 404,
      });
    }
    return jsonOne<IUser>(res, 200, data as IUser);
  } catch (error) {
    next(error);
  }
};

//GET ALL USER LIST
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let pageOptions: { page: number; limit: number } = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };

    const count = await User.countDocuments({});
    //GETING DATA FROM TABLE
    let users = await User.find()
      .populate("role")
      .limit(pageOptions.limit * 1)
      .skip((pageOptions.page - 1) * pageOptions.limit)
      .sort({ createdAt: -1 });
    //CREATE PAGINATION
    const meta = {
      total: count,
      limit: pageOptions.limit,
      totalPages: Math.ceil(count / pageOptions.limit),
      currentPage: pageOptions.page,
    };
    return jsonAll<any>(res, 200, users, meta);
  } catch (error) {
    next(error);
  }
};

//UPDATE USER DETAILS WITH ID
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const payload = (req as any).tokenPayload;
    const userId = payload.id;

    /** Check if user is trying to update another user data */
    if (userId !== req.params.userId) {
      throw new HttpError({
        title: "forbidden",
        detail: "Access Forbidden",
        code: 403,
      });
    }
    let user = await User.findById(userId);
    //If User not found
    if (!user) {
      throw new HttpError({
        title: "bad_request",
        detail: "User Not Found.",
        code: 400,
      });
    }
    let isProfileCompleted = true;

    let savedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        residence: body.residence,
        avatar: body.avatar,
        isProfileCompleted,
      },
      { new: true }
    );
    if (!savedUser) {
      throw new HttpError({
        title: "bad_request",
        detail: "User Not Found.",
        code: 400,
      });
    }
    return jsonOne<IUserModel>(res, 200, savedUser as IUserModel);
  } catch (error) {
    next(error);
  }
};

//EXPORT
export default {
  createUser,
  getUser,
  getAllUser,
  updateUser,
};
