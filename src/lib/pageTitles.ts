// import { prisma } from "@/lib/prisma";

// let appNameCache: string | null = null;

// // Fungsi untuk mengambil appName dari database
// export const loadAppName = async (): Promise<string> => {
//   if (!appNameCache) {
//     const setting = await prisma.generalSetting.findFirst({
//       where: { key: "app_name" }, // Contoh kolom database: key: 'app_name'
//     });
//     appNameCache = setting?.value || "Akip BPMSPH";
//   }
//   return appNameCache;
// };

// // Page titles yang menggunakan appName
// export const pageTitles = {
//   login: async () => `Login - ${await loadAppName()}`,
//   home: async () => `Beranda - ${await loadAppName()}`,
//   dashboard: async () => `Dashboard - ${await loadAppName()}`,
//   profile: async () => `Profil - ${await loadAppName()}`,
// };
