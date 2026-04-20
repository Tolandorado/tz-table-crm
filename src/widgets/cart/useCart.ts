import { useOrderStore } from "@/lib/store/order.store"
import type { IGoodsItem } from "@/lib/types/order.types"

const toNumber = (value: string) => {
  const normalized = value.replace(",", ".").trim()

  if (!normalized) {
    return 0
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const recalculateItem = (item: IGoodsItem) => ({
  ...item,
  sum_discounted: Math.max(item.price * item.quantity - item.discount, 0),
})

export const useCart = () => {
  const goods = useOrderStore((state) => state.order.goods)
  const setOrder = useOrderStore((state) => state.setOrder)
  const removeGoodsItem = useOrderStore((state) => state.removeGoodsItem)

  const handlePriceChange = (index: number, value: string) => {
    const nextPrice = Math.max(toNumber(value), 0)

    setOrder({
      goods: goods.map((item, currentIndex) =>
        currentIndex === index
          ? recalculateItem({
              ...item,
              price: nextPrice,
            })
          : item
      ),
    })
  }

  const handleQuantityChange = (index: number, value: string) => {
    const nextQuantity = Math.max(toNumber(value), 0)

    setOrder({
      goods: goods.map((item, currentIndex) =>
        currentIndex === index
          ? recalculateItem({
              ...item,
              quantity: nextQuantity,
            })
          : item
      ),
    })
  }

  const handleRemoveItem = (index: number) => {
    removeGoodsItem(index)
  }

  return {
    goods,
    handlePriceChange,
    handleQuantityChange,
    handleRemoveItem,
  }
}
