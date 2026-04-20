import type { TResourceName } from "@/lib/types/reference.types"

export const DEFAULT_TTL_MS: Record<TResourceName, number> = {
  contragents: 15 * 60 * 1000,
  warehouses: 24 * 60 * 60 * 1000,
  payboxes: 24 * 60 * 60 * 1000,
  organizations: 24 * 60 * 60 * 1000,
  priceTypes: 24 * 60 * 60 * 1000,
  nomenclature: 10 * 60 * 1000,
}

export const MAX_CACHE_ENTRIES: Record<TResourceName, number> = {
  contragents: 40,
  warehouses: 10,
  payboxes: 10,
  organizations: 10,
  priceTypes: 10,
  nomenclature: 25,
}
