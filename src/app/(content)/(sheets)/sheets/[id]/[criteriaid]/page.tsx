/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";
import styles from "@/styles/styles.module.css";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { uploadFileToSupabase, supabase } from "@/lib/supabaseClient";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoSave } from "react-icons/io5";
import { FaTrashCan } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { BiSolidFilePdf } from "react-icons/bi";
import { SiGoogledocs, SiGooglesheets } from "react-icons/si";
import { FaFile } from "react-icons/fa";
import type {
  Criteria,
  SubComponent,
  Component,
  Evidence,
  Score,
} from "@prisma/client";

type CriteriaWithScore = Criteria & {
  score: Score[];
};

type SubComponentWithCriteria = SubComponent & {
  criteria: CriteriaWithScore[];
  component: Component;
};

export default function ScoreInputPage({
  params,
}: {
  params: { criteriaid: string };
}) {
  const [subComponent, setSubComponent] = useState<
    SubComponentWithCriteria | undefined
  >(undefined);
  const [selectedCriterion, setSelectedCriterion] =
    useState<CriteriaWithScore | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [evidenceData, setEvidenceData] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const id = params.criteriaid;
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [fileIdToDelete, setFileIdToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [initialScore, setInitialScore] = useState("");
  const [initialNotes, setInitialNotes] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSelectedCriterionId, setLastSelectedCriterionId] = useState<number | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchEvaluationSheet = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/subcomponents/${id}`);
          setSubComponent(response.data);
        } catch (error) {
          console.error("Error fetching subcomponent:", error);
        }
      }
    };

    fetchEvaluationSheet();
  }, [id]);

  useEffect(() => {
    if (subComponent?.criteria && subComponent.criteria.length > 0) {
      if (lastSelectedCriterionId) {
        const foundCriterion = subComponent.criteria.find(
          (criterion) => criterion.id === lastSelectedCriterionId
        );
        if (foundCriterion) {
          setSelectedCriterion(foundCriterion);
        } else {
          setSelectedCriterion(subComponent.criteria[0]);
        }
      } else {
        setSelectedCriterion(subComponent.criteria[0]);
      }
    }
  }, [subComponent, lastSelectedCriterionId]);
  

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      await handleUpload(selectedFile);
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById(
      "hiddenFileInput"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleHiddenSubmit = () => {
    const hiddenSubmitButton = document.getElementById(
      "hiddenSubmitButton"
    ) as HTMLButtonElement;
    if (hiddenSubmitButton) {
      hiddenSubmitButton.click();
    }
  };

  const handleUpload = async (selectedFile: File) => {
    setIsLoading(true);
    try {
      const data = await uploadFileToSupabase(selectedFile);
      if (data) {
        const fileName = selectedFile.name;
        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;
        const filePath = data.path;
        const dateUploadedAt = new Date().toISOString();

        const { data: publicData } = supabase.storage
          .from("evidence")
          .getPublicUrl(filePath);

        const publicUrl = publicData?.publicUrl || "";

        const newEvidence = {
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          file_path: filePath,
          public_path: publicUrl,
          date_uploaded_at: dateUploadedAt,
          id_score: selectedCriterion?.score?.[0]?.id,
        };

        await axios.post("/api/evidence", newEvidence);

        showToast(
          "File berhasil diunggah dan data disimpan di database!",
          "success"
        );
        fetchEvidence();
      }
    } catch (error) {
      const errorMessage = error;
      showToast(`Gagal mengunggah file: ${errorMessage}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvidence = useCallback(async () => {
    try {
      const response = await axios.get("/api/evidence");
      setEvidenceData(response.data.evidence);
    } catch (error) {
      console.error("Error fetching evidence:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await axios.delete(`/api/evidence/${id}`);
      showToast("File berhasil dihapus!", "success");
      fetchEvidence();
    } catch (error) {
      console.error("Error deleting file:", error);
      showToast(`Gagal menghapus file: ${error}`, "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const fileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))
      return <BiSolidFilePdf className="text-red-700 h-full text-4xl" />;
    if (
      fileType.includes("spreadsheet") ||
      fileType.includes("excel") ||
      fileType.includes("csv")
    )
      return <SiGooglesheets className="text-green-700 h-full text-3xl" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <SiGoogledocs className="text-blue-700 h-full text-3xl" />;
    return <FaFile className="text-slate-700 h-full text-xl" />;
  };

  const numberToAlphabet = (number: number): string => {
    return String.fromCharCode(64 + number);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setIsToastVisible(true);

    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  const openModal = (id: number) => {
    setFileIdToDelete(id);
    const modal = document.getElementById("popup-modal");
    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
  };

  const closeModal = () => {
    const modal = document.getElementById("popup-modal");
    modal?.classList.add("hidden");
  };

  const confirmDelete = () => {
    if (fileIdToDelete) {
      handleDelete(fileIdToDelete);
      closeModal();
    }
  };

  useEffect(() => {
    if (selectedCriterion) {
      const savedScore = selectedCriterion.score?.[0]?.score;
      const savedNotes = selectedCriterion.score?.[0]?.notes;

      if (savedScore !== undefined) {
        setScore(savedScore);
        setInitialScore(savedScore);
      }
      if (savedNotes !== undefined) {
        setNotes(savedNotes ?? "");
        setInitialNotes(savedNotes ?? "");
      }
    }
  }, [selectedCriterion]);

  useEffect(() => {
    if (score !== initialScore || notes !== initialNotes) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [score, notes, initialScore, initialNotes]);

  useEffect(() => {
    if (selectedCriterion) {
      setLastSelectedCriterionId(selectedCriterion.id);
    }
  }, [selectedCriterion]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      showToast("Anda harus login untuk menyimpan data", "error");
      return;
    }
  
    setIsSaving(true);
  
    // Simpan ID kriteria yang dipilih saat ini
    if (selectedCriterion) {
      setLastSelectedCriterionId(selectedCriterion.id);
    }
  
    try {
      // Proses simpan data
      const user = await axios.get(`/api/users/getbyemail/${session.user.email}`);
      const userId = user?.data?.id;
  
      const payload = {
        score,
        notes,
        id_users: Number.parseInt(userId),
      };
  
      await axios.patch(`/api/score/${selectedCriterion?.score?.[0]?.id}`, payload);
  
      showToast("Data berhasil di-update!", "success");
  
      // Setelah simpan data, fetch data lagi
      const updatedResponse = await axios.get(`/api/subcomponents/${id}`);
      setSubComponent(updatedResponse.data);
  
      // Cari kriteria berdasarkan lastSelectedCriterionId
      const newCriterion = updatedResponse.data.criteria.find(
        (criterion: CriteriaWithScore) => criterion.id === lastSelectedCriterionId
      );
      if (newCriterion) {
        setSelectedCriterion(newCriterion); // Pilih kriteria yang sama setelah update
      }
  
      setInitialScore(score);
      setInitialNotes(notes);
      setScore(score);
      setNotes(notes);
    } catch (error) {
      showToast("Gagal mengupdate data!", "error");
    } finally {
      setIsSaving(false);
      setHasChanges(false);
    }
  };
  

  const getNextCriterion = () => {
    if (!selectedCriterion || !subComponent) return null;

    const currentIndex = subComponent.criteria.findIndex(
      (criterion) => criterion.id === selectedCriterion.id
    );

    if (
      currentIndex !== -1 &&
      currentIndex < subComponent.criteria.length - 1
    ) {
      return subComponent.criteria[currentIndex + 1];
    }

    return null;
  };

  const handleNextCriterion = () => {
    const nextCriterion = getNextCriterion();

    if (nextCriterion) {
      setSelectedCriterion(nextCriterion);
    } else {
      showToast("Tidak ada kriteria selanjutnya", "error");
    }
  };

  const getPreviousCriterion = () => {
    if (!selectedCriterion || !subComponent) return null;

    const currentIndex = subComponent.criteria.findIndex(
      (criterion) => criterion.id === selectedCriterion.id
    );

    if (currentIndex > 0) {
      return subComponent.criteria[currentIndex - 1];
    }

    return null;
  };

  const handlePreviousCriterion = () => {
    const previousCriterion = getPreviousCriterion();

    if (previousCriterion) {
      setSelectedCriterion(previousCriterion);
    } else {
      showToast("Tidak ada kriteria sebelumnya", "error");
    }
  };

  return (
    <div className={styles.lkeContentContainer}>
      {/* Toast */}
      {isToastVisible && (
        <div
          className={`fixed right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-700 bg-white rounded-lg shadow-lg border ${
            toastType === "success" ? "border-green-300" : "border-red-300"
          } transition-all duration-500 ease-in-out transform ${
            isToastVisible ? "animate-slideIn" : "animate-slideOut"
          }`}
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="alert"
        >
          <div
            className={`inline-flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full shadow-md ${
              toastType === "success"
                ? "bg-green-100 text-green-500"
                : "bg-red-100 text-red-500"
            }`}
          >
            {toastType === "success" ? (
              <FaCircleCheck className="text-green-600 text-2xl" />
            ) : (
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
            )}
          </div>
          <div className="ml-3 text-sm font-medium">{toastMessage}</div>
          <button
            type="button"
            className="ml-auto text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-red-300 p-1.5 rounded-lg bg-transparent hover:bg-gray-200 focus:bg-gray-100"
            aria-label="Close"
            onClick={() => setIsToastVisible(false)}
          >
            <svg
              className="w-4 h-4"
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
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Alert Hapus */}
      <div
        id="popup-modal"
        className="hidden fixed inset-0 z-50 items-center justify-center bg-gray-600 bg-opacity-50 transition-all ease-in"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
          <p className="mb-4">Apakah kamu yakin ingin menghapus file ini?</p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={confirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
            >
              Ya, Saya Yakin
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Batalkan
            </button>
          </div>
        </div>
      </div>

      <div className={styles.lkeContent}>
        <div className={styles.fillCriteriaHeader}>
          <div className={styles.breadcrumb}>
            Lembar Kinerja Evaluasi / Perencanaan Kineja / Dokumen Perencanaan
            Kinerj...
          </div>

          <div className={styles.fillCriteriaHeroContainer}>
            <div className={styles.criteriaFilledProgress}>
              <small className="font-bold">Progress Anda (70%)</small>
              <div className={styles.persentage}>
                <div className={styles.progressCompleted}>
                  [Bar Progress nya]
                </div>
              </div>
            </div>

            <div className={styles.fillCriteriaHeaderContent}>
              <div className={styles.criteriaTitleContainer}>
                <div className={styles.mainTitle}>
                  <p className="text-sm text-blue-800 mb-1">{`Komponen No. ${
                    subComponent?.component?.component_number ?? ""
                  }`}</p>

                  <h1 className="text-3xl">
                    {subComponent?.component.name.toUpperCase()}
                  </h1>
                  <div className="flex gap-1">
                    <div className="bg-red-200 py-1 px-2 text-sm w-fit text-red-700 rounded font-bold">
                      Bobot komponen:{" "}
                      <span>{subComponent?.component.weight.toFixed(2)}</span>
                    </div>
                    <div className={styles.componentWeight}>
                      Nilai Komponen: <span>24.6</span>
                    </div>
                  </div>
                </div>

                <div className={`${styles.subComponentContainer} shadow-md`}>
                  <div className={styles.subComponentIcon}>
                    {numberToAlphabet(subComponent?.subcomponent_number ?? 0)}
                  </div>

                  <div className={styles.subComponentContent}>
                    <div className={`${styles.subComponentTitle} capitalize`}>
                      {subComponent?.name}
                    </div>

                    <div className={styles.subComponentWeight}>
                      Bobot sub-komponen:{" "}
                      <span>{subComponent?.weight.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.criteriaScoreContainer}`}>
                <div className="text-lg font-bold text-blue-700 text-center mb-2.5 bg-indigo-100 rounded-lg py-2 border-2 border-blue-400 shadow-sm">
                  Hasil Skor Sub Komponen
                </div>

                <div className={styles.criteriaScore}>
                  <div className={styles.scoreAndPersentage}>
                    <div className={styles.scoreCard}>
                      <h5>persentage</h5>
                      <h2>93%</h2>
                    </div>

                    <div className={styles.scoreCard}>
                      <h5>Nilai</h5>
                      <h2>5,4</h2>
                    </div>
                  </div>

                  <div className={styles.gradeContainer}>
                    <div className={styles.gradeCard}>
                      <h5>Grade</h5>
                      <h1>AA</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 my-4" />

        <div className={styles.fillCriteriaContent}>
          <div className={styles.fillCriteriaCommand}>
            <p className="text-gray-600 italic">
              Silakan isi sesuai capaian kinerja masing masing!
            </p>
          </div>

          <div className={styles.criteriaContent}>
            <div className={`${styles.contentLeftMenu} `}>
              <div className="sticky top-24 transition-all duration-300 ease-in-out">
                <p>Pilihan Kriteria:</p>

                <div className={`${styles.criteriaListContainer}`}>
                  {(subComponent?.criteria ?? []).length > 0 ? (
                    subComponent?.criteria
                      .sort(
                        (a: Criteria, b: Criteria) =>
                          a.criteria_number - b.criteria_number
                      )
                      .map((criterion) => (
                        <button
                          type="button"
                          key={criterion.id}
                          className={`${
                            selectedCriterion?.id === criterion.id
                              ? "bg-blue-900 text-white"
                              : "hover:bg-blue-200 hover:text-blue-900"
                          } ${
                            styles.theCriteria
                          } cursor-pointer transition duration-300 ease-in-out`}
                          onClick={() => setSelectedCriterion(criterion)}
                        >
                          <div
                            className={`${styles.criteriaNumber} ${
                              selectedCriterion?.id === criterion.id
                                ? "bg-white text-blue-900"
                                : "bg-blue-900 text-white"
                            }`}
                          >
                            {criterion.criteria_number}
                          </div>
                          <p>{criterion.name}</p>
                          <IoIosArrowForward className="text-xl" />
                        </button>
                      ))
                  ) : (
                    <p className="text-gray-500 italic text-center">
                      Tidak ada data criteria
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    onClick={handleHiddenSubmit}
                    className={`flex justify-center items-center gap-2 text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none ${
                      hasChanges && !isSaving
                        ? "bg-blue-700 hover:bg-blue-800"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!hasChanges || isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center">
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 text-gray-200 animate-spin dark:text-white-600 fill-blue-600 mr-2"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>{" "}
                        Menyimpan...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <IoSave /> Simpan
                      </span>
                    )}
                  </button>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={handlePreviousCriterion}
                      className="flex justify-center items-center gap-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                    >
                      <FaArrowLeft /> Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleNextCriterion}
                      className="flex justify-center items-center gap-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                    >
                      Lanjut <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.criteriaFormContainer}>
              <form onSubmit={handleSave}>
                <input
                  type="text"
                  value={selectedCriterion?.score?.[0]?.id}
                  hidden
                />
                <div className="flex flex-col gap-2">
                  <div className={styles.criteriaInfo}>
                    <p
                      className={`${styles.criteriaFormSubtitle} text-base font-semibold bg-blue-800 py-1 px-4 mb-1 rounded-full text-white w-fit`}
                    >
                      {`Kriteria ${
                        selectedCriterion
                          ? selectedCriterion.criteria_number
                          : ""
                      }`}
                    </p>
                    <h3 className="font-bold text-xl">
                      {selectedCriterion ? selectedCriterion.name : ""}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <div className="font-semibold text-gray-800 ">
                        Deskripsi:
                      </div>
                      <p>
                        {selectedCriterion &&
                        selectedCriterion.description?.trim() !== ""
                          ? selectedCriterion.description
                          : "Tidak ada Deskripsi"}
                      </p>
                    </div>
                    <hr className="border-t-2 border-gray-300 mt-2" />
                  </div>

                  <div className={styles.criteriaScoreField}>
                    <p
                      className={`${styles.criteriaFormSubtitle} text-gray-700 font-semibold`}
                    >
                      Berikan penilaian Anda:
                    </p>
                    <ul className={styles.scoreList}>
                      <li>
                        <input
                          type="radio"
                          name="score"
                          id="score100"
                          value="100"
                          className="hidden peer"
                          checked={score === "100"}
                          onChange={() => setScore("100")}
                        />
                        <label
                          htmlFor="score100"
                          className="peer-checked:bg-green-600 peer-checked:text-white hover:bg-green-200 hover:text-green-800"
                        >
                          100
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="score"
                          id="score90"
                          value="90"
                          className="hidden peer"
                          checked={score === "90"}
                          onChange={() => setScore("90")}
                        />
                        <label
                          htmlFor="score90"
                          className="peer-checked:bg-green-600 peer-checked:text-white hover:bg-green-200 hover:text-green-800"
                        >
                          90
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="score"
                          id="score80"
                          value="80"
                          className="hidden peer"
                          checked={score === "80"}
                          onChange={() => setScore("80")}
                        />
                        <label
                          htmlFor="score80"
                          className="peer-checked:bg-green-600 peer-checked:text-white hover:bg-green-200 hover:text-green-800"
                        >
                          80
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="score"
                          id="score70"
                          value="70"
                          className="hidden peer"
                          checked={score === "70"}
                          onChange={() => setScore("70")}
                        />
                        <label
                          htmlFor="score70"
                          className="peer-checked:bg-yellow-500 peer-checked:text-white hover:bg-yellow-200 hover:text-yellow-800"
                        >
                          70
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="score"
                          id="score60"
                          value="60"
                          className="hidden peer"
                          checked={score === "60"}
                          onChange={() => setScore("60")}
                        />
                        <label
                          htmlFor="score60"
                          className="peer-checked:bg-yellow-500 peer-checked:text-white hover:bg-yellow-200 hover:text-yellow-800"
                        >
                          60
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="score"
                          id="score50"
                          value="50"
                          className="hidden peer"
                          checked={score === "50"}
                          onChange={() => setScore("50")}
                        />
                        <label
                          htmlFor="score50"
                          className="peer-checked:bg-yellow-500 peer-checked:text-white hover:bg-yellow-200 hover:text-yellow-800"
                        >
                          50
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="score"
                          id="score30"
                          value="30"
                          className="hidden peer"
                          checked={score === "30"}
                          onChange={() => setScore("30")}
                        />
                        <label
                          htmlFor="score30"
                          className="peer-checked:bg-red-600 peer-checked:text-white hover:bg-red-200 hover:text-red-800"
                        >
                          30
                        </label>
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="score"
                          id="score0"
                          value="0"
                          className="hidden peer"
                          checked={score === "0"}
                          onChange={() => setScore("0")}
                        />
                        <label
                          htmlFor="score0"
                          className="peer-checked:bg-red-600 peer-checked:text-white hover:bg-red-200 hover:text-red-800"
                        >
                          0
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={styles.criteriaNoteField}>
                  <p className={`${styles.criteriaFormSubtitle} font-semibold`}>
                    Catatan
                  </p>
                  <textarea
                    name="noteField"
                    id={styles.noteField}
                    placeholder="Masukan Catatan Anda"
                    className="py-1 focus:ring-blue-500 focus:border-blue-500"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className={`${styles.criteriaEvidenceField} mb-12`}>
                  <div className={styles.title}>
                    <p
                      className={`${styles.criteriaFormSubtitle} font-semibold`}
                    >
                      Daftar Evidence
                    </p>
                    <small>
                      *Silakan berikan nama file yang relevan sebelumnya
                    </small>
                  </div>

                  <div className={styles.evidenceSection}>
                    <div className="flex gap-3 items-center">
                      <input
                        id="hiddenFileInput"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />

                      <button
                        type="button"
                        onClick={handleButtonClick}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 active:scale-95 active:shadow-inner transition-transform duration-150"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg
                              aria-hidden="true"
                              className="w-6 h-6 text-gray-200 animate-spin dark:text-white-600 fill-blue-600 mr-2"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          "+ Tambah Evidence"
                        )}
                      </button>
                      {isDeleting && (
                        <button
                          type="button"
                          onClick={handleButtonClick}
                          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 transition-transform duration-150"
                          disabled
                        >
                          <div className="flex items-center">
                            <svg
                              aria-hidden="true"
                              className="w-6 h-6 text-gray-200 animate-spin dark:text-white-600 fill-red-400 mr-2"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span>Menghapus...</span>
                          </div>
                        </button>
                      )}
                    </div>

                    {evidenceData.length > 0 ? (
                      evidenceData.filter(
                        (evidence) =>
                          evidence.id_score ===
                          selectedCriterion?.score?.[0]?.id
                      ).length > 0 ? (
                        evidenceData
                          .filter(
                            (evidence) =>
                              evidence.id_score ===
                              selectedCriterion?.score?.[0]?.id
                          )
                          .map((evidence) => (
                            <div
                              className={styles.evidenceCard}
                              key={evidence.id}
                            >
                              <div className={styles.leftSection}>
                                <div className={styles.fileIcon}>
                                  {fileIcon(evidence.file_type)}
                                </div>

                                <div className={`${styles.fileInfo}`}>
                                  <a
                                    href={evidence.public_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 hover:underline"
                                  >
                                    <h5
                                      className={`${styles.fileTitle} break-words`}
                                    >
                                      {evidence.file_name}
                                    </h5>
                                  </a>

                                  <p className={styles.fileSize}>
                                    {(evidence.file_size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>

                              <div className={styles.rightSection}>
                                <button
                                  type="button"
                                  onClick={() => openModal(evidence.id)}
                                  className="bg-red-700 px-3 py-5 rounded text-white flex items-center justify-center gap-2 transition-all duration-200 ease-in-out transform hover:bg-red-600 hover:scale-105 active:scale-95 focus:outline-none"
                                >
                                  <FaTrashCan />
                                </button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-600">
                          No evidence found for the selected criterion.
                        </p>
                      )
                    ) : (
                      <p className="text-gray-600">No evidence found.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    type="submit"
                    id="hiddenSubmitButton"
                    disabled={!hasChanges || isSaving}
                    hidden
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
