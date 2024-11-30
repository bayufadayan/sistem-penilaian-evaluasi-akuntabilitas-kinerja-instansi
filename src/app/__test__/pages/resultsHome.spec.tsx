import { render, screen } from "@testing-library/react";
import TempResultPage from "@/app/(content)/results/page";
import styles from "@/styles/styles.module.css"; // Import the CSS module

// Test suite for TempResultPage component
describe("TempResultPage", () => {
    it("renders the TempResultPage component correctly", () => {
        render(<TempResultPage />);

        // Check if the text "TempResultPage" is present
        expect(screen.getByText("TempResultPage")).toBeInTheDocument();
    });

    it("applies the correct styles from the CSS module", () => {
        render(<TempResultPage />);

        // Check if the mainContainer class is applied to the outer <main> element
        const mainElement = screen.getByRole("main");
        expect(mainElement).toHaveClass(styles.mainContainer);
    });

    it("contains a <div> with the correct text content", () => {
        render(<TempResultPage />);

        // Check if the <div> inside the <main> element contains the correct text "TempResultPage"
        const divElement = screen.getByText("TempResultPage");
        expect(divElement).toBeInTheDocument();
    });
});
