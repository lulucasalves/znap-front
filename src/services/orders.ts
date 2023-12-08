import { IPostOrder, IPutOrder } from "@/interfaces/orders";
import { app } from "./app";

export function deleteOrder(id: string) {
  return app
    .delete(`/order/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function getOrder(id: string) {
  return app
    .get(`/order/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function putOrder({ id, price, product_id, quantity }: IPutOrder) {
  return app
    .put(`/order/${id}`, { price, product_id, quantity })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function postOrder(body: IPostOrder) {
  return app
    .post(`/order`, body)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}
