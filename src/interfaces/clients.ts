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

export interface ICreateClient {
  name: string;
  email: string;
  phone: string;
}

export interface IChangeClient {
  id: string;
  name: string;
  email: string;
  phone: string;
}
