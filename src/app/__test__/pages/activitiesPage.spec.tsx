// HistoryPage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistoryPage from '@/app/(content)/activities/page';
import { useSession } from 'next-auth/react';

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

// Mock the fetch function
global.fetch = jest.fn();

describe('HistoryPage', () => {
    const mockSession = {
        user: {
            id: '123',
            name: 'John Doe',
        },
    };

    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({ data: mockSession });
        (fetch as jest.Mock).mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(<HistoryPage />);
        expect(screen.getByText(/Riwayat Aktivitas/i)).toBeInTheDocument();
        expect(screen.getByText(/Semua/i)).toBeInTheDocument();
    });

    test('fetches logs and displays them', async () => {
        const mockLogs = {
            data: [
                {
                    actionType: 'Login',
                    createdAt: new Date().toISOString(),
                },
                {
                    actionType: 'Logout',
                    createdAt: new Date().toISOString(),
                },
            ],
            pagination: {
                totalRecords: 2,
                totalPages: 1,
                currentPage: 1,
                pageSize: 5,
            },
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockLogs),
        });

        render(<HistoryPage />);

        // Wait for the logs to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByText(/login/i)).toBeInTheDocument();
            expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        });
    });

    test('displays loading state', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => { })); // Hang the fetch call

        render(<HistoryPage />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        // Resolve the promise to avoid hanging
        await waitFor(() => expect(fetch).toHaveBeenCalled());
    });

    test('displays no data message when no logs are found', async () => {
        const mockEmptyLogs = {
            data: [],
            pagination: {
                totalRecords: 0,
                totalPages: 1,
                currentPage: 1,
                pageSize: 5,
            },
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockEmptyLogs),
        });

        render(<HistoryPage />);

        // Wait for the no data message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Tidak ada data yang ditemukan/i)).toBeInTheDocument();
        });
    });

    test('changes filter and fetches logs accordingly', async () => {
        const mockLogs = {
            data: [
                {
                    actionType: 'Login',
                    createdAt: new Date().toISOString(),
                },
            ],
            pagination: {
                totalRecords: 1,
                totalPages: 1,
                currentPage: 1,
                pageSize: 5,
            },
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockLogs),
        });

        render(<HistoryPage />);

        // Change filter to "Today"
        fireEvent.click(screen.getByText(/Today/i));

        // Wait for the logs to be fetched and displayed
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `/api/log-activity/${mockSession.user.id}?page=1&limit=5&filter=Today`
            );
            expect(screen.getByText(/login/i)).toBeInTheDocument();
        });
    });

    test('handles pagination correctly', async () => {
        const mockLogs = {
            data: [
                {
                    actionType: 'Login',
                    createdAt: new Date().toISOString(),
                },
                {
                    actionType: 'Logout',
                    createdAt: new Date().toISOString(),
                },
            ],
            pagination: {
                totalRecords: 2,
                totalPages: 2,
                currentPage: 1,
                pageSize: 5,
            },
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockLogs),
        });

        render(<HistoryPage />);

        // Wait for the logs to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByText(/login/i)).toBeInTheDocument();
            expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        });

        // Simulate clicking the "Next" button
        fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        // Mock the second page of logs
        const mockSecondPageLogs = {
            data: [
                {
                    actionType: 'Update Profile',
                    createdAt: new Date().toISOString(),
                },
            ],
            pagination: {
                totalRecords: 3,
                totalPages: 2,
                currentPage: 2,
                pageSize: 5,
            },
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockSecondPageLogs),
        });

        // Wait for the second page logs to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByText(/Update Profile/i)).toBeInTheDocument();
        });
    });
});