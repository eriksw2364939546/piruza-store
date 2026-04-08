import { PT_Serif } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider/ToastProvider";

const ptSerif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://piruzastore.online'),
  title: 'Piruza Store',
  description: 'Piruza Store',
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={ptSerif.variable}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}