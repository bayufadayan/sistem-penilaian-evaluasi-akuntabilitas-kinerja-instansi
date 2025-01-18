// Tidak diimplementasikan 
// import { useContext } from "react";
// import { SettingsContext } from "../context/SettingsContext";

// export const usePageTitle = (page: string) => {
//   const settings = useContext(SettingsContext);

//   if (!settings) return "Loading...";

//   const appName = settings.appName || "Eka Prime";

//   const titles: { [key: string]: string } = {
//     default: appName,
//     login: `Login | ${appName}`,
//     home: `Beranda | ${appName}`,
//     admin: `Dashboard Admin | ${appName}`,
//     adminAccount: `Manajemen Akun | ${appName}`,
//     adminTeam: `Manajemen Tim | ${appName}`,
//     adminLKE: `Manajemen Lembar Kerja Evaluasi AKIP | ${appName}`,
//     adminScore: `Manajemen Nilai | ${appName}`,
//     adminSettings: `Pengaturan Aplikasi | ${appName}`,
//     adminProfile: `Tentang Saya | ${appName}`,
//     profile: `Profil | ${appName}`,
//   };

//   return titles[page] || appName;
// };
