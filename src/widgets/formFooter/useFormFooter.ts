import { useState } from "react"
import { isAxiosError } from "axios"
import { toast } from "sonner"

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

  const buildPayload = (): TOrderRequest => {
    const paidRubles = total.toFixed(2)
    const dated = Math.floor(Date.now() / 1000)
    const goods = order.goods.map((item) => ({
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      discount: item.discount,
      sum_discounted: item.sum_discounted,
      nomenclature: item.nomenclature,
    }))

    return [
      {
        priority: order.priority,
        dated,
        operation: order.operation,
        tax_included: order.tax_included,
        tax_active: order.tax_active,
        goods,
        settings: order.settings,
        loyality_card_id: order.loyality_card_id,
        warehouse: order.warehouse,
        contragent: order.contragent,
        paybox: order.paybox,
        organization: order.organization,
        status: false,
        paid_rubles: paidRubles,
        paid_lt: order.paid_lt,
      },
    ]
  }

  const submit = async (conduct: boolean) => {
    if (isSubmitting || !activeToken) {
      return
    }

    setIsSubmitting(true)

    try {
      const payload = buildPayload()
      await tableCrmApi.submitOrder(activeToken, payload, conduct)
      toast.success(
        conduct ? "Продажа создана и проведена" : "Продажа успешно создана"
      )
    } catch (error) {
      console.error("Failed to submit order", error)
      const message = isAxiosError(error)
        ? typeof error.response?.data === "string"
          ? error.response.data
          : ((error.response?.data as { detail?: string } | undefined)
              ?.detail ?? error.message)
        : "Не удалось отправить заказ"
      toast.error(message)
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
