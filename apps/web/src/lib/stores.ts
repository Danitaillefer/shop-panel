import { api } from "./api";

export interface Store {
  id: string;
  shopDomain: string;
  scopes: string;
  createdAt: string;
}

export function getStores(){
  return api.get<Store[]>('/stores')
}

export function connectStoreUrl(shop: string) {
  const shopUrl = encodeURIComponent(shop)
  return `/api/stores/connect?shop=${shopUrl}`
}