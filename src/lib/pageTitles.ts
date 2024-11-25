import { prisma } from "@/lib/prisma";

let appNameCache: string | null = null;

// Fungsi untuk mengambil appName dari database
export const loadAppName = async (): Promise<string> => {
  if (!appNameCache) {
    const setting = await prisma.settings.findFirst({
      where: { id: 1 },
    });
    appNameCache = setting?.appName || "Eka Prime";
  }
  return appNameCache;
};

// Page titles yang menggunakan appName
export const pageTitles = {
  default: async () => `${await loadAppName()}`,
  login: async () => `Login | ${await loadAppName()}`,
  home: async () => `Beranda | ${await loadAppName()}`,
  admin: async () => `Dashboard Admin | ${await loadAppName()}`,
  adminAccount: async () => `Manajemen Akun | ${await loadAppName()}`,
  adminTeam: async () => `Manajemen Tim | ${await loadAppName()}`,
  adminLKE: async () => `Manajemen Lembar kerja Evaluasi AKIP | ${await loadAppName()}`,
  adminScore: async () => `Manajemen Nilai | ${await loadAppName()}`,
  adminSettings: async () => `Pengaturan Aplikasi | ${await loadAppName()}`,
  adminProfile: async () => `Tentang Saya | ${await loadAppName()}`,
  profile: async () => `Profil | ${await loadAppName()}`,
};
