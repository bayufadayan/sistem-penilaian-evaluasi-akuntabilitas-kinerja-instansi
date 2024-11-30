import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScoreInputPage from '@/app/(content)/(sheets)/sheets/[id]/[criteriaid]/page';
import axios from 'axios';
import { useSession } from 'next-auth/react';

// Mock useSession
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

// Mock axios
jest.mock('axios');

describe('ScoreInputPage', () => {
    const mockSession = {
        user: { email: 'test@example.com' },
    };

    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({ data: mockSession });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: {
                criteria: [],
                component: { name: 'Komponen 1', weight: 100 },
            },
        });

        render(<ScoreInputPage params={{ criteriaid: '1' }} />);

        expect(await screen.findByText(/Komponen 1/i)).toBeInTheDocument();
    });

    test('handles file upload', async () => {
        const mockFile = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: {
                criteria: [],
                component: { name: 'Komponen 1', weight: 100 },
            },
        });

        (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

        render(<ScoreInputPage params={{ criteriaid: '1' }} />);

        const fileInput = screen.getByLabelText(/Tambah Evidence/i);
        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        await waitFor(() => {
            expect(screen.getByText(/File berhasil diunggah/i)).toBeInTheDocument();
        });
    });

    test('handles score submission', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: {
                criteria: [
                    { id: 1, name: 'Kriteria 1', score: [{ id: 1, score: '100', notes: '' }] },
                ],
                component: { name: 'Komponen 1', weight: 100 },
            },
        });

        (axios.patch as jest.Mock).mockResolvedValueOnce({ data: {} });

        render(<ScoreInputPage params={{ criteriaid: '1' }} />);

        fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

        await waitFor(() => {
            expect(screen.getByText(/Data berhasil di-update/i)).toBeInTheDocument();
        });
    });

    test('displays the "Berikan penilaian Anda" text', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: {
                criteria: [
                    { id: 1, name: 'Kriteria 1', score: [{ id: 1, score: '100', notes: '' }] },
                ],
                component: { name: 'Komponen 1', weight: 100 },
            },
        });

        render(<ScoreInputPage params={{ criteriaid: '1' }} />);

        // Menunggu elemen muncul di layar
        expect(await screen.findByText(/Berikan penilaian Anda/i)).toBeInTheDocument();
    });
});