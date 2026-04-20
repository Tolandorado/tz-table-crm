import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { IGoodsItem, IOrder } from "@/types/order.types"

export interface IOrderState {
  order: IOrder
  replaceOrder: (order: IOrder) => void
  setOrder: (patch: Partial<IOrder>) => void
  setOrderField: <K extends keyof IOrder>(key: K, value: IOrder[K]) => void
  setGoodsItem: (item: IGoodsItem) => void
  removeGoodsItem: (index: number) => void
  resetOrder: () => void
}

// фабрик фн
export const createEmptyOrder = (): IOrder => ({
  number: "",
  priority: 0,
  dated: Math.floor(Date.now() / 1000),
  operation: "Заказ",
  tags: "",
  tax_included: true,
  tax_active: true,
  goods: [],
  settings: {},
  warehouse: 0,
  contragent: undefined,
  paybox: 0,
  organization: 0,
  status: false,
  paid_rubles: 0,
  paid_lt: 0,
})

export const useOrderStore = create<IOrderState>()(
  persist(
    (set) => ({
      order: createEmptyOrder(),
      replaceOrder: (order) => {
        set({ order })
      },
      setOrder: (patch) => {
        set((state) => ({
          order: {
            ...state.order,
            ...patch,
          },
        }))
      },
      setOrderField: (key, value) => {
        set((state) => ({
          order: {
            ...state.order,
            [key]: value,
          } as IOrder,
        }))
      },
      setGoodsItem: (item) => {
        set((state) => ({
          order: {
            ...state.order,
            goods: [
              ...state.order.goods,
              {
                ...item,
              },
            ],
          },
        }))
      },
      removeGoodsItem: (index) => {
        set((state) => ({
          order: {
            ...state.order,
            goods: state.order.goods.filter(
              (_, currentIndex) => currentIndex !== index
            ),
          },
        }))
      },
      resetOrder: () => {
        set({ order: createEmptyOrder() })
      },
    }),
    {
      name: "tablecrm-order-form",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        order: state.order,
      }),
    }
  )
)
