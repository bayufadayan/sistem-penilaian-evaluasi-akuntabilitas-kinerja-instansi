// __tests__/PanduanPage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import PanduanPage from "@/app/(content)/guide/page"; // Pastikan path ini sesuai
import '@testing-library/jest-dom';

// Mock global fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                guideLink: "https://example.com/view/guide",
                appName: "MyApp",
            }),
    })
) as jest.Mock;

describe("PanduanPage", () => {
    it("should render the component correctly", async () => {
        render(<PanduanPage />);

        // Menunggu sampai fetch selesai dan guideLink tersedia
        await waitFor(() => expect(screen.getByText(/Panduan Penggunaan Aplikasi/)).toBeInTheDocument());

        // Memeriksa apakah deskripsi dan nama aplikasi ter-render dengan benar
        const descriptionText = /Berikut panduan yang bisa anda baca untuk memakai Aplikasi MyApp/;
        expect(await screen.findByText(descriptionText)).toBeInTheDocument(); // Menggunakan findByText untuk menunggu appName

        // Memeriksa apakah iframe dengan link panduan muncul
        expect(screen.getByTitle(/Panduan Penggunaan Aplikasi/)).toHaveAttribute("src", "https://example.com/preview/guide");

        // Memeriksa apakah link download muncul
        expect(screen.getByText(/Unduh Panduan/)).toHaveAttribute("href", "https://example.com/preview/guide");
    });

    it("should show a message if guideLink is not available", async () => {
        // Mengubah mock fetch untuk mengembalikan nilai null untuk guideLink
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        guideLink: null,
                        appName: "MyApp",
                    }),
            })
        ) as jest.Mock;

        render(<PanduanPage />);

        // Menunggu sampai komponen selesai dirender
        await waitFor(() => expect(screen.getByText(/Panduan belum tersedia. Silakan cek kembali nanti./)).toBeInTheDocument());
    });

    it("should handle fetch error gracefully", async () => {
        // Spy untuk menonaktifkan console.error selama tes berjalan
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Mock fetch untuk mengembalikan error
        global.fetch = jest.fn(() => Promise.reject("API error")) as jest.Mock;

        render(<PanduanPage />);

        // Menunggu sampai komponen selesai dirender
        await waitFor(() => {
            // Pastikan pesan error yang tepat ditampilkan
            expect(screen.getByText(/Panduan belum tersedia. Silakan cek kembali nanti./)).toBeInTheDocument();
        });

        // Verifikasi bahwa console.error tidak ditampilkan dalam output
        expect(consoleSpy).toHaveBeenCalledTimes(1);

        // Mengembalikan spy agar tidak mengganggu tes lain
        consoleSpy.mockRestore();
    });
});
