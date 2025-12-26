import { StateType, StatusType } from "../utils/enums";
import { IService } from "../interfaces";

export interface IOrder {
    lab: string;
    patient: string;
    customer: string;
    state: StateType;
    status: StatusType;
    services: IService[];
}