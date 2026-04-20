import { Toaster } from "@/components/ui/sonner"
import { Form } from "@/widgets/form/Form"
import { FormFooter } from "@/widgets/formFooter/FormFooter"

export const App = () => {
  return (
    <div className="relative min-h-svh">
      <Form />
      <FormFooter />
      <Toaster richColors position="top-center" />
    </div>
  )
}

export default App
