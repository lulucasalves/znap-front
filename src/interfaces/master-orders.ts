import { IGetList, IRequestGetList } from ".";

export interface IRequestGetListMasterOrders extends IRequestGetList {
  categories: string[];
  clients: string[];
  products: string[];
  dateFrom: string;
  dateTo: string;
}

export interface IGetAllMasterOrdersData {
  id: string;
  shipping: number;
  date: string;
  created_at: string;
  updated_at: string;
  client: { id: string; name: string };
  number_orders: string;
  total_quantity: string;
  total_price: string;
  average_price: string;
}

export interface IGetAllMasterOrders extends IGetList {
  data: IGetAllMasterOrdersData[];
}

export interface ICreateMasterOrder {
  client_id: string;
  shipping: number;
  date: string;
}

export interface IChangeMasterOrder {
  client_id: string;
  shipping: number;
  date: string;
  id: string;
}
