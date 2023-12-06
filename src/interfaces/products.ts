import { IRequestGetList } from "./default";
import { IGetList } from ".";

export interface IRequestGetListProducts extends IRequestGetList {
  categories: string[];
}

export interface IGetAllProductsData {
  updated_at: string;
  id: string;
  name: string;
  price: number;
  available: boolean;
  created_at: string;
  category_id: {
    available: boolean;
    updated_at: string;
    id: string;
    name: string;
    created_at: string;
  };
}

export interface IGetAllProducts extends IGetList {
  data: IGetAllProductsData[];
}

export interface ICreateProduct {
  name: string;
  price: number;
  available: boolean;
  category_id: string;
}

export interface IChangeProduct {
  name: string;
  price: number;
  available: boolean;
  category_id: string;
  id: string;
}
