import { useState } from "react"
import { useOrderStore } from "@/lib/store/order.store"
import { useReferenceDataStore } from "@/lib/store/referenceData.store"
import { tableCrmApi } from "@/lib/tablecrmApi"
import type { IOrder, TOrderRequest } from "@/lib/types/order.types"

const calculateOrderTotal = (order: IOrder) =>
  order.goods.reduce((sum, item) => {
    const itemTotal =
      Number.isFinite(item.sum_discounted) && item.sum_discounted > 0
        ? item.sum_discounted
        : item.price * item.quantity - item.discount

    return sum + itemTotal
  }, 0)

export const useFormFooter = () => {
  const order = useOrderStore((state) => state.order)
  const activeToken = useReferenceDataStore((state) => state.activeToken)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = calculateOrderTotal(order)

  const buildPayload = (status: boolean): TOrderRequest => {
    const normalizedTotal = Number(total.toFixed(2))

    return [
      {
        ...order,
        status,
        paid_rubles: normalizedTotal,
      },
    ]
  }

  const submit = async (status: boolean) => {
    if (!activeToken || isSubmitting || total <= 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await tableCrmApi.submitOrder(activeToken, buildPayload(status))
      console.log("order submitted", { status, order })
    } catch (error) {
      console.error("Failed to submit order", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateSale = () => {
    void submit(false)
  }

  const handleCreateAndPost = () => {
    void submit(true)
  }

  const rubleFormatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  return {
    total,
    isSubmitting,
    handleCreateSale,
    handleCreateAndPost,
    rubleFormatter,
  }
}
