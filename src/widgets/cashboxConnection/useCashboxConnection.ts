import { useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { useReferenceDataStore } from "@/lib/store/referenceData.store"
import { errorToToastString } from "@/lib/utils"

export const useCashboxConnection = () => {
  const [token, setToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const {
    setActiveToken,
    ensureWarehouses,
    ensurePayboxes,
    ensureOrganizations,
    ensurePriceTypes,
  } = useReferenceDataStore()

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value)
  }

  const handleConnect = async () => {
    const trimmedToken = token.trim()

    if (isConnecting) {
      return
    }

    if (!trimmedToken) {
      toast.error("Введите token кассы")
      return
    }

    setIsConnecting(true)
    // console.log("[cashbox] connect started")
    // console.log("[cashbox] token scoped")

    try {
      console.log("[cashbox] loading warehouses")
      // const warehouses =
      await ensureWarehouses(trimmedToken)
      // console.log("[cashbox] warehouses loaded", warehouses.count)

      console.log("[cashbox] loading payboxes")
      // const payboxes =
      await ensurePayboxes(trimmedToken)
      // console.log("[cashbox] payboxes loaded", payboxes.count)

      console.log("[cashbox] loading organizations")
      // const organizations =
      await ensureOrganizations(trimmedToken)
      // console.log("[cashbox] organizations loaded", organizations.count)

      console.log("[cashbox] loading price types")
      // const priceTypes =
      await ensurePriceTypes(trimmedToken)
      // console.log("[cashbox] price types loaded", priceTypes.count)

      setActiveToken(trimmedToken)
      toast.success("Касса подключена")
    } catch (error) {
      console.error("Failed to connect cashbox", error)
      toast.error(errorToToastString(error))
    } finally {
      setIsConnecting(false)
    }
  }

  return {
    token,
    isConnecting,
    handleTokenChange,
    handleConnect,
  }
}
