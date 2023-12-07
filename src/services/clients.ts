import {
  IChangeClient,
  ICreateClient,
  IGetAllClients,
  IRequestGetList,
} from "@/interfaces";
import { app } from "./app";

export function getAllClients({
  limit,
  page,
  sort,
  order,
  filter,
}: IRequestGetList) {
  let router = `/clients?page=${page}`;

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

  return app
    .get<IGetAllClients>(router)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function deleteClient(id: string) {
  return app
    .delete(`/client/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function postClient({ name, email, phone }: ICreateClient) {
  return app
    .post(`/client`, { name, email, phone })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function putClient({ name, email, phone, id }: IChangeClient) {
  return app
    .put(`/client/${id}`, { name, email, phone })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function getClient({ id }: { id: string }) {
  return app
    .get(`/client/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}
