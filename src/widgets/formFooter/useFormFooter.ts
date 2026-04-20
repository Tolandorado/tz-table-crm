import { useOrderStore } from "@/lib/store/order.store"

export const useFormFooter = () => {
  const order = useOrderStore((state) => state.order)

  const total = order.goods.reduce((sum, item) => {
    const itemTotal =
      Number.isFinite(item.sum_discounted) && item.sum_discounted > 0
        ? item.sum_discounted
        : item.price * item.quantity - item.discount

    return sum + itemTotal
  }, 0)

  const handleCreateSale = () => {
    console.log("create sale", order)
  }

  const handleCreateAndPost = () => {
    console.log("create and post", order)
  }

  const rubleFormatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  return {
    total,
    handleCreateSale,
    handleCreateAndPost,
    rubleFormatter,
  }
}
