import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";

export const metadata = {
  title: "Sri Ramanavami Chanda Tracker",
  description: "Track donation (chanda) collections for Sri Ramanavami",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-saffron-50 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
