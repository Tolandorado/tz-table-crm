import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { INomenclatureItem } from "./types/reference.types"
import type { IGoodsItem } from "./types/order.types"
import { isAxiosError } from "axios"

export type DebouncedFunction<T extends (...args: any[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const normalizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeValue)
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        const next = (value as Record<string, unknown>)[key]

        if (next === undefined || next === null || next === "") {
          return acc
        }

        acc[key] = normalizeValue(next)
        return acc
      }, {})
  }

  return value
}

export const createCacheKey = (params: object = {}) =>
  JSON.stringify(normalizeValue(params))

export const createTokenScope = (token: string) => {
  let hash = 2166136261

  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `scope_${(hash >>> 0).toString(36)}`
}

export const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const toFiniteNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."))
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export const resolveItemPrice = (item: INomenclatureItem) => {
  for (const entry of item.prices) {
    for (const value of Object.values(entry)) {
      const numericValue = toFiniteNumber(value)
      if (numericValue !== null) {
        return numericValue
      }
    }
  }

  return 0
}

export const toGoodsItem = (item: INomenclatureItem): IGoodsItem => ({
  price: resolveItemPrice(item),
  price_type: 0,
  unit_name: item.unit_name,
  tax: 0,
  status: "new",
  nomenclature_name: item.name,
  quantity: 1,
  unit: item.unit,
  discount: 0,
  sum_discounted: resolveItemPrice(item),
  nomenclature: item.id,
})

export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  return debounced as DebouncedFunction<T>
}

export const errorToToastString = (error: unknown): string => {
  return isAxiosError(error)
    ? typeof error.response?.data === "string"
      ? error.response.data
      : ((error.response?.data as { detail?: string } | undefined)?.detail ??
        error.message)
    : "Не удалось подключить кассу"
}
