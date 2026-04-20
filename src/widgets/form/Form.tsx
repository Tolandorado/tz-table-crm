import { useForm } from "@/widgets/form/useForm"
import { Cart } from "@/widgets/cart/Cart"
import { CashboxConnection } from "@/widgets/cashboxConnection/CashboxConnection"
import { ClientSearch } from "@/widgets/clientSearch/ClientSearch"
import { ProductsSearch } from "@/widgets/productsSearch/ProductsSearch"
import { SaleParameters } from "@/widgets/saleParameters/SaleParameters"

export const Form = () => {
  useForm()

  return (
    <main className="flex min-h-svh w-full items-start justify-center px-4 py-6 pb-48">
      <div className="flex w-full flex-col items-center gap-4">
        <CashboxConnection />
        <ClientSearch />
        <SaleParameters />
        <ProductsSearch />
        <Cart />
      </div>
    </main>
  )
}
