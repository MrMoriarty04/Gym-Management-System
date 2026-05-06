import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import StoreProvider from "./redux/StoreProvider";
import ChakraProviders from "./ChakraProviders";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata = {
  title: "IRON PULSE",
  description: "High-performance gym management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable}`}>
      <body>
        <ChakraProviders>
        <StoreProvider>{children}</StoreProvider>
        </ChakraProviders>
      </body>
    </html>
  );
}
