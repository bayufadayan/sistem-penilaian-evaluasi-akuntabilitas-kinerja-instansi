import Image from "next/image";

export default function NavbarLite() {
  return (
    <header className="login-header">
      <nav className="login-nav">
        <Image src="images/navbar-flat.svg" alt="logo instansi" width={200} height={34} />
      </nav>
    </header>
  );
}