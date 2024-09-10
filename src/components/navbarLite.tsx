import Image from "next/image";
import styles from "@/styles/login.module.css"

export default function NavbarLite() {
  return (
    <header className={styles.loginHeader}>
      <nav className={styles.loginNav}>
        <Image src="images/navbar-flat.svg" alt="logo instansi" width={200} height={34} />
      </nav>
    </header>
  );
}
