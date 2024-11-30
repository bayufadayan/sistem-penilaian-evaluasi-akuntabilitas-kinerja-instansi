import React from 'react';
import { render, screen } from '@testing-library/react';
import SummaryScore from '@/app/(content)/(sheets)/sheets/[id]/summary/page'; // Sesuaikan dengan path yang benar
import { useDataContext } from '@/app/(content)/(sheets)/sheets/[id]/layout'; // Sesuaikan dengan path yang benar

// Mock useDataContext
jest.mock('@/app/(content)/(sheets)/sheets/[id]/layout', () => ({
    useDataContext: jest.fn(),
}));

describe('SummaryScore Component', () => {
    beforeEach(() => {
        (useDataContext as jest.Mock).mockReturnValue({
            evaluationId: '123',
            evaluationName: 'Evaluasi 2024',
            evaluationDesc: 'Deskripsi evaluasi',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the SummaryScore component correctly', () => {
        render(<SummaryScore />);

        // Memastikan teks yang diharapkan muncul di layar
        expect(screen.getByText(/Hasil Pengisian AKIP/i)).toBeInTheDocument();
        expect(screen.getByText(/Evaluasi 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/Deskripsi evaluasi/i)).toBeInTheDocument();
    });

    test('renders "No Data Found" when dataContext is not available', () => {
        (useDataContext as jest.Mock).mockReturnValue(null);

        render(<SummaryScore />);

        expect(screen.getByText(/No Data Found/i)).toBeInTheDocument();
    });
});