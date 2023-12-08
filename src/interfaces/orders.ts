export interface IPutOrder {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface IPostOrder {
  master_order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}
