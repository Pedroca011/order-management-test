import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne } from '../utils/general';
import { matchedData } from 'express-validator';
import User, { IUserModel } from '../models/user';
import { generateJWT } from '../utils';
import { OtpType } from '../utils/enums';
import { compare, hash } from 'bcrypt';
import { AuthInterface } from '../interfaces/authInterface';

//GENERATE TOKEN FOR LOGIN
const tokenBuilder = async (user: IUserModel) => {
    const accessToken = generateJWT(
        {
            id: user._id,
            role: user.role.name,
            tokenType: 'access',
        },
        {
            issuer: user.email,
            subject: user.email,
            audience: 'root',
        }
    );

    return {
        accessToken: accessToken,
    };
};

//USER LOGIN
const login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<AuthInterface | void> => {
    try {
      const bodyData = matchedData(req, {
        includeOptionals: true,
        locations: ['body'],
      });
  
      const { email, password } = bodyData;
  
      // 1️⃣ Buscar usuário
      const user = await User.findOne({ email }).populate('role');
  
      if (!user) {
        throw new HttpError({
          title: 'bad_login',
          detail: 'Email ou senha inválidos',
          code: 400,
        });
      }
  
      // 2️⃣ Comparar senha
      const isValidPass = await compare(password, user.password);
  
      if (!isValidPass) {
        throw new HttpError({
          title: 'bad_login',
          detail: 'Email ou senha inválidos',
          code: 400,
        });
      }
  
      // 3️⃣ Gerar token
      const token = await tokenBuilder(user);
  
      return jsonOne<AuthInterface>(res, 200, {
        user,
        accessToken: token.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };
  


//EXPORT
export default {
    login,
};
