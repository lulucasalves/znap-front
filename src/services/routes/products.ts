import {
  IChangeProduct,
  ICreateProduct,
  IGetAllProducts,
  IRequestGetListProducts,
} from "@/interfaces";
import { app } from "../app";

export function getAllProducts({
  limit,
  page,
  sort,
  order,
  filter,
  categories,
}: IRequestGetListProducts) {
  let router = `/products?page=${page}`;

  if (limit) {
    router += `&&limit=${limit}`;
  }

  if (sort) {
    router += `&&sort=${sort.toUpperCase()}`;
  }

  if (order) {
    router += `&&order=${order}`;
  }

  if (filter) {
    router += `&&filter=${filter}`;
  }

  if (categories.length) {
    router += `&&categories=${categories.join(",")}`;
  }

  return app
    .get<IGetAllProducts>(router)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function deleteProduct(id: string) {
  return app
    .delete(`/product/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function postProduct({
  name,
  price,
  category_id,
  available,
}: ICreateProduct) {
  return app
    .post(`/product`, { name, price, category_id, available })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function putProduct({
  id,
  name,
  price,
  category_id,
  available,
}: IChangeProduct) {
  return app
    .put(`/product/${id}`, { name, price, category_id, available })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function getProduct({ id }: { id: string }) {
  return app
    .get(`/product/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}
