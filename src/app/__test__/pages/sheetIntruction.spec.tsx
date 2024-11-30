import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InstructionPage from '@/app/(content)/(sheets)/sheets/[id]/instruction/page';
import { useDataContext } from '@/app/(content)/(sheets)/sheets/[id]/layout';

// Mocking the useDataContext hook
jest.mock('@/app/(content)/(sheets)/sheets/[id]/layout', () => ({
    useDataContext: jest.fn(),
}));

// Mocking the fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([
            { id: 1, section: 'Keberadaan', pilihan: 'AA', nilai: 5, penjelasan: 'Penjelasan AA' },
            { id: 2, section: 'Kualitas', pilihan: 'A', nilai: 4, penjelasan: 'Penjelasan A' },
            { id: 3, section: 'Pemanfaat', pilihan: 'BB', nilai: 3, penjelasan: 'Penjelasan BB' },
        ]),
    })
) as jest.Mock;

describe('InstructionPage', () => {
    beforeEach(() => {
        (useDataContext as jest.Mock).mockReturnValue({ evaluationId: '123' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders InstructionPage and fetches data', async () => {
        render(<InstructionPage />);

        // Check if the header is rendered
        expect(screen.getByText(/Penjelasan Penilaian dalam Pengisian Lembar Kerja Evaluasi AKIP/i)).toBeInTheDocument();

        // Wait for the fetch to resolve and check for table content
        await waitFor(() => {
            expect(screen.getByText('AA')).toBeInTheDocument();
            expect(screen.getByText('A')).toBeInTheDocument();
            expect(screen.getByText('BB')).toBeInTheDocument();
        });
    });

    test('changes active section on button click', async () => {
        render(<InstructionPage />);

        // Wait for the fetch to resolve
        await waitFor(() => {
            expect(screen.getByText('AA')).toBeInTheDocument();
        });

        // Click on Kualitas button
        fireEvent.click(screen.getByText('Kualitas'));

        // Check if the Kualitas section is now active
        expect(screen.getByText('< Kualitas >')).toBeInTheDocument();
        expect(screen.queryByText('AA')).not.toBeInTheDocument(); // AA should not be present anymore
        expect(screen.getByText('A')).toBeInTheDocument(); // A should be present
    });

    test('displays message when no data is available', async () => {
        // Mock fetch to return an empty array
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );

        render(<InstructionPage />);

        // Wait for the fetch to resolve
        await waitFor(() => {
            expect(screen.getByText('Tidak ada data tersedia')).toBeInTheDocument();
        });
    });
});