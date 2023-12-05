import { IGetAllClients, IRequestGetList } from "@/interfaces";
import { app } from "../app";

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

  return app.get<IGetAllClients>(router).then((response) => response.data);
}

export function deleteClient(id: string) {
  return app.delete(`/client/${id}`).then((response) => response.data);
}
