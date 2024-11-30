// MyProfilePage.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MyProfilePage from "@/app/(content)/profile/page"; // adjust the import path
import axios from "axios";
import { useSession } from "next-auth/react";

// Mocking axios and next-auth hooks
jest.mock("axios");
jest.mock("next-auth/react");

describe("MyProfilePage", () => {
    const mockUserData = {
        id: "1",
        email: "test@example.com",
        password: "********",
        nip: "123456789",
        name: "John Doe",
        role: "Developer",
        gender: "MALE",
        status: "ACTIVE",
        team: "Team Alpha",
        updatedAt: "2023-11-01T12:00:00Z",
    };

    const mockSession = {
        user: {
            id: "1",
            name: "John Doe",
        },
    };

    beforeEach(() => {
        // Mock session data
        (useSession as jest.Mock).mockReturnValue({ data: mockSession });

        // Mock axios calls
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: mockUserData,
        });
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: { name: "Team Alpha" },
        });
        (axios.put as jest.Mock).mockResolvedValueOnce({});
    });

    it("renders the profile page correctly", async () => {
        render(<MyProfilePage />);

        // Verify that the profile data is displayed
        expect(await screen.findByText("Profil Saya")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("NIP: 123456789")).toBeInTheDocument();
        expect(screen.getByText("Developer")).toBeInTheDocument();
        expect(screen.getByText("Team Alpha")).toBeInTheDocument();
        expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    });

    it("fetches and updates user data correctly", async () => {
        render(<MyProfilePage />);

        // Wait for API calls to finish
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

        // Check that axios.get was called with the correct URL
        expect(axios.get).toHaveBeenCalledWith("/api/users/1");
        expect(axios.get).toHaveBeenCalledWith("/api/teams/undefined");

        // Check that the user details are updated correctly in the component
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    });

    it("opens the EditProfileModal when 'Edit Profil' button is clicked", async () => {
        render(<MyProfilePage />);

        // Ensure that the modal is not initially rendered
        expect(screen.queryByText("Edit Profil")).toBeNull();

        // Find the 'Edit Profil' button and simulate a click event
        fireEvent.click(screen.getByText("Edit Profil"));

        // Check if the EditProfileModal is now rendered
        expect(screen.getByText("Edit Profil")).toBeInTheDocument();
    });

    it("handles the save button click correctly", async () => {
        render(<MyProfilePage />);

        // Open the modal
        fireEvent.click(screen.getByText("Edit Profil"));

        // Mocked user data to save
        const updatedUserDetails = {
            ...mockUserData,
            name: "Jane Doe", // Changing the name
        };

        // Mock the save action
        (axios.put as jest.Mock).mockResolvedValueOnce({});

        // Call the save function inside the modal
        await waitFor(() => fireEvent.click(screen.getByText("Save")));

        // Check if the API call was made to update the user
        expect(axios.put).toHaveBeenCalledWith("/api/users/1", updatedUserDetails);
    });

    it("displays loading state while fetching data", () => {
        // Override axios mock to simulate a delay in fetching data
        (axios.get as jest.Mock).mockImplementationOnce(() =>
            new Promise((resolve) => setTimeout(() => resolve({ data: mockUserData }), 1000))
        );

        render(<MyProfilePage />);

        // Check if loading state is displayed
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("handles error when fetching data fails", async () => {
        // Simulate an API error
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

        render(<MyProfilePage />);

        // Wait for the error to occur
        await waitFor(() => expect(screen.getByText(/Failed to fetch user or team details:/)).toBeInTheDocument());
    });
});
