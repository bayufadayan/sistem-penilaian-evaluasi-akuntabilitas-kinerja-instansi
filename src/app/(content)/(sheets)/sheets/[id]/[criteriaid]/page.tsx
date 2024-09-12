"use client";
import React from "react";
import styles from "@/styles/styles.module.css";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import type { Criteria, SubComponent, Component } from "@prisma/client";

type SubComponentWithCriteria = SubComponent & {
  criteria: Criteria[];
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
  const [selectedCriterion, setSelectedCriterion] = useState<Criteria | null>(
    null
  );

  const id = params.criteriaid;

  useEffect(() => {
    const fetchEvaluationSheet = async () => {
      if (id) {
        const res = await fetch(`/api/subcomponents/${id}`);
        const data = await res.json();
        setSubComponent(data);
      }
    };
    fetchEvaluationSheet();
  }, [id]);

  useEffect(() => {
    if (subComponent?.criteria && subComponent.criteria.length > 0) {
      setSelectedCriterion(subComponent.criteria[0]);
    }
  }, [subComponent]);

  const numberToAlphabet = (number: number): string => {
    return String.fromCharCode(64 + number);
  };

  return (
    <div className={styles.lkeContentContainer}>
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
                  <div className={styles.componentWeight}>
                    Bobot komponen:{" "}
                    <span>{subComponent?.component.weight.toFixed(2)}</span>
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

              <div className={styles.criteriaScoreContainer}>
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
            <div className={styles.contentLeftMenu}>
              <p>Pilihan Kriteria:</p>

              <div className={`${styles.criteriaListContainer}`}>
                {(subComponent?.criteria ?? []).length > 0 ? (
                  subComponent?.criteria
                    .sort(
                      (a: Criteria, b: Criteria) =>
                        a.criteria_number - b.criteria_number
                    )
                    .map((criterion: Criteria) => (
                      <button
                        type="button"
                        key={criterion.id}
                        className={`${
                          selectedCriterion?.id === criterion.id
                            ? "bg-blue-900 text-white"
                            : "hover:bg-blue-200 hover:text-blue-900"
                        } ${styles.theCriteria} cursor-pointer`}
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
                    Loading... atau Tidak ada data criteria
                  </p>
                )}
              </div>

              <div
                className={`${styles.nextScoreExplain} ${styles.nextButton}`}
              >
                <button type="button">
                  <p className={styles.marginTop}>Selanjutnya</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                  >
                    <title>Arrow</title>
                    <rect width="45" height="45" rx="22.5" fill="#01499F" />
                    <path
                      d="M19 30L26.5 22.5L19 15"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.criteriaFormContainer}>
              <div className="flex flex-col gap-2">
                <div className={styles.criteriaInfo}>
                  <p
                    className={`${styles.criteriaFormSubtitle} text-base font-semibold bg-blue-800 py-1 px-4 mb-1 rounded-full text-white w-fit`}
                  >
                    {`Kriteria ${selectedCriterion ? selectedCriterion.criteria_number : ""}`}
                  </p>
                  <h3 className="font-bold text-xl">
                    {selectedCriterion ? selectedCriterion.name : ""}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="font-semibold text-gray-800">
                      Deskripsi:
                    </div>
                    <p>
                      {selectedCriterion &&
                      selectedCriterion.description?.trim() !== ""
                        ? selectedCriterion.description
                        : "Tidak ada Deskripsi"}
                    </p>
                  </div>
                  <hr className="border-t-2 border-gray-300 mt-4 mb-2" />
                </div>

                <div className={styles.criteriaScoreField}>
                  <p className={`${styles.criteriaFormSubtitle} text-gray-700`}>
                    Berikan penilaian Anda:
                  </p>
                  <ul className={styles.scoreList}>
                    <li>
                      <input
                        type="radio"
                        name="score"
                        id="score100"
                        value={"100"}
                        className="hidden peer"
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
                        value={"90"}
                        className="hidden peer"
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
                        value={"80"}
                        className="hidden peer"
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
                        value={"70"}
                        className="hidden peer"
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
                        value={"60"}
                        className="hidden peer"
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
                        value={"50"}
                        className="hidden peer"
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
                        value={"30"}
                        className="hidden peer"
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
                        value={"0"}
                        className="hidden peer"
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
                <p className={styles.criteriaFormSubtitle}>Catatan</p>
                <textarea
                  name="noteField"
                  id={styles.noteField}
                  placeholder="Masukan Catatan Anda"
                  className="py-1"
                />
              </div>

              <div className={styles.criteriaEvidenceField}>
                <div className={styles.title}>
                  <p className={styles.criteriaFormSubtitle}>Daftar Evidence</p>
                  <small>
                    *Silakan berikan nama file yang relevan sebelumnya
                  </small>
                </div>

                <div className={styles.evidenceSection}>
                  <button
                    type="button"
                    className={styles.addNewEvidence}
                    onClick={() => {
                      const fileInput = document.getElementById(
                        "fileInput"
                      ) as HTMLInputElement | null;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="29"
                      height="29"
                      viewBox="0 0 29 29"
                      fill="none"
                    >
                      <title>Plus</title>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.87521 4.8539C12.6137 4.43998 16.3864 4.43998 20.1248 4.8539C22.1947 5.0859 23.8646 6.71594 24.1075 8.79306C24.5505 12.5848 24.5505 16.4152 24.1075 20.207C23.8646 22.2841 22.1947 23.9141 20.1248 24.1461C16.3864 24.5601 12.6137 24.5601 8.87521 24.1461C6.80534 23.9141 5.13542 22.2841 4.89255 20.207C4.44964 16.4156 4.44964 12.5856 4.89255 8.79427C5.01539 7.78516 5.47542 6.8471 6.19807 6.13213C6.92072 5.41715 7.86363 4.96717 8.874 4.8551M14.5 8.46681C14.7404 8.46681 14.9709 8.56229 15.1408 8.73225C15.3108 8.9022 15.4063 9.13271 15.4063 9.37306V13.5938H19.627C19.8673 13.5938 20.0978 13.6893 20.2678 13.8592C20.4377 14.0292 20.5332 14.2597 20.5332 14.5C20.5332 14.7404 20.4377 14.9709 20.2678 15.1408C20.0978 15.3108 19.8673 15.4063 19.627 15.4063H15.4063V19.627C15.4063 19.8673 15.3108 20.0978 15.1408 20.2678C14.9709 20.4378 14.7404 20.5332 14.5 20.5332C14.2597 20.5332 14.0291 20.4378 13.8592 20.2678C13.6892 20.0978 13.5938 19.8673 13.5938 19.627V15.4063H9.37304C9.13269 15.4063 8.90218 15.3108 8.73223 15.1408C8.56227 14.9709 8.4668 14.7404 8.4668 14.5C8.4668 14.2597 8.56227 14.0292 8.73223 13.8592C8.90218 13.6893 9.13269 13.5938 9.37304 13.5938H13.5938V9.37306C13.5938 9.13271 13.6892 8.9022 13.8592 8.73225C14.0291 8.56229 14.2597 8.46681 14.5 8.46681Z"
                        fill="white"
                      />
                    </svg>

                    <p>Tambah Bukti Evidence</p>

                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      accept=".pdf, .doc, .docx, .xls, .xlsx"
                      // onChange={(e) => console.log(e.target.files[0])}
                    />
                  </button>

                  <div className={styles.evidenceCard}>
                    <div className={styles.leftSection}>
                      <div className={styles.fileIcon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <title>File</title>
                          <path
                            d="M13.7783 24.4668C13.4717 24.4668 13.265 24.4968 13.1583 24.5268V26.4901C13.285 26.5201 13.4433 26.5285 13.6617 26.5285C14.46 26.5285 14.9517 26.1251 14.9517 25.4435C14.9517 24.8335 14.5283 24.4668 13.7783 24.4668ZM19.59 24.4868C19.2567 24.4868 19.04 24.5168 18.9117 24.5468V28.8968C19.04 28.9268 19.2467 28.9268 19.4333 28.9268C20.795 28.9368 21.6817 28.1868 21.6817 26.6001C21.6917 25.2168 20.8833 24.4868 19.59 24.4868Z"
                            fill="#DE1135"
                          />
                          <path
                            d="M23.3334 3.3335H10C9.11597 3.3335 8.26812 3.68469 7.643 4.30981C7.01788 4.93493 6.66669 5.78277 6.66669 6.66683V33.3335C6.66669 34.2176 7.01788 35.0654 7.643 35.6905C8.26812 36.3156 9.11597 36.6668 10 36.6668H30C30.8841 36.6668 31.7319 36.3156 32.357 35.6905C32.9822 35.0654 33.3334 34.2176 33.3334 33.3335V13.3335L23.3334 3.3335ZM15.83 26.9835C15.315 27.4668 14.555 27.6835 13.67 27.6835C13.4984 27.6867 13.3268 27.6767 13.1567 27.6535V30.0302H11.6667V23.4702C12.3391 23.3702 13.0186 23.3245 13.6984 23.3335C14.6267 23.3335 15.2867 23.5102 15.7317 23.8652C16.155 24.2018 16.4417 24.7535 16.4417 25.4035C16.44 26.0568 16.2234 26.6085 15.83 26.9835ZM22.175 29.2418C21.475 29.8235 20.41 30.1002 19.1084 30.1002C18.3284 30.1002 17.7767 30.0502 17.4017 30.0002V23.4718C18.0744 23.374 18.7536 23.3277 19.4334 23.3335C20.695 23.3335 21.515 23.5602 22.155 24.0435C22.8467 24.5568 23.28 25.3752 23.28 26.5502C23.28 27.8218 22.815 28.7002 22.175 29.2418ZM28.3334 24.6168H25.78V26.1352H28.1667V27.3585H25.78V30.0318H24.27V23.3835H28.3334V24.6168ZM23.3334 15.0002H21.6667V6.66683L30 15.0002H23.3334Z"
                            fill="#DE1135"
                          />
                        </svg>
                      </div>

                      <div className={styles.fileInfo}>
                        <h5 className={styles.fileTitle}>
                          SOP anaands dsdsdsd.pdf
                        </h5>

                        <p className={styles.fileSize}>2 MB</p>
                      </div>
                    </div>

                    <div className={styles.rightSection}>
                      <div className={styles.removeIcon}>
                        <IoIosCloseCircle className="text-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
