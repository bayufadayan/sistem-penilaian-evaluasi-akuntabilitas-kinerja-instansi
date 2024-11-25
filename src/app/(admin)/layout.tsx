import AdminNavbar from "./components/adminNavbar";
import AdminSidebar from "./components/adminSidebar";
import { pageTitles } from "@/lib/pageTitles";

export async function generateMetadata() {
  const title = await pageTitles.admin();
  return {
    title,
    description: "Login to Admin Dashboard",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <AdminNavbar />
          <AdminSidebar />

          <div className="p-8 ml-64 mt-14">{children}</div>
      </body>
    </html>
  );
}
