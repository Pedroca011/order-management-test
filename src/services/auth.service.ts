import HttpError from "../utils/httpError";
import { compare } from "bcrypt";
import { authRepository } from "../repositories";
import { generateJWT } from "../utils";
import { IUserModel } from "../models/user";
import { AuthInterface } from "../interfaces/authInterface";

/* =========================
   TOKEN BUILDER
========================= */
const tokenBuilder = async (user: IUserModel) => {
  const accessToken = generateJWT(
    {
      id: user._id,
      role: user.role.name,
      tokenType: "access",
    },
    {
      issuer: user.email,
      subject: user.email,
      audience: "root",
    }
  );

  return { accessToken };
};

/* =========================
   LOGIN
========================= */
const login = async (
  email: string,
  password: string
): Promise<AuthInterface> => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new HttpError({
      title: "bad_login",
      detail: "Email ou senha inválidos",
      code: 400,
    });
  }

  const isValidPass = await compare(password, user.password);

  if (!isValidPass) {
    throw new HttpError({
      title: "bad_login",
      detail: "Email ou senha inválidos",
      code: 400,
    });
  }

  const token = await tokenBuilder(user);

  return {
    user,
    accessToken: token.accessToken,
  };
};

export default {
  login,
};
