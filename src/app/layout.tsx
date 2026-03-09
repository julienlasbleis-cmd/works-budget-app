import "../styles/globals.css";
import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}