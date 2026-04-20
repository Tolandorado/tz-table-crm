import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  DEFAULT_TTL_MS,
  MAX_CACHE_ENTRIES,
} from "@/lib/consts/referenceData.const"
import { tableCrmApi } from "@/tablecrmApi"
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
  TReferenceDataScopes,
  TResourceName,
  TResourcePayloadMap,
} from "@/lib/types/reference.types"

import {
  getReferenceScopeKey,
  isReferenceEntryFresh,
  resolveReferenceResourceEntry,
  upsertReferenceScopeCache,
} from "./referenceData.cache"

type IReferenceDataState = {
  scopes: TReferenceDataScopes
  getCached: <K extends TResourceName>(
    resource: K,
    token: string,
    query?: object,
    ttlMs?: number
  ) => IListResponse<TResourcePayloadMap[K]> | null
  setCached: <K extends TResourceName>(
    resource: K,
    token: string,
    query: object | undefined,
    data: IListResponse<TResourcePayloadMap[K]>
  ) => void
  clearScope: (token: string) => void
  clearAll: () => void
  ensureContragents: (
    token: string,
    query?: IContragentsQuery,
    ttlMs?: number
  ) => Promise<IListResponse<IContragent>>
  ensureWarehouses: (
    token: string,
    query?: IWarehousesQuery,
    ttlMs?: number
  ) => Promise<IListResponse<IWarehouse>>
  ensurePayboxes: (
    token: string,
    query?: IPayboxesQuery,
    ttlMs?: number
  ) => Promise<IListResponse<IPaybox>>
  ensureOrganizations: (
    token: string,
    query?: IOrganizationsQuery,
    ttlMs?: number
  ) => Promise<IListResponse<IOrganization>>
  ensurePriceTypes: (
    token: string,
    query?: IPriceTypesQuery,
    ttlMs?: number
  ) => Promise<IListResponse<IPriceType>>
  ensureNomenclature: (
    token: string,
    query?: INomenclatureQuery,
    ttlMs?: number
  ) => Promise<IListResponse<INomenclatureItem>>
}

const createGetCachedReferenceData =
  (getState: () => IReferenceDataState): IReferenceDataState["getCached"] =>
  <K extends TResourceName>(
    resource: K,
    token: string,
    query?: object,
    ttlMs = DEFAULT_TTL_MS[resource]
  ) => {
    const entry = resolveReferenceResourceEntry(
      getState().scopes,
      resource,
      token,
      query
    )

    if (!entry || !isReferenceEntryFresh(entry, ttlMs)) {
      return null
    }

    return entry.data
  }

export const useReferenceDataStore = create<IReferenceDataState>()(
  persist(
    (set, get) => ({
      scopes: {},
      getCached: createGetCachedReferenceData(get),
      setCached: (resource, token, query, data) => {
        set((state) => ({
          scopes: upsertReferenceScopeCache(
            state.scopes,
            resource,
            token,
            query,
            data,
            MAX_CACHE_ENTRIES[resource]
          ),
        }))
      },
      clearScope: (token) => {
        const scopeKey = getReferenceScopeKey(token)
        set((state) => {
          const nextScopes = { ...state.scopes }
          delete nextScopes[scopeKey]

          return { scopes: nextScopes }
        })
      },
      clearAll: () => {
        set({ scopes: {} })
      },
      ensureContragents: async (
        token,
        query,
        ttlMs = DEFAULT_TTL_MS.contragents
      ) => {
        const cached = get().getCached("contragents", token, query, ttlMs)
        if (cached) {
          return cached
        }

        const data = await tableCrmApi.getContragents(token, query)
        set((state) => ({
          scopes: upsertReferenceScopeCache(
            state.scopes,
            "contragents",
            token,
            query,
            data,
            MAX_CACHE_ENTRIES.contragents
          ),
        }))
        return data
      },
      ensureWarehouses: async (
        token,
        query,
        ttlMs = DEFAULT_TTL_MS.warehouses
      ) => {
        const cached = get().getCached("warehouses", token, query, ttlMs)
        if (cached) {
          return cached
        }

        const data = await tableCrmApi.getWarehouses(token, query)
        set((state) => ({
          scopes: upsertReferenceScopeCache(
            state.scopes,
            "warehouses",
            token,
            query,
            data,
            MAX_CACHE_ENTRIES.warehouses
          ),
        }))
        return data
      },
      ensurePayboxes: async (token, query, ttlMs = DEFAULT_TTL_MS.payboxes) => {
        const cached = get().getCached("payboxes", token, query, ttlMs)
        if (cached) {
          return cached
        }

        const data = await tableCrmApi.getPayboxes(token, query)
        set((state) => ({
          scopes: upsertReferenceScopeCache(
            state.scopes,
            "payboxes",
            token,
            query,
            data,
            MAX_CACHE_ENTRIES.payboxes
          ),
        }))
        return data
      },
      ensureOrganizations: async (
        token,
        query,
        ttlMs = DEFAULT_TTL_MS.organizations
      ) => {
        const cached = get().getCached("organizations", token, query, ttlMs)
        if (cached) {
          return cached
        }

        const data = await tableCrmApi.getOrganizations(token, query)
        set((state) => ({
          scopes: upsertReferenceScopeCache(
            state.scopes,
            "organizations",
            token,
            query,
            data,
            MAX_CACHE_ENTRIES.organizations
          ),
        }))
        return data
      },
      ensurePriceTypes: async (
        token,
        query,
        ttlMs = DEFAULT_TTL_MS.priceTypes
      ) => {
        const cached = get().getCached("priceTypes", token, query, ttlMs)
        if (cached) {
          return cached
        }

        const data = await tableCrmApi.getPriceTypes(token, query)
        set((state) => ({
          scopes: upsertReferenceScopeCache(
            state.scopes,
            "priceTypes",
            token,
            query,
            data,
            MAX_CACHE_ENTRIES.priceTypes
          ),
        }))
        return data
      },
      ensureNomenclature: async (
        token,
        query,
        ttlMs = DEFAULT_TTL_MS.nomenclature
      ) => {
        const cached = get().getCached("nomenclature", token, query, ttlMs)
        if (cached) {
          return cached
        }

        const data = await tableCrmApi.getNomenclature(token, query)
        set((state) => ({
          scopes: upsertReferenceScopeCache(
            state.scopes,
            "nomenclature",
            token,
            query,
            data,
            MAX_CACHE_ENTRIES.nomenclature
          ),
        }))
        return data
      },
    }),
    {
      name: "tablecrm-reference-data",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scopes: state.scopes,
      }),
    }
  )
)
