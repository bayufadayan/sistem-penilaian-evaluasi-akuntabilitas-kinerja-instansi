import { render, screen, waitFor} from '@testing-library/react';
import Home from '@/app/(dashboard)/page'; // Sesuaikan dengan path yang benar
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mocking next-auth and useRouter
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve([
                {
                    id: '1',
                    title: 'Evaluasi 1',
                    date_start: '2024-11-01',
                    date_finish: '2024-11-30',
                    status: 'IN_PROGRESS',
                },
            ]),
    })
) as jest.Mock;

describe('Home Component', () => {
    const mockPush = jest.fn();
    beforeEach(() => {
        // Reset mocks before each test
        (useSession as jest.Mock).mockReturnValue({
            data: { user: { email: 'test@example.com' } },
            status: 'authenticated',
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        jest.clearAllMocks();
    });

    test('renders Home component correctly', async () => {
        render(<Home />);

        // Menunggu hingga elemen muncul di layar
        await waitFor(() => expect(screen.getByText(/Lembar Kerja Evaluasi Tersedia/i)).toBeInTheDocument());
        expect(screen.getByText(/Evaluasi 1/i)).toBeInTheDocument();
    });

    test('redirects unauthenticated user to login', () => {
        // Mock status unauthenticated
        (useSession as jest.Mock).mockReturnValueOnce({
            data: null,
            status: 'unauthenticated',
        });

        render(<Home />);

        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    test('displays "Tidak ada LKE ditemukan" if no in-progress sheets', async () => {
        // Mock fetch response with empty array for in-progress sheets
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText(/Tidak ada LKE ditemukan/i)).toBeInTheDocument();
        });
    });

    test('calculates remaining days correctly', async () => {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 5); // set finish date to 5 days from now

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        {
                            id: '1',
                            title: 'Evaluasi 1',
                            date_start: today.toISOString(),
                            date_finish: futureDate.toISOString(),
                            status: 'IN_PROGRESS',
                        },
                    ]),
            })
        );

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText(/Tersisa 5 hari lagi!/i)).toBeInTheDocument();
        });
    });

    test('displays "Lembar Kerja Evaluasi Selesai" section correctly', async () => {
        const completedSheets = [
            {
                id: '2',
                title: 'Evaluasi Selesai 1',
                date_start: '2024-10-01',
                date_finish: '2024-10-15',
                status: 'COMPLETED',
            },
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(completedSheets),
            })
        );

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText(/Evaluasi Selesai 1/i)).toBeInTheDocument();
        });
    });

    // Tambahkan lebih banyak test sesuai kebutuhan...
});
