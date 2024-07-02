import { BaseLayout } from "@/components/ui/layout";


export default function RootLayout({ children }) {
  return (
    <>
      <BaseLayout>{children}</BaseLayout>
    </>
  )
}
