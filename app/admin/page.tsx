import AdminSidebar from "./components/adminSidebar";
import AdminNavbar from "./components/adminNavbar";

// const getUsers = async () => {
//   const res = await prisma.user.findMany({
//     select: {
//       id: true,
//       email: true,
//       nip: true,
//       name: true,
//       role: true,
//       gender: true,
//       status: true,
//     },
//   });
//   return res;
// };

export default async function AdminPage() {

  return (
    <>
      <AdminSidebar />
      <AdminNavbar />
    </>
  );
}
