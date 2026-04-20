import { Trash2Icon, ShoppingCartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/widgets/cart/useCart"
import { priceFormatter } from "@/lib/utils"

export const Cart = () => {
  const { goods, handlePriceChange, handleQuantityChange, handleRemoveItem } =
    useCart()

  return (
    <section className="w-full max-w-[420px] rounded-3xl border border-border bg-card px-4 py-4 text-card-foreground shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-muted-foreground">
          <ShoppingCartIcon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">5. Корзина</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Количество, цена и сумма по позициям
          </p>
        </div>
      </div>

      <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
        {goods.length ? (
          goods.map((item, index) => {
            const sum = Math.max(item.price * item.quantity - item.discount, 0)

            return (
              <div
                key={`${item.nomenclature}-${index}`}
                className="rounded-2xl border border-border bg-background px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-sm font-medium leading-5">
                    {item.nomenclature_name}
                  </p>
                  <Button
                    className="h-8 w-8 shrink-0 rounded-full text-muted-foreground"
                    onClick={() => handleRemoveItem(index)}
                    type="button"
                    variant="ghost"
                  >
                    <Trash2Icon className="size-4" aria-hidden="true" />
                  </Button>
                </div>

                <Separator className="my-3" />

                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldContent className="gap-2">
                      <FieldLabel className="text-sm font-medium text-foreground">
                        Количество
                      </FieldLabel>
                      <Input
                        className="h-10 rounded-2xl border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        inputMode="numeric"
                        type="number"
                        value={String(item.quantity)}
                        onChange={(event) =>
                          handleQuantityChange(index, event.target.value)
                        }
                        min={0}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldContent className="gap-2">
                      <FieldLabel className="text-sm font-medium text-foreground">
                        Цена
                      </FieldLabel>
                      <Input
                        className="h-10 rounded-2xl border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        inputMode="decimal"
                        type="number"
                        value={String(item.price)}
                        onChange={(event) =>
                          handlePriceChange(index, event.target.value)
                        }
                        min={0}
                      />
                    </FieldContent>
                  </Field>
                </div>

                <p className="mt-3 text-right text-sm text-muted-foreground">
                  Сумма: {priceFormatter.format(sum)}
                </p>
              </div>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
            Корзина пуста
          </div>
        )}
      </div>
    </section>
  )
}
