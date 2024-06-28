import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


const Noop = ({ children }) => <>{children}</>


export default function RootLayout({ children }) {

  const Layout = children.Layout ?? Noop

  return (
    <html lang="en">
      <body className={inter.className}>

        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
