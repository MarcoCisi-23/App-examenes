import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ART Sanidad Móvil",
  description: "Exámenes médicos periódicos — ANDINA ART",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ART Sanidad",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#005c73",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={rubik.variable}>
      <head>
        {/* display=block: los íconos son parte del contenido (no texto de
            respaldo legible) — mejor esperar brevemente a que cargue la
            fuente que mostrar el nombre del ícono como texto. */}
        {/* eslint-disable-next-line @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className={`${rubik.className} antialiased flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
