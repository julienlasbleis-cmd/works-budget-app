import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "20px" }}>
        {children}
      </main>
    </div>
  );
}