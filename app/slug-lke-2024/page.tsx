import SidebarUser from "../components/sidebarUser";
import Navbar from "../components/navbarReg";

export default function FillLke() {
  return (
    <div>
      <header className="main-header">
        <Navbar />
      </header>
      <main className="main-container lke-filling">
        <SidebarUser />
      </main>
    </div>
  );
}
