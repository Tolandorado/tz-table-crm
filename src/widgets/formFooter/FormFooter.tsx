import { Button } from "@/components/ui/button"
import { useFormFooter } from "@/widgets/formFooter/useFormFooter"

export const FormFooter = () => {
  const { total, handleCreateSale, handleCreateAndPost, rubleFormatter } =
    useFormFooter()

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
          <span className="text-sm text-muted-foreground">Итого</span>
          <span className="text-lg font-semibold tabular-nums">
            {rubleFormatter.format(total)}
          </span>
        </div>
        <Button
          disabled={total === 0}
          className="h-11 rounded-2xl bg-[#efab90] text-base font-medium text-white hover:bg-[#e99d7f]"
          onClick={handleCreateSale}
          type="button"
        >
          Создать продажу
        </Button>
        <Button
          disabled={total === 0}
          className="h-11 rounded-2xl border border-border bg-[#edf7f1] text-base font-medium text-muted-foreground hover:bg-[#e2f0e8]"
          onClick={handleCreateAndPost}
          type="button"
          variant="outline"
        >
          Создать и провести
        </Button>
      </div>
    </footer>
  )
}
