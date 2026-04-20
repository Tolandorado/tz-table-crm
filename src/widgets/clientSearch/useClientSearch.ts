import { useState, type ChangeEvent } from "react"

import { useOrderStore } from "@/lib/store/order.store"
import { useReferenceDataStore } from "@/lib/store/referenceData.store"
import type { IContragent } from "@/lib/types/reference.types"

export const useClientSearch = () => {
  const activeToken = useReferenceDataStore((state) => state.activeToken)
  const ensureContragents = useReferenceDataStore(
    (state) => state.ensureContragents
  )
  const selectedClientId = useOrderStore((state) => state.order.contragent)
  const setOrderField = useOrderStore((state) => state.setOrderField)

  const [phone, setPhone] = useState("+5")
  const [clients, setClients] = useState<IContragent[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value)
  }

  const handleSearch = async () => {
    const normalizedPhone = phone.trim().replace(/\s+/g, "")

    if (!activeToken) {
      setSearchError("Сначала подключите кассу")
      return
    }

    if (!normalizedPhone || isSearching) {
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const response = await ensureContragents(activeToken, {
        phone: normalizedPhone,
      })

      setClients(response.result)
      console.log("[client] search finished: ", response)

      if (!response.result.length) {
        setOrderField("contragent", undefined)
      }

      console.log("[client] contragents loaded", response.count)
    } catch (error) {
      console.error("Failed to search clients", error)
      setSearchError("Не удалось найти клиента")
    } finally {
      setIsSearching(false)
    }
  }

  const handleClientChange = (value: string | null) => {
    if (!value) {
      setOrderField("contragent", undefined)
      return
    }

    setOrderField("contragent", Number(value))
  }

  return {
    phone,
    clients,
    isSearching,
    searchError,
    selectedClientId,
    activeToken,
    handlePhoneChange,
    handleSearch,
    handleClientChange,
  }
}
