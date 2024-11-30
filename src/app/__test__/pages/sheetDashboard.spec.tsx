import React from 'react';
import { render, screen } from '@testing-library/react';
import EvaluationSheetsPage from '@/app/(content)/(sheets)/sheets/[id]/page'; // Sesuaikan dengan path yang benar
import { useDataContext } from '@/app/(content)/(sheets)/sheets/[id]/layout';

// Mock useDataContext
jest.mock('@/app/(content)/(sheets)/sheets/[id]/layout', () => ({
    useDataContext: jest.fn(),
}));

describe('EvaluationSheetsPage Component', () => {
    beforeEach(() => {
        (useDataContext as jest.Mock).mockReturnValue({
            evaluationName: 'Evaluasi 2024',
            evaluationDesc: 'Deskripsi evaluasi',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the EvaluationSheetsPage component correctly', () => {
        render(<EvaluationSheetsPage />);

        // Memastikan teks yang diharapkan muncul di layar
        expect(screen.getByText(/Evaluasi 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/Tentukan nilai untuk setiap kriteria sesuai dengan performa yang telah dicapai/i)).toBeInTheDocument();
        expect(screen.getByText(/Deskripsi/i)).toBeInTheDocument();
    });

    test('renders "No Data Found" when dataContext is not available', () => {
        (useDataContext as jest.Mock).mockReturnValue(null);

        render(<EvaluationSheetsPage />);

        expect(screen.getByText(/No Data Found/i)).toBeInTheDocument();
    });
});