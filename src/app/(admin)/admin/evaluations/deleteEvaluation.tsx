"use client";
import React, { useState } from "react";
import { IoTrash } from "react-icons/io5";
import { useRouter } from "next/navigation";
import axios from "axios";

type EvaluationSheet = {
  id: string;
  title: string;
  date_start: Date;
  date_finish: Date;
  year: string;
};

export default function DeleteEvaluation({
  evaluationSheet,
}: {
  evaluationSheet: EvaluationSheet;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = async (evaluationId: string) => {
    setIsLoading(true);
    await axios.delete(`/../api/evaluations/${evaluationId}`);
    router.refresh();
    setIsLoading(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg shadow-md hover:bg-red-100 transition-all duration-200"
        onClick={handleModalToggle}
      >
        <IoTrash className="w-5 h-5" />
        <span className="font-semibold">Hapus</span>
      </button>

      {/* Main Modal */}
      {isModalOpen && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-gray-900 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Close button */}
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleModalToggle}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>

            {/* Modal body */}
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Apakah Anda yakin ingin menghapus akun{" "}
                <span className="inline-block bg-slate-800 text-slate-400 text-base font-semibold rounded-lg px-2 py-1">
                  {evaluationSheet.title}?
                </span>
              </h3>

              {!isLoading ? (
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  onClick={() => handleDelete(evaluationSheet.id)}
                >
                  Ya, Saya yakin
                </button>
              ) : (
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => handleDelete(evaluationSheet.id)}
                >
                  <svg
                    aria-hidden="true"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Deleting...
                </button>
              )}
              <button
                type="button"
                className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={handleModalToggle}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
