import { IGetList } from ".";

export interface IGetAllCategoriesData {
  updated_at: string;
  id: string;
  name: string;
  available: boolean;
  created_at: string;
}

export interface IGetAllCategories extends IGetList {
  data: IGetAllCategoriesData[];
}

export interface IPostCategory {
  name: string;
  available: boolean;
}

export interface IPutCategory {
  id: string;
  name: string;
  available: boolean;
}

export interface IGetCategory {
  id: string;
}
