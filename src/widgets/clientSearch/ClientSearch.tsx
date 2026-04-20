import { SearchIcon, PhoneIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useClientSearch } from "@/widgets/clientSearch/useClientSearch"

export const ClientSearch = () => {
  const {
    phone,
    clients,
    isSearching,
    searchError,
    selectedClientId,
    activeToken,
    handlePhoneChange,
    handleSearch,
    handleClientChange,
  } = useClientSearch()

  return (
    <section className="w-full max-w-[420px] rounded-3xl border border-border bg-card px-4 py-4 text-card-foreground shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-muted-foreground">
          <PhoneIcon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">2. Клиент</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Поиск клиента по телефону
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Field>
          <FieldContent className="gap-2">
            <FieldLabel
              className="w-full text-sm font-medium text-foreground"
              htmlFor="client-phone"
            >
              Телефон
            </FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                id="client-phone"
                className="h-11 rounded-2xl border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="+5"
                type="search"
                value={phone}
                onChange={handlePhoneChange}
              />
              <Button
                className="h-11 w-11 shrink-0 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80"
                disabled={!activeToken || isSearching}
                onClick={handleSearch}
                type="button"
              >
                <SearchIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
            {searchError ? (
              <FieldDescription className="text-destructive">
                {searchError}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Используется token, полученный при подключении кассы
              </FieldDescription>
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="gap-2">
            <FieldLabel
              className="w-full text-sm font-medium text-foreground"
              htmlFor="client-select"
            >
              Найденный клиент
            </FieldLabel>
            <Select
              id="client-select"
              value={selectedClientId ? String(selectedClientId) : undefined}
              onValueChange={handleClientChange}
              disabled={!clients.length}
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border-border bg-background px-4 text-sm">
                <SelectValue
                  placeholder={
                    clients.length ? "Выберите клиента" : "Сначала выполните поиск"
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-[var(--anchor-width)]">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.id} · {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </div>
    </section>
  )
}
