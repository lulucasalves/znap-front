import { IGetList } from ".";

export interface IGetAllClientsData {
  updated_at: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface IGetAllClients extends IGetList {
  data: IGetAllClientsData[];
}
