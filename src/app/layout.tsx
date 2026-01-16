import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import SideBar from "@/components/sideBar";
import { Footer } from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar-context";

export const metadata: Metadata = {
  title: "Dermacor",
  description: "Dermacor Application",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es">
      <body className="antialiased">
        <Providers>
           <SidebarProvider>
                <Header />
                <SideBar>
                    {children} 
                </SideBar>
            </SidebarProvider>
          
        </Providers>
      </body>
    </html>
  );
}
