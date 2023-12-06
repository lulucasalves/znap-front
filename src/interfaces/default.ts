export interface IGetList {
  count: number;
  page: number;
  limit: number;
  maxPages: number;
}

export interface IRequestGetList {
  limit?: number;
  page: number;
  sort?: string;
  order?: string;
  filter?: string;
  active?: string;
}
