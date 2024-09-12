import { useState } from "react";
import SubComponentListCard from "./subComponent";
import styles from "@/styles/styles.module.css";

interface Component {
  id: number;
  name: string;
  description: string;
  weight: number;
  subComponents: SubComponent[];
}

interface SubComponent {
  id: number;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
}

export default function ComponentCard({
  component,
  subComponents,
  evaluationId,
}: {
  component: Component;
  subComponents: SubComponent[];
  evaluationId: string
}) {
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  const handleDropDown = () => {
    setIsOpenDropDown(!isOpenDropDown);
  };

  return (
    <div className={styles.lkeComponents}>
      <button type="button" onClick={handleDropDown}>
        <div className={`${styles.lkeSingleComponents} hover:bg-gray-200`}>
          <div className={styles.componentsContent}>
            <div className={styles.componentsInfo}>
              <h2 className="text-left font-bold text-lg">{component.name}</h2>
              <small className="text-left">Bobot: {component.weight} • {component.subComponents.length} Sub-komponen</small>
            </div>

            <div className={styles.componentsDropdown}>
              {isOpenDropDown ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transform transition-transform duration-300 rotate-0"
                >
                  <title hidden>dropdown</title>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM9.707 13.707C9.5184 13.8892 9.2658 13.99 9.0036 13.9877C8.7414 13.9854 8.49059 13.8802 8.30518 13.6948C8.11977 13.5094 8.0146 13.2586 8.01233 12.9964C8.01005 12.7342 8.11084 12.4816 8.293 12.293L11.293 9.293C11.4805 9.10553 11.7348 9.00021 12 9.00021C12.2652 9.00021 12.5195 9.10553 12.707 9.293L15.707 12.293C15.8892 12.4816 15.99 12.7342 15.9877 12.9964C15.9854 13.2586 15.8802 13.5094 15.6948 13.6948C15.5094 13.8802 15.2586 13.9854 14.9964 13.9877C14.7342 13.99 14.4816 13.8892 14.293 13.707L12 11.414L9.707 13.707Z"
                    fill="#0E0E2C"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transform transition-transform duration-300 rotate-180"
                >
                  <title hidden>dropdown</title>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM9.707 13.707C9.5184 13.8892 9.2658 13.99 9.0036 13.9877C8.7414 13.9854 8.49059 13.8802 8.30518 13.6948C8.11977 13.5094 8.0146 13.2586 8.01233 12.9964C8.01005 12.7342 8.11084 12.4816 8.293 12.293L11.293 9.293C11.4805 9.10553 11.7348 9.00021 12 9.00021C12.2652 9.00021 12.5195 9.10553 12.707 9.293L15.707 12.293C15.8892 12.4816 15.99 12.7342 15.9877 12.9964C15.9854 13.2586 15.8802 13.5094 15.6948 13.6948C15.5094 13.8802 15.2586 13.9854 14.9964 13.9877C14.7342 13.99 14.4816 13.8892 14.293 13.707L12 11.414L9.707 13.707Z"
                    fill="#0E0E2C"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </button>

      {isOpenDropDown && (
        <div
          className={`${
            styles.lkeCriteria
          } transition-all duration-300 ease-in-out overflow-hidden ${
            isOpenDropDown ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ maxHeight: isOpenDropDown ? "1000px" : "0px" }}
        >
          <SubComponentListCard subComponents={subComponents} evaluationId={evaluationId}/>
        </div>
      )}
    </div>
  );
}
