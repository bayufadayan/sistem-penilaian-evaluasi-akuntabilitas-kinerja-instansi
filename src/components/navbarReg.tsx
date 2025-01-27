"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "@/styles/styles.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiMenu4Line } from "react-icons/ri";
import { RiCloseLargeLine } from "react-icons/ri";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoLoading, setisLogoLoading] = useState(false);
  const [settings, setSettings] = useState({
    appName: "",
    appLogoLogin: "",
    appLogoDashboard: "",
    appLogoFooter: "",
    favicon: "",
    adminEmail: "",
    adminMailPass: "",
    adminPhone: "",
    guideLink: "",
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileDropdown = () => {
    setMobileDropdownOpen(!mobileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setisLogoLoading(true);
        const response = await fetch("/api/settings");
        const data = await response.json();
        setSettings(data);
        setisLogoLoading(false);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <nav className={styles.mainNav}>
      <button type="button" className={`${styles.navToggle} shadow-md ${mobileMenuOpen ? "bg-gray-200" : ""} `} onClick={toggleMobileMenu}>
        {mobileMenuOpen
          ? (<RiCloseLargeLine className="w-7 h-7 fill-gray-400" />)
          : (<RiMenu4Line className="w-7 h-7 fill-gray-600" />)}
      </button>

      {
        mobileMenuOpen && (<div className={styles.navMobileMenu}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}>
          <ul className="flex flex-col justify-center items-center gap-4 p-4 bg-transparent">
            <Link href={"/"} className="py-3 text-white w-full rounded-xl border-2 border-white bg-black bg-opacity-30 border-opacity-50 text-center font-bold text-lg hover:bg-blue-600 hover:bg-opacity-50" onClick={toggleMobileMenu}>
              Beranda
            </Link>
            <Link href={"/guide"} className="py-3 text-white w-full rounded-xl border-2 border-white bg-black bg-opacity-30 border-opacity-50 text-center font-bold text-lg hover:bg-blue-600 hover:bg-opacity-50" onClick={toggleMobileMenu}>
              Panduan
            </Link>
            <Link href={"/activities"} className="py-3 text-white w-full rounded-xl border-2 border-white bg-black bg-opacity-30 border-opacity-50 text-center font-bold text-lg hover:bg-blue-600 hover:bg-opacity-50" onClick={toggleMobileMenu}>
              Aktivitas
            </Link>
            <Link href={"/results"} className="py-3 text-white w-full rounded-xl border-2 border-white bg-black bg-opacity-30 border-opacity-50 text-center font-bold text-lg hover:bg-blue-600 hover:bg-opacity-50" onClick={toggleMobileMenu}>
              Hasil
            </Link>
            <li className="py-3 text-white w-full rounded-xl border-2 border-white bg-black bg-opacity-30 border-opacity-50 text-center font-bold text-lg hover:bg-blue-600 hover:bg-opacity-50">
              <ul className="flex justify-center items-center">
                {status === "authenticated" && session?.user ? (
                  <li className="relative flex justify-center items-center w-full">
                    <button
                      type="button"
                      className="flex items-center space-x-2 w-full"
                      onClick={toggleMobileDropdown}
                    >
                      <ul className={`flex justify-between items-center text-white px-4 w-full`} >
                        <li>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <title hidden>Account icon</title>
                            <path
                              d="M6 2H18C19.0609 2 20.0783 2.42143 20.8284 3.17157C21.5786 3.92172 22 4.93913 22 6V18C22 19.0609 21.5786 20.0783 20.8284 20.8284C20.0783 21.5786 19.0609 22 18 22H6C4.93913 22 3.92172 21.5786 3.17157 20.8284C2.42143 20.0783 2 19.0609 2 18V6C2 4.93913 2.42143 3.92172 3.17157 3.17157C3.92172 2.42143 4.93913 2 6 2V2ZM6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6ZM7.229 20H6C5.71995 20.0002 5.44297 19.9416 5.187 19.828C5.41155 18.9832 5.83143 18.203 6.4128 17.5503C6.99416 16.8975 7.72075 16.3905 8.534 16.07C8.65695 16.0175 8.78916 15.9903 8.92283 15.9898C9.0565 15.9893 9.18891 16.0156 9.31223 16.0672C9.43555 16.1188 9.54728 16.1945 9.64082 16.29C9.73436 16.3855 9.8078 16.4988 9.85681 16.6231C9.90582 16.7475 9.9294 16.8804 9.92615 17.014C9.92291 17.1477 9.8929 17.2793 9.83792 17.4011C9.78293 17.523 9.70408 17.6325 9.60602 17.7234C9.50796 17.8142 9.39268 17.8845 9.267 17.93C8.80148 18.1134 8.37958 18.3924 8.02854 18.7489C7.67751 19.1055 7.40513 19.5317 7.229 20ZM16.741 20C16.5536 19.5292 16.2705 19.1024 15.9095 18.7467C15.5485 18.3911 15.1176 18.1143 14.644 17.934C14.5175 17.8901 14.4012 17.8213 14.3018 17.7316C14.2024 17.6419 14.1221 17.5332 14.0655 17.4119C14.009 17.2905 13.9773 17.1591 13.9725 17.0253C13.9677 16.8916 13.9897 16.7582 14.0374 16.6331C14.0851 16.508 14.1574 16.3938 14.25 16.2972C14.3427 16.2006 14.4538 16.1235 14.5767 16.0706C14.6997 16.0177 14.832 15.9901 14.9659 15.9893C15.0998 15.9885 15.2324 16.0146 15.356 16.066C16.184 16.3814 16.9264 16.8869 17.5234 17.5417C18.1204 18.1965 18.5553 18.9824 18.793 19.836C18.5427 19.9444 18.2728 20.0002 18 20H16.74H16.741ZM12 6C13.0609 6 14.0783 6.42143 14.8284 7.17157C15.5786 7.92172 16 8.93913 16 10V12C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16C10.9391 16 9.92172 15.5786 9.17157 14.8284C8.42143 14.0783 8 13.0609 8 12V10C8 8.93913 8.42143 7.92172 9.17157 7.17157C9.92172 6.42143 10.9391 6 12 6ZM12 8C11.4696 8 10.9609 8.21071 10.5858 8.58579C10.2107 8.96086 10 9.46957 10 10V12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V10C14 9.46957 13.7893 8.96086 13.4142 8.58579C13.0391 8.21071 12.5304 8 12 8Z"
                              fill="#fff"
                            />
                          </svg>
                        </li>
                        <li>
                          {(session?.user?.name?.length ?? 0) > 13
                            ? `${session?.user?.name?.slice(0, 13)}...`
                            : session.user.name}
                        </li>
                        <li>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <title hidden>dropdown</title>
                            <path
                              d="M7 10L12 15L17 10"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </li>
                      </ul>
                    </button>

                    {mobileDropdownOpen && (
                      <div className="absolute top-0 right-0 mt-14 w-[75vw] bg-white rounded-md shadow-2xl z-20 border-separate text-[#001D6C]">
                        <ul className="py-1 text-base">
                          {session.user.role === "ADMIN" && (
                            <li className="px-4 py-4 hover:bg-gray-100 cursor-pointer">
                              <a href="/admin" className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="30"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="h-6 w-6 me-2"
                                >
                                  <title>Admin</title>
                                  <path
                                    d="M12 23C6.443 21.765 2 16.522 2 11V5L12 1L22 5V11C22 16.524 17.557 21.765 12 23ZM4 6V11C4.05715 13.3121 4.87036 15.5418 6.31518 17.3479C7.75999 19.1539 9.75681 20.4367 12 21C14.2432 20.4367 16.24 19.1539 17.6848 17.3479C19.1296 15.5418 19.9429 13.3121 20 11V6L12 3L4 6Z"
                                    fill="#001D6C"
                                  />
                                  <path
                                    d="M12 11C13.3807 11 14.5 9.88071 14.5 8.5C14.5 7.11929 13.3807 6 12 6C10.6193 6 9.5 7.11929 9.5 8.5C9.5 9.88071 10.6193 11 12 11Z"
                                    fill="#001D6C"
                                  />
                                  <path
                                    d="M7 15C7.49273 15.8983 8.21539 16.6496 9.09398 17.1767C9.97256 17.7039 10.9755 17.988 12 18C13.0245 17.988 14.0274 17.7039 14.906 17.1767C15.7846 16.6496 16.5073 15.8983 17 15C16.975 13.104 13.658 12 12 12C10.333 12 7.025 13.104 7 15Z"
                                    fill="#001D6C"
                                  />
                                </svg>
                                Halaman Admin
                              </a>
                            </li>
                          )}
                          <li className="px-4 py-4 hover:bg-gray-100 cursor-pointer">
                            <a href="/profile" className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5 me-3"
                              >
                                <title>Profile</title>
                                <path d="M12 2a5 5 0 100 10 5 5 0 000-10zM3 20.25A7.25 7.25 0 0110.25 13h3.5A7.25 7.25 0 0121 20.25v.25a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.25z" />
                              </svg>
                              Profile
                            </a>
                          </li>
                          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hidden md:block"
                    >
                      Processing ...
                    </button>
                  </li>
                )}
              </ul>
            </li>
            <li className="py-3 text-white w-full rounded-xl bg-red-600 border-opacity-50 text-center font-bold text-lg hover:bg-blue-600 hover:bg-opacity-50"
              onClick={() => {
                signOut();
              }}>
              Logout
            </li>
          </ul>
        </div>)
      }

      <div className={styles.navLogo}>
        <Link href={"/"}>
          {isLogoLoading
            ? ("Loading...")
            : (<Image
              src={settings.appLogoDashboard ? settings.appLogoDashboard : "/images/nav-logo-main.svg"}
              alt="logo aplikasi"
              width={198}
              height={48.14}
            />)
          }
        </Link>
      </div>

      <ul className={`${styles.navMainMenu} flex space-x-8`}>
        <li className="hover:text-blue-600 text-black cursor-pointer hover:font-bold">
          <Link href={"/"}>Beranda</Link>
        </li>
        <li className="hover:text-blue-600 text-black cursor-pointer hover:font-bold">
          <Link href={"/guide"}>Panduan</Link>
        </li>
        <li className="hover:text-blue-600 text-black cursor-pointer hover:font-bold">
          <Link href={"/activities"}>Aktivitas</Link>
        </li>
        <li className="hover:text-blue-600 text-black cursor-pointer hover:font-bold">
          <Link href={"/results"}>Hasil</Link>
        </li>
      </ul>

      <ul className={`${styles.navRightMenu} flex items-center space-x-6`}>
        {status === "authenticated" && session?.user ? (
          <li className="relative">
            <button
              type="button"
              className="flex items-center space-x-2"
              onClick={toggleDropdown}
            >
              <ul
                className={`${styles.accountButton} flex items-center space-x-2`}
              >
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <title hidden>Account icon</title>
                    <path
                      d="M6 2H18C19.0609 2 20.0783 2.42143 20.8284 3.17157C21.5786 3.92172 22 4.93913 22 6V18C22 19.0609 21.5786 20.0783 20.8284 20.8284C20.0783 21.5786 19.0609 22 18 22H6C4.93913 22 3.92172 21.5786 3.17157 20.8284C2.42143 20.0783 2 19.0609 2 18V6C2 4.93913 2.42143 3.92172 3.17157 3.17157C3.92172 2.42143 4.93913 2 6 2V2ZM6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6ZM7.229 20H6C5.71995 20.0002 5.44297 19.9416 5.187 19.828C5.41155 18.9832 5.83143 18.203 6.4128 17.5503C6.99416 16.8975 7.72075 16.3905 8.534 16.07C8.65695 16.0175 8.78916 15.9903 8.92283 15.9898C9.0565 15.9893 9.18891 16.0156 9.31223 16.0672C9.43555 16.1188 9.54728 16.1945 9.64082 16.29C9.73436 16.3855 9.8078 16.4988 9.85681 16.6231C9.90582 16.7475 9.9294 16.8804 9.92615 17.014C9.92291 17.1477 9.8929 17.2793 9.83792 17.4011C9.78293 17.523 9.70408 17.6325 9.60602 17.7234C9.50796 17.8142 9.39268 17.8845 9.267 17.93C8.80148 18.1134 8.37958 18.3924 8.02854 18.7489C7.67751 19.1055 7.40513 19.5317 7.229 20ZM16.741 20C16.5536 19.5292 16.2705 19.1024 15.9095 18.7467C15.5485 18.3911 15.1176 18.1143 14.644 17.934C14.5175 17.8901 14.4012 17.8213 14.3018 17.7316C14.2024 17.6419 14.1221 17.5332 14.0655 17.4119C14.009 17.2905 13.9773 17.1591 13.9725 17.0253C13.9677 16.8916 13.9897 16.7582 14.0374 16.6331C14.0851 16.508 14.1574 16.3938 14.25 16.2972C14.3427 16.2006 14.4538 16.1235 14.5767 16.0706C14.6997 16.0177 14.832 15.9901 14.9659 15.9893C15.0998 15.9885 15.2324 16.0146 15.356 16.066C16.184 16.3814 16.9264 16.8869 17.5234 17.5417C18.1204 18.1965 18.5553 18.9824 18.793 19.836C18.5427 19.9444 18.2728 20.0002 18 20H16.74H16.741ZM12 6C13.0609 6 14.0783 6.42143 14.8284 7.17157C15.5786 7.92172 16 8.93913 16 10V12C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16C10.9391 16 9.92172 15.5786 9.17157 14.8284C8.42143 14.0783 8 13.0609 8 12V10C8 8.93913 8.42143 7.92172 9.17157 7.17157C9.92172 6.42143 10.9391 6 12 6ZM12 8C11.4696 8 10.9609 8.21071 10.5858 8.58579C10.2107 8.96086 10 9.46957 10 10V12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V10C14 9.46957 13.7893 8.96086 13.4142 8.58579C13.0391 8.21071 12.5304 8 12 8Z"
                      fill="#001D6C"
                    />
                  </svg>
                </li>
                <li>
                  {(session?.user?.name?.length ?? 0) > 13
                    ? `${session?.user?.name?.slice(0, 13)}...`
                    : session.user.name}
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <title hidden>dropdown</title>
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#001D6C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </li>
              </ul>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-2xl z-20 border-separate">
                <ul className="py-1 text-base">
                  {session.user.role === "ADMIN" && (
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <a href="/admin" className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-6 w-6 me-2"
                        >
                          <title>Admin</title>
                          <path
                            d="M12 23C6.443 21.765 2 16.522 2 11V5L12 1L22 5V11C22 16.524 17.557 21.765 12 23ZM4 6V11C4.05715 13.3121 4.87036 15.5418 6.31518 17.3479C7.75999 19.1539 9.75681 20.4367 12 21C14.2432 20.4367 16.24 19.1539 17.6848 17.3479C19.1296 15.5418 19.9429 13.3121 20 11V6L12 3L4 6Z"
                            fill="#001D6C"
                          />
                          <path
                            d="M12 11C13.3807 11 14.5 9.88071 14.5 8.5C14.5 7.11929 13.3807 6 12 6C10.6193 6 9.5 7.11929 9.5 8.5C9.5 9.88071 10.6193 11 12 11Z"
                            fill="#001D6C"
                          />
                          <path
                            d="M7 15C7.49273 15.8983 8.21539 16.6496 9.09398 17.1767C9.97256 17.7039 10.9755 17.988 12 18C13.0245 17.988 14.0274 17.7039 14.906 17.1767C15.7846 16.6496 16.5073 15.8983 17 15C16.975 13.104 13.658 12 12 12C10.333 12 7.025 13.104 7 15Z"
                            fill="#001D6C"
                          />
                        </svg>
                        Halaman Admin
                      </a>
                    </li>
                  )}
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/profile" className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 me-3"
                      >
                        <title>Profile</title>
                        <path d="M12 2a5 5 0 100 10 5 5 0 000-10zM3 20.25A7.25 7.25 0 0110.25 13h3.5A7.25 7.25 0 0121 20.25v.25a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.25z" />
                      </svg>
                      Profile
                    </a>
                  </li>
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <Link href="#" className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-6 h-6 me-2"
                      >
                        <title>Logout</title>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.5 9.568V14.432C3.5 16.726 3.5 17.872 4.222 18.585C4.877 19.232 5.896 19.291 7.818 19.297C7.717 18.622 7.696 17.817 7.69 16.869C7.69 16.7725 7.70902 16.677 7.74597 16.5879C7.78292 16.4988 7.83707 16.4178 7.90534 16.3496C7.9736 16.2815 8.05464 16.2274 8.1438 16.1906C8.23297 16.1538 8.32853 16.1349 8.425 16.135C8.52152 16.1338 8.61734 16.1516 8.70697 16.1875C8.7966 16.2233 8.87829 16.2765 8.94738 16.3439C9.01646 16.4113 9.0716 16.4917 9.10962 16.5804C9.14765 16.6691 9.16782 16.7645 9.169 16.861C9.175 17.925 9.202 18.679 9.309 19.251C9.412 19.803 9.576 20.121 9.816 20.359C10.089 20.629 10.472 20.804 11.196 20.899C11.94 20.999 12.926 21 14.341 21H15.326C16.741 21 17.727 20.998 18.472 20.9C19.195 20.804 19.578 20.628 19.85 20.359C20.123 20.089 20.301 19.711 20.398 18.997C20.498 18.263 20.5 17.288 20.5 15.892V8.108C20.5 6.711 20.498 5.738 20.398 5.003C20.301 4.289 20.123 3.91 19.851 3.641C19.578 3.371 19.195 3.196 18.471 3.101C17.728 3 16.742 3 15.327 3H14.342C12.927 3 11.941 3.002 11.196 3.1C10.473 3.196 10.09 3.372 9.817 3.641C9.577 3.878 9.413 4.197 9.31 4.749C9.203 5.321 9.176 6.075 9.17 7.139C9.16883 7.23552 9.14865 7.33087 9.11062 7.4196C9.0726 7.50832 9.01746 7.58869 8.94838 7.6561C8.87929 7.72352 8.7976 7.77667 8.70797 7.81251C8.61834 7.84835 8.52252 7.86619 8.426 7.865C8.32953 7.86513 8.23397 7.84624 8.1448 7.80941C8.05563 7.77259 7.9746 7.71854 7.90634 7.65037C7.83807 7.5822 7.78392 7.50124 7.74697 7.41212C7.71002 7.323 7.691 7.22747 7.691 7.131C7.697 6.183 7.718 5.378 7.819 4.703C5.897 4.709 4.879 4.768 4.223 5.415C3.501 6.128 3.5 7.275 3.5 9.568ZM5.935 12.516C5.86643 12.4487 5.81195 12.3684 5.77477 12.2798C5.73758 12.1912 5.71843 12.0961 5.71843 12C5.71843 11.9039 5.73758 11.8088 5.77477 11.7202C5.81195 11.6316 5.86643 11.5513 5.935 11.484L7.905 9.538C8.04452 9.40083 8.23234 9.32397 8.428 9.32397C8.62366 9.32397 8.81148 9.40083 8.951 9.538C9.01957 9.6053 9.07405 9.6856 9.11123 9.7742C9.14842 9.8628 9.16757 9.95792 9.16757 10.054C9.16757 10.1501 9.14842 10.2452 9.11123 10.3338C9.07405 10.4224 9.01957 10.5027 8.951 10.57L8.241 11.27H15.327C15.735 11.27 16.067 11.597 16.067 12C16.067 12.403 15.735 12.73 15.327 12.73H8.24L8.95 13.43C9.01857 13.4973 9.07305 13.5776 9.11023 13.6662C9.14742 13.7548 9.16657 13.8499 9.16657 13.946C9.16657 14.0421 9.14742 14.1372 9.11023 14.2258C9.07305 14.3144 9.01857 14.3947 8.95 14.462C8.81048 14.5992 8.62266 14.676 8.427 14.676C8.23134 14.676 8.04352 14.5992 7.904 14.462L5.935 12.516Z"
                          fill="#001D6C"
                        />
                      </svg>
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ) : (
          <li>
            <button
              type="button"
              onClick={() => signOut()}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hidden md:block"
            >
              Processing ...
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
