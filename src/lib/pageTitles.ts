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
  login: async () => `Login | ${await loadAppName()}`,
  home: async () => `Beranda | ${await loadAppName()}`,
  profile: async () => `Profil | ${await loadAppName()}`,
  admin: async () => `Dashboard Admin | ${await loadAppName()}`,
};
