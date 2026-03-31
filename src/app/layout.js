import { PT_Serif } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ToastProvider from "@/components/ToastProvider/ToastProvider";
import CityService from "@/services/city.service";

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
  const pathname = headersList.get("x-pathname") || "";
  const isAdminRoute = pathname.startsWith("/admins-piruza");

  let cities = [];
  if (!isAdminRoute) {
    try {
      const res = await CityService.getActiveCities(1, 100);
      cities = res?.data || [];
    } catch {
      cities = [];
    }
  }

  return (
    <html lang="ru">
      <body className={ptSerif.variable}>
        {!isAdminRoute && <Header cities={cities} />}
        {children}
        {!isAdminRoute && <Footer />}
        <ToastProvider />
      </body>
    </html>
  );
}