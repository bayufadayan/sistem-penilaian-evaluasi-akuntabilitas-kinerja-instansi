// ForgotPasswordPage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock axios
jest.mock('axios');

describe('ForgotPasswordPage', () => {
    const mockRouter = { back: jest.fn() };
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText(/Lupa Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    });

    test('handles email input', () => {
        render(<ForgotPasswordPage />);
        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput).toHaveValue('test@example.com');
    });

    test('submits form and shows success message', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: { message: 'Reset link sent!' },
        });

        render(<ForgotPasswordPage />);
        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.submit(screen.getByRole('button', { name: /Send Reset Link/i }));

        await waitFor(() => {
            expect(screen.getByText(/Reset link sent!/i)).toBeInTheDocument();
        });
    });

    test('handles error response', async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce({
            response: { data: { message: 'Email not found' } },
        });

        render(<ForgotPasswordPage />);
        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.submit(screen.getByRole('button', { name: /Send Reset Link/i }));

        await waitFor(() => {
            expect(screen.getByText(/Email not found/i)).toBeInTheDocument();
        });
    });

    test('resets form after resend', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: { message: 'Reset link sent!' },
        });

        render(<ForgotPasswordPage />);
        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.submit(screen.getByRole('button', { name: /Send Reset Link/i }));

        await waitFor(() => {
            expect(screen.getByText(/Reset link sent!/i)).toBeInTheDocument();
        });

        const resendButton = screen.getByRole('button', { name: /Kirim Ulang/i });
        fireEvent.click(resendButton);

        expect(emailInput).toHaveValue('');
        expect(screen.queryByText(/Reset link sent!/i)).not.toBeInTheDocument();
    });
});