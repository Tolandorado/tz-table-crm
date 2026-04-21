import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useSaleParameters } from "@/widgets/saleParameters/useSaleParameters"

export const SaleParameters = () => {
  const {
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
  } = useSaleParameters()

  return (
    <section className="w-full max-w-[420px] rounded-3xl border border-border bg-card px-4 py-4 text-card-foreground shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="mb-4">
        <p className="text-sm font-medium">3. Параметры продажи</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Счёт, организация, склад и тип цены
        </p>
      </div>

      <div className="space-y-3">
        <Field>
          <FieldContent className="gap-2">
            <FieldLabel className="w-full text-sm font-medium text-foreground">
              Организация
            </FieldLabel>
            <NativeSelect
              disabled={organizations.length === 0 || isLoading}
              value={organization ? String(organization) : ""}
              onChange={(e) => handleOrganizationChange(e.target.value)}
              className="w-full [&>select]:h-10 [&>select]:rounded-2xl [&>select]:border-border [&>select]:bg-background [&>select]:px-3.5 [&>select]:text-sm"
            >
              <NativeSelectOption value="" disabled hidden>
                {isLoading ? "Загрузка..." : "Выберите организацию"}
              </NativeSelectOption>
              {organizations.map((item) => (
                <NativeSelectOption key={item.id} value={String(item.id)}>
                  {item.short_name || item.full_name || item.work_name || item.id}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="gap-2">
            <FieldLabel className="w-full text-sm font-medium text-foreground">
              Счёт
            </FieldLabel>
            <NativeSelect
              disabled={payboxes.length === 0 || isLoading}
              value={paybox ? String(paybox) : ""}
              onChange={(e) => handlePayboxChange(e.target.value)}
              className="w-full [&>select]:h-10 [&>select]:rounded-2xl [&>select]:border-border [&>select]:bg-background [&>select]:px-3.5 [&>select]:text-sm"
            >
              <NativeSelectOption value="" disabled hidden>
                {isLoading ? "Загрузка..." : "Выберите счёт"}
              </NativeSelectOption>
              {payboxes.map((item) => (
                <NativeSelectOption key={item.id} value={String(item.id)}>
                  {item.name || item.external_id || item.id}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="gap-2">
            <FieldLabel className="w-full text-sm font-medium text-foreground">
              Склад
            </FieldLabel>
            <NativeSelect
              disabled={warehouses.length === 0 || isLoading}
              value={warehouse ? String(warehouse) : ""}
              onChange={(e) => handleWarehouseChange(e.target.value)}
              className="w-full [&>select]:h-10 [&>select]:rounded-2xl [&>select]:border-border [&>select]:bg-background [&>select]:px-3.5 [&>select]:text-sm"
            >
              <NativeSelectOption value="" disabled hidden>
                {isLoading ? "Загрузка..." : "Выберите склад"}
              </NativeSelectOption>
              {warehouses.map((item) => (
                <NativeSelectOption key={item.id} value={String(item.id)}>
                  {item.name || item.id}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="gap-2">
            <FieldLabel className="w-full text-sm font-medium text-foreground">
              Тип цены
            </FieldLabel>
            <NativeSelect
              disabled={priceTypes.length === 0 || isLoading}
              value={priceTypeId || ""}
              onChange={(e) => handlePriceTypeChange(e.target.value)}
              className="w-full [&>select]:h-10 [&>select]:rounded-2xl [&>select]:border-border [&>select]:bg-background [&>select]:px-3.5 [&>select]:text-sm"
            >
              <NativeSelectOption value="" disabled hidden>
                {isLoading ? "Загрузка..." : "Выберите тип цены"}
              </NativeSelectOption>
              {priceTypes.map((item) => (
                <NativeSelectOption key={item.id} value={String(item.id)}>
                  {item.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FieldContent>
        </Field>

        {loadError ? (
          <p className="text-sm text-destructive">{loadError}</p>
        ) : null}
      </div>
    </section>
  )
}
