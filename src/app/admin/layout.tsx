import AdminAuthGate from "@/components/admin/AdminAuthGate";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Admin — Honeymoon Fund",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </div>
    </AdminAuthGate>
  );
}
