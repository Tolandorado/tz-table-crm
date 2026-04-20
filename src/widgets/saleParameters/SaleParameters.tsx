import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
            <Select
              value={organization ? String(organization) : null}
              onValueChange={handleOrganizationChange}
            >
              <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background px-3.5 text-sm">
                <SelectValue placeholder={isLoading ? "Загрузка..." : "Выберите организацию"} />
              </SelectTrigger>
              <SelectContent className="w-[var(--anchor-width)]">
                {organizations.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.short_name || item.full_name || item.work_name || item.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="gap-2">
            <FieldLabel className="w-full text-sm font-medium text-foreground">
              Счёт
            </FieldLabel>
            <Select
              value={paybox ? String(paybox) : null}
              onValueChange={handlePayboxChange}
            >
              <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background px-3.5 text-sm">
                <SelectValue placeholder={isLoading ? "Загрузка..." : "Выберите счёт"} />
              </SelectTrigger>
              <SelectContent className="w-[var(--anchor-width)]">
                {payboxes.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name || item.external_id || item.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="gap-2">
            <FieldLabel className="w-full text-sm font-medium text-foreground">
              Склад
            </FieldLabel>
            <Select
              value={warehouse ? String(warehouse) : null}
              onValueChange={handleWarehouseChange}
            >
              <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background px-3.5 text-sm">
                <SelectValue placeholder={isLoading ? "Загрузка..." : "Выберите склад"} />
              </SelectTrigger>
              <SelectContent className="w-[var(--anchor-width)]">
                {warehouses.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name || item.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="gap-2">
            <FieldLabel className="w-full text-sm font-medium text-foreground">
              Тип цены
            </FieldLabel>
            <Select value={priceTypeId || null} onValueChange={handlePriceTypeChange}>
              <SelectTrigger className="h-10 w-full rounded-2xl border-border bg-background px-3.5 text-sm">
                <SelectValue placeholder={isLoading ? "Загрузка..." : "Выберите тип цены"} />
              </SelectTrigger>
              <SelectContent className="w-[var(--anchor-width)]">
                {priceTypes.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        {loadError ? (
          <p className="text-sm text-destructive">{loadError}</p>
        ) : null}
      </div>
    </section>
  )
}
