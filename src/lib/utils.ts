import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
