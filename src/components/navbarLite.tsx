import Image from "next/image";
import styles from "@/styles/login.module.css"
import Link from "next/link";

export default function NavbarLite() {
  return (
    <header className={styles.loginHeader}>
      <nav className={styles.loginNav}>
        <Link href={"/login"}><Image src="/images/navbar-flat.svg" alt="logo instansi" width={200} height={34} /></Link>
      </nav>
    </header>
  );
}
