import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"

import {
  debounce,
  priceFormatter,
  resolveItemPrice,
  toGoodsItem,
} from "@/lib/utils"
import { useOrderStore } from "@/lib/store/order.store"
import { useReferenceDataStore } from "@/lib/store/referenceData.store"
import type { INomenclatureItem } from "@/lib/types/reference.types"

export const useProductsSearch = () => {
  const activeToken = useReferenceDataStore((state) => state.activeToken)
  const ensureNomenclature = useReferenceDataStore(
    (state) => state.ensureNomenclature
  )
  const setGoodsItem = useOrderStore((state) => state.setGoodsItem)

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [items, setItems] = useState<INomenclatureItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const debouncedUpdateQuery = useMemo(
    () => debounce((nextQuery: string) => setDebouncedQuery(nextQuery), 350),
    []
  )

  useEffect(() => {
    debouncedUpdateQuery(searchQuery.trim())

    return () => {
      debouncedUpdateQuery.cancel()
    }
  }, [debouncedUpdateQuery, searchQuery])

  useEffect(() => {
    if (!activeToken) {
      setItems([])
      setIsLoading(false)
      setLoadError(null)
      return
    }

    const normalizedQuery = debouncedQuery.trim()

    const currentRequestId = requestIdRef.current + 1
    requestIdRef.current = currentRequestId
    setIsLoading(true)
    setLoadError(null)

    void ensureNomenclature(activeToken, {
      ...(normalizedQuery ? { name: normalizedQuery } : {}),
      limit: 40,
      with_prices: true,
    })
      .then((response) => {
        if (requestIdRef.current !== currentRequestId) {
          return
        }

        setItems(response.result)
      })
      .catch((error) => {
        if (requestIdRef.current !== currentRequestId) {
          return
        }

        console.error("Failed to load products", error)
        setItems([])
        setLoadError("Не удалось загрузить товары")
      })
      .finally(() => {
        if (requestIdRef.current === currentRequestId) {
          setIsLoading(false)
        }
      })
  }, [activeToken, debouncedQuery, ensureNomenclature])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleAddItem = (item: INomenclatureItem) => {
    setGoodsItem(toGoodsItem(item))
  }

  const formatItemPrice = (item: INomenclatureItem) =>
    priceFormatter.format(resolveItemPrice(item))

  return {
    searchQuery,
    items,
    isLoading,
    loadError,
    activeToken,
    formatItemPrice,
    handleSearchChange,
    handleAddItem,
  }
}
