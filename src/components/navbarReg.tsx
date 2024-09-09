"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (status === "loading") {
    // Ketika session sedang diproses (belum diketahui apakah user login atau tidak)
    return <p>Loading...</p>;
  }

  return (
    <nav className="main-nav flex justify-between items-center py-4 px-6 bg-white shadow-md">
      <div className="nav-logo">
        <Image
          src="/images/nav-logo-main.svg"
          alt="logo aplikasi"
          width={198}
          height={48.14}
        />
      </div>

      <ul className="nav-main-menu flex space-x-8">
        <li className="hover:text-blue-600 cursor-pointer">Beranda</li>
        <li className="hover:text-blue-600 cursor-pointer">Panduan</li>
        <li className="hover:text-blue-600 cursor-pointer">Riwayat</li>
        <li className="hover:text-blue-600 cursor-pointer">Hasil Sementara</li>
        <li className="hover:text-blue-600 cursor-pointer">Laporan</li>
      </ul>

      <ul className="nav-right-menu flex items-center space-x-6">
        {status === "authenticated" && session?.user ? (
          <li className="relative">
            <button
              type="button"
              className="flex items-center space-x-2"
              onClick={toggleDropdown}
            >
              <ul className="account-button flex items-center space-x-2">
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
                <li>{session.user.name}</li>
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <ul className="py-1">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/profile">Profile</a>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => signOut()}
                  >
                    Logout
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Belum Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
