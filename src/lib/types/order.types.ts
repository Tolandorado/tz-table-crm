export interface IDocSaleGoodsItem {
  price: number
  quantity: number
  unit: number
  discount: number
  sum_discounted: number
  nomenclature: number
}

export interface IDocSaleOrder {
  priority: number
  dated: number
  operation: string
  tax_included: boolean
  tax_active: boolean
  goods: IDocSaleGoodsItem[]
  settings: ISettings
  loyality_card_id?: number
  warehouse: number
  contragent?: number
  paybox: number
  organization: number
  status: boolean
  paid_rubles: number | string
  paid_lt: number
}

export type TOrderRequest = IDocSaleOrder[]

export interface IOrder {
  number: string
  priority: number
  dated: number
  operation: string
  tags: string
  tax_included: boolean
  tax_active: boolean
  goods: IGoodsItem[]
  settings: ISettings
  loyality_card_id?: number
  warehouse: number
  contragent?: number
  paybox: number
  organization: number
  status: boolean
  paid_rubles: number | string
  paid_lt: number
}

export interface IGoodsItem {
  price: number
  price_type: number
  unit_name: string
  tax: number
  status: string
  nomenclature_name: string
  quantity: number
  unit: number
  discount: number
  sum_discounted: number
  nomenclature: number
}

export interface ISettings {
  repeatability_period?: string | number
  repeatability_value?: string | number
  repeatability_count?: string | number
  date_next_created?: number
}
