import { IRole } from './roleInterface';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: IRole;
}
