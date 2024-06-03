import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import BgPattern from "./components/BgPattern";
import "./globals.css";

export const metadata: Metadata = {
  title: "To Do List",
  description: "Created By Andrei Predoi",
};
const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
          className={`w-[100vw] h-[100vh] ${poppins.className} overflow-x-hidden`}
        >
          <div className="-z-10 fixed scale-50 -top-28 -right-48 md:scale-75 md:-right-24 md:-top-11 lg:scale-90 lg:-right-10 xl:scale-100 xl:top-0 xl:right-0">
            <BgPattern />
          </div>
          {children}
          <Toaster position="bottom-right" richColors  />
        </body>
    </html>
  );
}
