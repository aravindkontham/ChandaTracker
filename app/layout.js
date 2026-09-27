import "./globals.css";
import { Baloo_2, Inter } from "next/font/google";
import { AuthProvider } from "../lib/AuthContext";
import BackgroundArt from "../components/BackgroundArt";

const displayFont = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "Sri Ramanavami Chanda Tracker",
  description: "Track donation (chanda) collections for Sri Ramanavami",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-sans text-maroon-800 min-h-screen">
        <BackgroundArt />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}