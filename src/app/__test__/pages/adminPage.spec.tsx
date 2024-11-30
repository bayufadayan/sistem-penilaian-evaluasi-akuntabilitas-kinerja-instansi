import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from '@/app/(admin)/admin/page';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('AdminPage', () => {
    it('should render AdminPage with mocked data', async () => {
        render(<AdminPage />);

        // Wait for data to load and verify that components render correctly
        await waitFor(() => {
            expect(screen.getByText('Dashboard Admin')).toBeInTheDocument();
            expect(screen.getByText('Jumlah Pengguna')).toBeInTheDocument();
            expect(screen.getByText('Jumlah Tim')).toBeInTheDocument();
            expect(screen.getByText('Jumlah LKE AKIP')).toBeInTheDocument();
            expect(screen.getByText('Jumlah Evidence')).toBeInTheDocument();
        });

        // Check that card count values are rendered correctly
        expect(screen.getByText('100')).toBeInTheDocument();  // User Count
        expect(screen.getByText('50')).toBeInTheDocument();   // Team Count
        expect(screen.getByText('75')).toBeInTheDocument();   // Evaluation Count
        expect(screen.getByText('10')).toBeInTheDocument();   // Evidence Count

        // Check chart renderings
        expect(screen.getByRole('heading', { name: /Hasil LKE Terkini/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Nilai Komponen \[LKE 2024\]/i })).toBeInTheDocument();
    });

    it('should handle fetch error gracefully', async () => {
        // Mocking a failure for the `/api/users/count` endpoint
        server.use(
            http.get('/api/users/count', () => {
                return HttpResponse.json({ message: 'Server error' });
            })
        );

        render(<AdminPage />);

        // Wait for the page to load and verify that the components are still rendered
        await waitFor(() => {
            expect(screen.getByText('Dashboard Admin')).toBeInTheDocument();
        });

        // Check that error handling works (assuming no data is displayed for failed API calls)
        expect(screen.queryByText('100')).not.toBeInTheDocument();  // No user count
    });
});
