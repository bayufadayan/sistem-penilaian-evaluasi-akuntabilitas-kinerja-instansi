"use client"
import Image from "next/image";
import styles from "@/styles/footer.module.css"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
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
    <footer>
      <div className={styles.footerContainer}>
        <div className={styles.footerLogo}>
        {isLogoLoading
            ? ("Loading...")
            : (<Image src={settings.appLogoFooter ? settings.appLogoFooter : "/images/footer-logo.svg"} alt="logo instansi" width={136} height={33} />)
          }
        </div>

        <div className={styles.copyright}>BPMSPH &copy; 2025. All right reserved</div>

        <div className={styles.socialMedia}>
          <ul>
            {/* <!-- Youtube Icon --> */}
            <Link href={'https://www.youtube.com/channel/UCnxremt6hmTNxSYT1NbJOfw'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <title>Youtube BPMSPH</title>
                <path
                  d="M17.812 5.01699H6.145C3.855 5.01699 2 6.85199 2 9.11599V14.884C2 17.148 3.856 18.984 6.145 18.984H17.812C20.102 18.984 21.957 17.148 21.957 14.884V9.11599C21.957 6.85199 20.101 5.01599 17.812 5.01599V5.01699ZM15.009 12.28L9.552 14.855C9.51872 14.871 9.48192 14.8784 9.44503 14.8763C9.40815 14.8743 9.37237 14.863 9.34103 14.8434C9.3097 14.8239 9.28382 14.7967 9.2658 14.7645C9.24779 14.7322 9.23822 14.6959 9.238 14.659V9.34999C9.23867 9.31286 9.24872 9.27651 9.26722 9.24432C9.28573 9.21212 9.31208 9.18513 9.34382 9.16587C9.37556 9.1466 9.41167 9.13568 9.44877 9.13413C9.48587 9.13258 9.52276 9.14044 9.556 9.15699L15.014 11.892C15.0504 11.9101 15.0809 11.9381 15.102 11.9728C15.1232 12.0075 15.1341 12.0474 15.1336 12.0881C15.1331 12.1287 15.1211 12.1683 15.0991 12.2025C15.077 12.2366 15.0458 12.2638 15.009 12.281V12.28Z"
                  fill="white"
                />
              </svg>
            </Link>

            {/* <!-- Facebook Icon --> */}
            <Link href={'https://www.facebook.com/bpmsph/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <title>Facebook BPMSPH</title>
                <path
                  d="M9.04601 5.865V8.613H7.03201V11.973H9.04601V21.959H13.18V11.974H15.955C15.955 11.974 16.215 10.363 16.341 8.601H13.197V6.303C13.197 5.96 13.647 5.498 14.093 5.498H16.347V2H13.283C8.94301 2 9.04601 5.363 9.04601 5.865Z"
                  fill="white"
                />
              </svg>
            </Link>

            {/* <!-- Twitter Icon --> */}
            <Link href={'https://x.com/BPMSPH/'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14">
                <g fill="none">
                  <g clip-path="url(#primeTwitter0)">
                    <path fill="white" d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z" />
                  </g><defs><clipPath id="primeTwitter0">
                    <path fill="#fff" d="M0 0h14v14H0z" /></clipPath>
                  </defs>
                </g>
              </svg>
            </Link>

            {/* <!-- Instagram Icon --> */}
            <Link href={'https://www.instagram.com/bpmsph_ditjenpkh/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <title>Instagram BPMSPH</title>
                <path
                  d="M16.017 2H7.947C6.37015 2.00185 4.85844 2.62914 3.74353 3.74424C2.62862 4.85933 2.00159 6.37115 2 7.948L2 16.018C2.00185 17.5948 2.62914 19.1066 3.74424 20.2215C4.85933 21.3364 6.37115 21.9634 7.948 21.965H16.018C17.5948 21.9631 19.1066 21.3359 20.2215 20.2208C21.3364 19.1057 21.9634 17.5938 21.965 16.017V7.947C21.9631 6.37015 21.3359 4.85844 20.2208 3.74353C19.1057 2.62862 17.5938 2.00159 16.017 2V2ZM19.957 16.017C19.957 16.5344 19.8551 17.0468 19.6571 17.5248C19.4591 18.0028 19.1689 18.4371 18.803 18.803C18.4371 19.1689 18.0028 19.4591 17.5248 19.6571C17.0468 19.8551 16.5344 19.957 16.017 19.957H7.947C6.90222 19.9567 5.90032 19.5415 5.16165 18.8026C4.42297 18.0638 4.008 17.0618 4.008 16.017V7.947C4.00827 6.90222 4.42349 5.90032 5.16235 5.16165C5.90122 4.42297 6.90322 4.008 7.948 4.008H16.018C17.0628 4.00827 18.0647 4.42349 18.8034 5.16235C19.542 5.90122 19.957 6.90322 19.957 7.948V16.018V16.017Z"
                  fill="white"
                />
                <path
                  d="M11.982 6.81897C10.6134 6.82109 9.30154 7.36576 8.33391 8.33358C7.36627 9.3014 6.82186 10.6134 6.82001 11.982C6.82159 13.3509 7.36603 14.6633 8.33391 15.6314C9.30179 16.5994 10.6141 17.1441 11.983 17.146C13.3521 17.1444 14.6647 16.5998 15.6328 15.6317C16.6008 14.6636 17.1454 13.3511 17.147 11.982C17.1449 10.6131 16.5999 9.30085 15.6317 8.33316C14.6634 7.36547 13.3509 6.82129 11.982 6.81997V6.81897ZM11.982 15.138C11.1452 15.138 10.3428 14.8056 9.75109 14.2139C9.15941 13.6222 8.82701 12.8197 8.82701 11.983C8.82701 11.1462 9.15941 10.3437 9.75109 9.75205C10.3428 9.16037 11.1452 8.82797 11.982 8.82797C12.8188 8.82797 13.6213 9.16037 14.2129 9.75205C14.8046 10.3437 15.137 11.1462 15.137 11.983C15.137 12.8197 14.8046 13.6222 14.2129 14.2139C13.6213 14.8056 12.8188 15.138 11.982 15.138Z"
                  fill="white"
                />
                <path
                  d="M17.156 8.09497C17.8392 8.09497 18.393 7.54115 18.393 6.85797C18.393 6.1748 17.8392 5.62097 17.156 5.62097C16.4728 5.62097 15.919 6.1748 15.919 6.85797C15.919 7.54115 16.4728 8.09497 17.156 8.09497Z"
                  fill="white"
                />
              </svg>
            </Link>

            {/* <!-- Tiktok Icon --> */}
            <Link href={'https://www.tiktok.com/@bpmsphbogor'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" /></svg>
            </Link>

          </ul>
        </div>
      </div>
    </footer>
  );
}
