import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCashboxConnection } from "@/widgets/cashboxConnection/useCashboxConnection"

export const CashboxConnection = () => {
  const { token, isConnecting, handleTokenChange, handleConnect } =
    useCashboxConnection()

  return (
    <section className="w-full max-w-[420px] rounded-3xl border border-border bg-card px-4 py-4 text-card-foreground shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">1. Подключение кассы</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Введите token и загрузите справочники
          </p>
        </div>
      </div>

      <Field>
        <FieldContent className="gap-2">
          <FieldLabel
            className="w-full text-sm font-medium text-foreground"
            htmlFor="cashbox-token"
          >
            Token
          </FieldLabel>
          <Input
            id="cashbox-token"
            className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Введите token кассы"
            value={token}
            onChange={handleTokenChange}
          />
          <FieldDescription className="sr-only">
            Token для подключения кассы
          </FieldDescription>
        </FieldContent>

        <Button
          disabled={!token || isConnecting}
          className="h-11 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
          onClick={handleConnect}
          type="button"
        >
          {isConnecting ? "Подключаем..." : "Подключить"}
        </Button>
      </Field>
    </section>
  )
}
