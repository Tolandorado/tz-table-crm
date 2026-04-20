import { useOrderStore } from "@/lib/store/order.store"

export const useForm = () => {
  const replaceOrder = useOrderStore((state) => state.replaceOrder)
  const setOrder = useOrderStore((state) => state.setOrder)
  const setOrderField = useOrderStore((state) => state.setOrderField)
  const setGoodsItem = useOrderStore((state) => state.setGoodsItem)
  const removeGoodsItem = useOrderStore((state) => state.removeGoodsItem)
  const resetOrder = useOrderStore((state) => state.resetOrder)

  return {
    replaceOrder,
    setOrder,
    setOrderField,
    setGoodsItem,
    removeGoodsItem,
    resetOrder,
  }
}
