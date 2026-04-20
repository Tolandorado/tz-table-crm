import { useState, type ChangeEvent } from "react"

import { useReferenceDataStore } from "@/lib/store/referenceData.store"

export const useCashboxConnection = () => {
  const [token, setToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const {
    setActiveToken,
    ensureWarehouses,
    ensurePayboxes,
    ensureOrganizations,
    ensurePriceTypes,
    ensureNomenclature,
  } = useReferenceDataStore()

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value)
  }

  const handleConnect = async () => {
    const trimmedToken = token.trim()

    if (!trimmedToken || isConnecting) {
      return
    }

    setIsConnecting(true)
    console.log("[cashbox] connect started")
    console.log("[cashbox] token scoped")

    try {
      console.log("[cashbox] loading warehouses")
      const warehouses = await ensureWarehouses(trimmedToken)
      console.log("[cashbox] warehouses loaded", warehouses.count)

      console.log("[cashbox] loading payboxes")
      const payboxes = await ensurePayboxes(trimmedToken)
      console.log("[cashbox] payboxes loaded", payboxes.count)

      console.log("[cashbox] loading organizations")
      const organizations = await ensureOrganizations(trimmedToken)
      console.log("[cashbox] organizations loaded", organizations.count)

      console.log("[cashbox] loading price types")
      const priceTypes = await ensurePriceTypes(trimmedToken)
      console.log("[cashbox] price types loaded", priceTypes.count)

      console.log("[cashbox] loading nomenclature")
      const nomenclature = await ensureNomenclature(trimmedToken, {
        limit: 20,
        with_prices: true,
      })
      console.log("[cashbox] nomenclature loaded", nomenclature.count)

      setActiveToken(trimmedToken)
      console.log("[cashbox] connect finished")
    } catch (error) {
      console.error("Failed to connect cashbox", error)
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
