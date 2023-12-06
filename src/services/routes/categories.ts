import {
  IGetAllCategories,
  IGetCategory,
  IPostCategory,
  IPutCategory,
  IRequestGetList,
} from "@/interfaces";
import { app } from "../app";

export function getAllCategories({
  limit,
  page,
  sort,
  order,
  filter,
  active,
}: IRequestGetList) {
  let router = `/categories?page=${page}`;

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

  if (active) {
    router += `&&active=${active}`;
  }

  return app
    .get<IGetAllCategories>(router)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function deleteCategory(id: string) {
  return app
    .delete(`/category/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function postCategory({ name, available }: IPostCategory) {
  return app
    .post(`/category`, { name, available })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function putCategory({ name, available, id }: IPutCategory) {
  return app
    .put(`/category/${id}`, { name, available })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}

export function getCategory({ id }: IGetCategory) {
  return app
    .get(`/category/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
}
