import axios from "axios"

import type {
  IContragent,
  IContragentsQuery,
  IListResponse,
  INomenclatureItem,
  INomenclatureQuery,
  IOrganization,
  IOrganizationsQuery,
  IPaybox,
  IPayboxesQuery,
  IPriceType,
  IPriceTypesQuery,
  IWarehouse,
  IWarehousesQuery,
} from "@/types/reference.types"

const api = axios.create({
  baseURL:
    import.meta.env.VITE_TABLECRM_API_BASE_URL ??
    "https://app.tablecrm.com/api/v1",
})

const normalizeListResponse = <T>(payload: unknown): IListResponse<T> => {
  if (Array.isArray(payload)) {
    return {
      result: payload as T[],
      count: payload.length,
    }
  }

  if (payload && typeof payload === "object") {
    const candidate = payload as Record<string, unknown>

    if (
      Array.isArray(candidate.result) &&
      typeof candidate.count === "number"
    ) {
      return {
        result: candidate.result as T[],
        count: candidate.count,
      }
    }
  }

  return {
    result: [],
    count: 0,
  }
}

const requestList = async <T, Q extends object = object>(
  path: string,
  token: string,
  params?: Q
) => {
  const response = await api.get<unknown>(path, {
    params: {
      token,
      ...params,
    },
  })

  return normalizeListResponse<T>(response.data)
}

export const tableCrmApi = {
  getContragents: (token: string, params?: IContragentsQuery) =>
    requestList<IContragent, IContragentsQuery>("/contragents/", token, params),
  getWarehouses: (token: string, params?: IWarehousesQuery) =>
    requestList<IWarehouse, IWarehousesQuery>("/warehouses/", token, params),
  getPayboxes: (token: string, params?: IPayboxesQuery) =>
    requestList<IPaybox, IPayboxesQuery>("/payboxes/", token, params),
  getOrganizations: (token: string, params?: IOrganizationsQuery) =>
    requestList<IOrganization, IOrganizationsQuery>(
      "/organizations/",
      token,
      params
    ),
  getPriceTypes: (token: string, params?: IPriceTypesQuery) =>
    requestList<IPriceType, IPriceTypesQuery>("/price_types/", token, params),
  getNomenclature: (token: string, params?: INomenclatureQuery) =>
    requestList<INomenclatureItem, INomenclatureQuery>(
      "/nomenclature/",
      token,
      params
    ),
}
