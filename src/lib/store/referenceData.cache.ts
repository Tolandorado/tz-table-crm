import { createCacheKey, createTokenScope } from "@/lib/utils"
import type {
  IListResponse,
  TCacheEntry,
  TReferenceDataScopes,
  TReferenceScopeCache,
  TResourceCache,
  TResourceName,
  TResourcePayloadMap,
} from "@/lib/types/reference.types"

/**
 * Создаёт пустой scope-кеш со всеми поддерживаемыми справочниками.
 */
export const createEmptyReferenceScope = (): TReferenceScopeCache => ({
  contragents: {},
  warehouses: {},
  payboxes: {},
  organizations: {},
  priceTypes: {},
  nomenclature: {},
})

/**
 * Обрезает кеш справочника до `maxEntries` самых свежих записей.
 *
 * @param cache - текущий кеш отдельных запросов справочника
 * @param maxEntries - максимальное число записей, которое нужно оставить
 */
export const pruneReferenceResourceCache = <T>(
  cache: TResourceCache<T>,
  maxEntries: number
) => {
  const entries = Object.entries(cache)

  if (entries.length <= maxEntries) {
    return cache
  }

  return Object.fromEntries(
    entries
      .sort((left, right) => left[1].fetchedAt - right[1].fetchedAt)
      .slice(entries.length - maxEntries)
  ) as TResourceCache<T>
}

/**
 * Проверяет, считается ли запись свежей относительно TTL.
 *
 * @param entry - кеш-запись, которую нужно проверить
 * @param ttlMs - время жизни записи в миллисекундах
 */
export const isReferenceEntryFresh = <T>(
  entry: TCacheEntry<T> | undefined,
  ttlMs: number
) => {
  if (!entry) {
    return false
  }

  return Date.now() - entry.fetchedAt < ttlMs
}

/**
 * Преобразует токен в короткий namespace для хранения кеша.
 *
 * @param token - текущий auth token пользователя
 */
export const getReferenceScopeKey = (token: string) => createTokenScope(token)

/**
 * Создаёт стабильный ключ для query-объекта справочника.
 *
 * @param query - параметры запроса, которые должны участвовать в кеш-ключе
 */
export const getReferenceCacheKey = (query?: object) =>
  createCacheKey(query ?? {})

/**
 * Возвращает кеш-запись справочника для конкретного token scope и query.
 *
 * @param scopes - все scope-кеши приложения
 * @param resource - имя справочника
 * @param token - текущий auth token пользователя
 * @param query - параметры запроса, по которым был получен ответ
 */
export const resolveReferenceResourceEntry = <K extends TResourceName>(
  scopes: TReferenceDataScopes,
  resource: K,
  token: string,
  query?: object
): TCacheEntry<TResourcePayloadMap[K]> | undefined => {
  const scope = scopes[getReferenceScopeKey(token)]
  if (!scope) {
    return undefined
  }

  const resourceCache = (scope[resource] ?? {}) as TResourceCache<
    TResourcePayloadMap[K]
  >
  return resourceCache[getReferenceCacheKey(query)]
}

/**
 * Добавляет или обновляет запись в кеше справочника и возвращает новый scopes-объект.
 *
 * @param scopes - текущее состояние всех scope-кешей
 * @param resource - имя справочника, который нужно обновить
 * @param token - auth token, определяющий scope
 * @param query - параметры запроса, на которые завязан кеш
 * @param data - свежий ответ API
 * @param maxEntries - лимит количества кеш-записей для этого справочника
 */
export const upsertReferenceScopeCache = <K extends TResourceName>(
  scopes: TReferenceDataScopes,
  resource: K,
  token: string,
  query: object | undefined,
  data: IListResponse<TResourcePayloadMap[K]>,
  maxEntries: number
) => {
  const scopeKey = getReferenceScopeKey(token)
  const cacheKey = getReferenceCacheKey(query)
  const previousScope = scopes[scopeKey] ?? createEmptyReferenceScope()
  const nextResourceCache = {
    ...previousScope[resource],
    [cacheKey]: {
      data,
      fetchedAt: Date.now(),
    },
  }

  return {
    ...scopes,
    [scopeKey]: {
      ...previousScope,
      [resource]: pruneReferenceResourceCache(nextResourceCache, maxEntries),
    },
  }
}
