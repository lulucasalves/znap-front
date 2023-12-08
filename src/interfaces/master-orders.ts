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

export interface IGetMasterOrdersData {
  updated_at?: string;
  id?: string;
  shipping?: number;
  date?: string;
  created_at?: string;
  client_id?: {
    updated_at: string;
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
  };
  orders: {
    updated_at: string;
    id: string;
    quantity: number;
    price: number;
    created_at: string;
    product_id: {
      available: boolean;
      updated_at: string;
      id: string;
      name: string;
      price: number;
      created_at: string;
    };
  }[];
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
