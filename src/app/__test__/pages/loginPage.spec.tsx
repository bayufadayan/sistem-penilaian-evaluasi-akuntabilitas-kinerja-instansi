import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/(auth)/login/page";
import { useRouter } from "next/navigation";

// Mock external hooks and functions
jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
    useSession: jest.fn().mockReturnValue({ data: null, status: 'unauthenticated' }),
}));

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn().mockReturnValue(new URLSearchParams("callbackUrl=/")),
}));

// Setup a mock for the router.push function
const pushMock = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: pushMock });

describe("LoginPage", () => {
    beforeEach(() => { jest.clearAllMocks(); });

    test("renders login form", () => {
        render(<LoginPage />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /masuk/i })).toBeInTheDocument();
    });

    test("validates form inputs", async () => {
        render(<LoginPage />);

        userEvent.click(screen.getByRole("button", { name: /masuk/i }));

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    test("displays error message on failed login", async () => {
        jest.fn().mockResolvedValueOnce({ error: "Invalid credentials" });

        render(<LoginPage />);

        userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
        userEvent.type(screen.getByLabelText(/password/i), "incorrectpassword");

        userEvent.click(screen.getByRole("button", { name: /masuk/i }));

        await waitFor(() => {
            expect(screen.getByText("Email atau password salah")).toBeInTheDocument();
        });
    });

    test("redirects to callback URL on successful login", async () => {
        jest.fn().mockResolvedValueOnce({ error: null });

        render(<LoginPage />);

        userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
        userEvent.type(screen.getByLabelText(/password/i), "correctpassword");

        userEvent.click(screen.getByRole("button", { name: /masuk/i }));

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/home");
        });
    });

    test("displays loading state during login", async () => {
        jest.fn().mockResolvedValueOnce({ error: null });

        render(<LoginPage />);

        userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
        userEvent.type(screen.getByLabelText(/password/i), "correctpassword");

        userEvent.click(screen.getByRole("button", { name: /masuk/i }));

        expect(screen.getByRole("button", { name: /masuk/i })).toBeDisabled();

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: /masuk/i })).toBeDisabled();
        });
    });

    test("toggles password visibility", () => {
        render(<LoginPage />);

        const passwordInput = screen.getByLabelText(/password/i);
        const toggleButton = screen.getByTestId("password-toggle");

        expect(passwordInput).toHaveAttribute("type", "password");

        userEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "text");

        userEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "password");
    });
});

