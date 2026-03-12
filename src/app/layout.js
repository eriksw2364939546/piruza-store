import { PT_Serif } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ToastProvider from "@/components/ToastProvider/ToastProvider";

const ptSerif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
  display: "swap",
});

export const metadata = {
  title: "Piruza Store",
  description: "Piruza Store",
};

export default async function RootLayout({ children }) {
  const headersList = await headers();

  // middleware.js передаёт x-pathname для всех /admins-piruza/* роутов
  const pathname = headersList.get("x-pathname") || "";
  const isAdminRoute = pathname.startsWith("/admins-piruza");

  return (
    <html lang="ru">
      <body className={ptSerif.variable}>
        {!isAdminRoute && <Header />}
        {children}
        {!isAdminRoute && <Footer />}
        <ToastProvider />
      </body>
    </html>
  );
}