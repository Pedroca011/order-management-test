import { StatusServiceType } from "../utils/enums";

export interface IService {
    name: string;
    value: number;
    status: StatusServiceType
}