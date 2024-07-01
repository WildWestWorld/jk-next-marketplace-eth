import { BaseLayout } from "@/components/layout";


export default function RootLayout({ children }) {
  return (
    <>
      <BaseLayout>{children}</BaseLayout>
    </>
  )
}
