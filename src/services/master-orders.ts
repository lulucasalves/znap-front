import {
  IChangeMasterOrder,
  ICreateMasterOrder,
  IGetAllMasterOrders,
  IRequestGetListMasterOrders,
} from "@/interfaces";
import { app } from "./app";

export function getAllMasterOrders({
  limit,
  page,
  sort,
  order,
  filter,
  categories,
  clients,
  products,
  dateFrom,
  dateTo,
}: IRequestGetListMasterOrders) {
  let router = `/master-orders?page=${page}`;

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

  if (dateTo) {
    router += `&&dateTo=${dateTo}`;
  }

  if (dateFrom) {
    router += `&&dateFrom=${dateFrom}`;
  }

  if (categories.length) {
    router += `&&categories=${categories.join(",")}`;
  }

  if (clients.length) {
    router += `&&clients=${clients.join(",")}`;
  }

  if (products.length) {
    router += `&&products=${products.join(",")}`;
  }

  return app
    .get<IGetAllMasterOrders>(router)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function deleteMasterOrder(id: string) {
  return app
    .delete(`/master-order/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function getMasterOrder(id: string) {
  return app
    .get(`/master-order/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function postMasterOrder(body: ICreateMasterOrder) {
  return app
    .post(`/master-order`, body)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function putMasterOrder({
  client_id,
  date,
  shipping,
  id,
}: IChangeMasterOrder) {
  return app
    .put(`/master-order/${id}`, { client_id, date, shipping })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}
