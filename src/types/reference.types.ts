export interface IListResponse<T> {
  result: T[]
  count: number
}

export interface IContragent {
  id: number
  name: string
  phone: string
}

export interface IWarehouse {
  name: string
  type: string
  description: string
  address: string
  phone: string
  parent: number
  is_public: boolean
  status: boolean
  id: number
  updated_at: number
  created_at: number
  longitude: number
  latitude: number
  qr_hash: string
  qr_url: string
}

export interface IPaybox {
  id: number
  external_id: string
  name: string
  start_balance: number
  balance: number
  balance_date: number
  created_at: number
  update_start_balance: number
  update_start_balance_date: number
  organization_id: number
  updated_at: number
  deleted_at: string | null
}

export interface IOrganization {
  type: string
  short_name: string
  full_name: string
  work_name: string
  prefix: string
  inn: number
  kpp: number
  okved: number
  okved2: number
  okpo: number
  ogrn: number
  org_type: unknown
  tax_type: unknown
  tax_percent: number
  registration_date: number
  id: number
  updated_at: number
  created_at: number
}

export interface IPriceType {
  name: string
  tags: string[]
  id: number
  updated_at: number
  created_at: number
}

export interface INomenclatureItem {
  name: string
  type: unknown
  description_short: string
  description_long: string
  code: string
  unit: number
  category: number
  manufacturer: number
  global_category_id: number
  chatting_percent: number
  cashback_type: unknown
  cashback_value: number
  external_id: string
  tags: string[]
  seo_title: string
  seo_description: string
  seo_keywords: string[]
  production_time_min_from: number
  production_time_min_to: number
  address: string
  latitude: number
  longitude: number
  video_link: string
  id: number
  unit_name: string
  barcodes: string[]
  prices: Array<Record<string, unknown>>
  balances: Array<Record<string, unknown>>
  attributes: Array<Record<string, unknown>>
  photos: Array<Record<string, unknown>>
  videos: Array<Record<string, unknown>>
  group_id: number
  group_name: string
  is_main: boolean
  qr_hash: string
  qr_url: string
  updated_at: number
  created_at: number
}

export interface IContragentsQuery {
  limit?: number
  offset?: number
  sort?: string
  add_tags?: boolean
  name?: string
  inn?: number
  phone?: string
  external_id?: string
  updated_at__gte?: number
  updated_at__lte?: number
  created_at__gte?: number
  created_at__lte?: number
}

export interface IWarehousesQuery {
  name?: string
  limit?: number
  offset?: number
  with_hash?: boolean
}

export interface IPayboxesQuery {
  limit?: number
  offset?: number
  sort?: string
  external_id?: string
  name?: string
}

export interface IOrganizationsQuery {
  limit?: number
  offset?: number
}

export interface IPriceTypesQuery {
  limit?: number
  offset?: number
  tags?: string
  mode?: "or" | "and" | string
}

export interface INomenclatureQuery {
  name?: string
  barcode?: string
  category?: number
  global_category_id?: number
  global_category_name?: string
  description_long?: string
  description_short?: string
  has_photos?: boolean
  tags?: string
  chatting_percent?: number
  has_video?: boolean
  limit?: number
  offset?: number
  with_prices?: boolean
  with_balance?: boolean
  with_attributes?: boolean
  with_photos?: boolean
  with_hash?: boolean
  only_main_from_group?: boolean
  min_price?: number
  max_price?: number
  sort?: string
  updated_at__gte?: number
  updated_at__lte?: number
  created_at__gte?: number
  created_at__lte?: number
}

//====================
// Ниже идут типы, связанные с кешированием справочников в приложении
//====================

export type TCacheEntry<T> = {
  data: IListResponse<T>
  fetchedAt: number
}

export type TResourceCache<T> = Record<string, TCacheEntry<T>>

export type TReferenceScopeCache = {
  contragents: TResourceCache<IContragent>
  warehouses: TResourceCache<IWarehouse>
  payboxes: TResourceCache<IPaybox>
  organizations: TResourceCache<IOrganization>
  priceTypes: TResourceCache<IPriceType>
  nomenclature: TResourceCache<INomenclatureItem>
}

export type TReferenceDataScopes = Record<string, TReferenceScopeCache>

/**
 * Допустимые ключи справочников, которые поддерживает кеш.
 */
export type TResourceName = keyof TReferenceScopeCache

/**
 * Карта "имя справочника -> тип элемента результата".
 */
export type TResourcePayloadMap = {
  contragents: IContragent
  warehouses: IWarehouse
  payboxes: IPaybox
  organizations: IOrganization
  priceTypes: IPriceType
  nomenclature: INomenclatureItem
}
