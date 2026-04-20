import { Loader2Icon, PackageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useProductsSearch } from "@/widgets/productsSearch/useProductsSearch"

export const ProductsSearch = () => {
  const {
    searchQuery,
    items,
    isLoading,
    loadError,
    activeToken,
    formatItemPrice,
    handleSearchChange,
    handleAddItem,
  } = useProductsSearch()

  return (
    <section className="w-full max-w-[420px] rounded-3xl border border-border bg-card px-4 py-4 text-card-foreground shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-muted-foreground">
          <PackageIcon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">4. Товары</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Поиск и добавление номенклатуры
          </p>
        </div>
      </div>

      <Field>
        <FieldContent className="gap-2">
          <FieldLabel className="w-full text-sm font-medium text-foreground" htmlFor="products-search">
            Поиск
          </FieldLabel>
          <Input
            id="products-search"
            className="h-11 rounded-2xl border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Начните вводить название товара"
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={!activeToken}
          />
          <FieldDescription>
            {activeToken ? "Результаты обновляются после паузы в наборе" : "Сначала подключите кассу"}
          </FieldDescription>
        </FieldContent>
      </Field>

      <div className="mt-4 h-72 overflow-y-auto rounded-2xl border border-border bg-background">
        {isLoading ? (
          <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
            Загрузка товаров...
          </div>
        ) : loadError ? (
          <div className="px-4 py-4 text-sm text-destructive">{loadError}</div>
        ) : !activeToken ? (
          <div className="px-4 py-4 text-sm text-muted-foreground">
            Подключите кассу для поиска товаров
          </div>
        ) : items.length ? (
          <div className="divide-y divide-border">
            {items.map((item) => {
              const price = formatItemPrice(item)

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm leading-5 font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{price}</p>
                  </div>
                  <Button
                    className="h-8 shrink-0 px-3 text-sm"
                    onClick={() => handleAddItem(item)}
                    type="button"
                    variant="ghost"
                  >
                    Добавить
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="px-4 py-4 text-sm text-muted-foreground">
            {searchQuery.trim() ? "Ничего не найдено" : "Нет товаров"}
          </div>
        )}
      </div>
    </section>
  )
}
