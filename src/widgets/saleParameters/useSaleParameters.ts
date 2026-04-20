import { useEffect, useState } from "react"

import { useOrderStore } from "@/lib/store/order.store"
import { useReferenceDataStore } from "@/lib/store/referenceData.store"
import type {
  IOrganization,
  IPaybox,
  IPriceType,
  IWarehouse,
} from "@/lib/types/reference.types"

export const useSaleParameters = () => {
  const activeToken = useReferenceDataStore((state) => state.activeToken)
  const ensureOrganizations = useReferenceDataStore(
    (state) => state.ensureOrganizations
  )
  const ensurePayboxes = useReferenceDataStore((state) => state.ensurePayboxes)
  const ensureWarehouses = useReferenceDataStore(
    (state) => state.ensureWarehouses
  )
  const ensurePriceTypes = useReferenceDataStore(
    (state) => state.ensurePriceTypes
  )

  const organization = useOrderStore((state) => state.order.organization)
  const paybox = useOrderStore((state) => state.order.paybox)
  const warehouse = useOrderStore((state) => state.order.warehouse)
  const setOrderField = useOrderStore((state) => state.setOrderField)

  const [organizations, setOrganizations] = useState<IOrganization[]>([])
  const [payboxes, setPayboxes] = useState<IPaybox[]>([])
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([])
  const [priceTypes, setPriceTypes] = useState<IPriceType[]>([])
  const [priceTypeId, setPriceTypeId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!activeToken) {
      setOrganizations([])
      setPayboxes([])
      setWarehouses([])
      setPriceTypes([])
      setPriceTypeId("")
      setLoadError(null)
      return
    }

    let isMounted = true

    const loadReferenceData = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        const [
          organizationsResponse,
          payboxesResponse,
          warehousesResponse,
          priceTypesResponse,
        ] = await Promise.all([
          ensureOrganizations(activeToken),
          ensurePayboxes(activeToken),
          ensureWarehouses(activeToken),
          ensurePriceTypes(activeToken),
        ])

        if (!isMounted) {
          return
        }

        setOrganizations(organizationsResponse.result)
        setPayboxes(payboxesResponse.result)
        setWarehouses(warehousesResponse.result)
        setPriceTypes(priceTypesResponse.result)
        setOrderField(
          "organization",
          organizationsResponse.result[0]?.id ?? 0
        )
        setOrderField("paybox", payboxesResponse.result[0]?.id ?? 0)
        setOrderField("warehouse", warehousesResponse.result[0]?.id ?? 0)
        setPriceTypeId(priceTypesResponse.result[0]?.id?.toString() ?? "")
      } catch (error) {
        if (!isMounted) {
          return
        }

        console.error("Failed to load sale parameters", error)
        setLoadError("Не удалось загрузить параметры продажи")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadReferenceData()

    return () => {
      isMounted = false
    }
  }, [
    activeToken,
    ensureOrganizations,
    ensurePayboxes,
    ensurePriceTypes,
    ensureWarehouses,
  ])

  const handleOrganizationChange = (value: string | null) => {
    setOrderField("organization", value ? Number(value) : 0)
  }

  const handlePayboxChange = (value: string | null) => {
    setOrderField("paybox", value ? Number(value) : 0)
  }

  const handleWarehouseChange = (value: string | null) => {
    setOrderField("warehouse", value ? Number(value) : 0)
  }

  const handlePriceTypeChange = (value: string | null) => {
    setPriceTypeId(value ?? "")
  }

  return {
    organizations,
    payboxes,
    warehouses,
    priceTypes,
    organization,
    paybox,
    warehouse,
    priceTypeId,
    isLoading,
    loadError,
    handleOrganizationChange,
    handlePayboxChange,
    handleWarehouseChange,
    handlePriceTypeChange,
  }
}
