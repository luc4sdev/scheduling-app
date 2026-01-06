import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { ToastContainer } from "react-toastify";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Scheduling App",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="pt-BR" suppressHydrationWarning className="antialiased">
      <body
        className={montserrat.className}
      >
        <Providers>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
          <ToastContainer stacked />
        </Providers>
      </body>
    </html>
  );
}
