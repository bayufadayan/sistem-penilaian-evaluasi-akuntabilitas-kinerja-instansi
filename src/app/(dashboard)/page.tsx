"use client";
import styles from "@/styles/styles.module.css";
import Link from "next/link";
import AkipCard from "@/components/akipCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ContactAdminButton from "./hubungiAdminButton";

interface EvaluationSheet {
  id: string;
  title: string;
  date_start: string | Date;
  date_finish: string | Date;
  description: string;
  status: string;
  year: string;
  evaluationSheetScore: EvaluationSheetScore[];
}

interface EvaluationSheetScore {
  id: number;
  nilai: number | null;
  grade: string | null;
  id_LKE: string;
}


interface Score {
  id: string;
  score: string;
  notes: string | null;
  created_at: string;
  id_criterias: string;
  id_users: string | null;
}

interface Criteria {
  id: string;
  name: string;
  description: string | null;
  criteria_number: number;
  id_subcomponents: string;
  score: Score[];
}

interface SubComponent {
  id: string;
  name: string;
  description: string;
  weight: number;
  subcomponent_number: number;
  id_components: string;
  subComponentScore: Score[];
  criteria: Criteria[];
}

interface Component {
  id: string;
  name: string;
  description: string;
  weight: number;
  component_number: number;
  id_team: number;
  id_LKE: string;
  componentScore: Score[];
  subComponents: SubComponent[];
}

interface Evaluation {
  id: string;
  title: string;
  date_start: string | Date;
  date_finish: string | Date;
  description: string;
  status: string;
  year: string;
  color: string;
  components: Component[];
}

interface CriteriaStats {
  totalCriteria: number,
  emptyCriteriaCount: number,
  filledCriteriaCount: number,
}

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status }: { data: unknown; status: string } =
    useSession();
  const router = useRouter();

  const [inProgressSheets, setInProgressSheets] = useState<EvaluationSheet[]>(
    []
  );
  const [completedSheets, setCompletedSheets] = useState<EvaluationSheet[]>([]);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [criteriaStats, setCriteriaStats] = useState<CriteriaStats>({
    totalCriteria: 0,
    emptyCriteriaCount: 0,
    filledCriteriaCount: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchSheets = async () => {
      const res = await fetch("/api/evaluations");
      const sheets: EvaluationSheet[] = await res.json();

      const inProgress = sheets.filter(
        (sheet) => sheet.status === "IN_PROGRESS"
      );
      const completed = sheets.filter((sheet) => sheet.status === "COMPLETED");

      setInProgressSheets(inProgress);
      setCompletedSheets(completed);
    };

    fetchSheets();
  }, [router, status]);

  useEffect(() => {
    if (inProgressSheets.length > 0) {
      const finishDate = new Date(inProgressSheets[0].date_finish);
      const today = new Date();

      const timeDifference = finishDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setDaysRemaining(remainingDays);
    }
  }, [inProgressSheets]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchCriteriaCount = async () => {
      if (!inProgressSheets || inProgressSheets.length === 0) {
        console.log('Loading in-progress sheets...');
        return;
      }

      try {
        const res = await fetch(`/api/evaluations/${inProgressSheets[0].id}`);

        // Pastikan response berhasil
        if (!res.ok) {
          console.error('Failed to fetch data:', res.statusText);
          return;
        }

        const data: Evaluation = await res.json();
        console.log("Data fetched:", data);

        const allCriteria = data.components.flatMap((component: Component) =>
          component.subComponents.flatMap((subComponent: SubComponent) => subComponent.criteria)
        );

        const totalCriteriaCount = allCriteria.length;
        const emptyCriteriaCount = allCriteria.filter(
          (criteria: Criteria) => criteria.score[0].score === ""
        ).length;

        setCriteriaStats({
          totalCriteria: totalCriteriaCount,
          emptyCriteriaCount,
          filledCriteriaCount: totalCriteriaCount - emptyCriteriaCount,
        });
      } catch (error) {
        console.error('Error fetching criteria count:', error);
      }
    };

    fetchCriteriaCount();
  }, [inProgressSheets, status, router]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.evaluationCardContainer}>
        <h4>Lembar Kerja Evaluasi Tersedia</h4>
        <div className={styles.evaluationCardSection}>
          {inProgressSheets.length === 0 ? (
            <div className={styles.evaluationCardSection}>
              <p>Tidak ada LKE ditemukan</p>
            </div>
          ) : (
            inProgressSheets.map((sheet) => (
              <AkipCard
                key={sheet.id}
                title={sheet.title}
                startDate={sheet.date_start}
                endDate={sheet.date_finish}
                url={`/sheets/${sheet.id}`}
              />
            ))
          )}
        </div>

        <h4>Lembar Kerja Evaluasi Selesai</h4>
        {completedSheets.length === 0 ? (
          <div className={styles.evaluationCardSection}>
            <p>Tidak ada LKE ditemukan</p>
          </div>
        ) : (
          <div className={styles.evaluationCardSection}>
            {completedSheets.map((sheet) => (
              <AkipCard
                key={sheet.id}
                title={sheet.title}
                startDate={sheet.date_start}
                endDate={sheet.date_finish}
                url={`/sheets/${sheet.id}`}
              />
            ))}
          </div>
        )}

      </div>
      <div className={styles.summaryCard}>
        <div className={styles.title}>
          <h2 className="font-bold text-xl flex justify-center">
            {inProgressSheets.length !== 0 ?
              <h2 className="mt-[8px] text-center font-bold px-8 py-2 bg-green-600 rounded-full shadow-md text-white w-fit">{inProgressSheets[0]?.title ?? "Loading .."}</h2>
              : (
                "Ringkasan"
              )}
          </h2>
        </div>

        {inProgressSheets.length !== 0 ? (

          <div className={inProgressSheets.length === 0 ? "hidden" : "-mt-3 flex flex-col gap-4"}>
            <div className={styles.progressSection}>
              <div className={styles.persentageSection}>
                <p>Progess Pengisian Keseluruhan</p>
                <div className={styles.persentage}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.insideProgress}
                      style={{
                        width: `${(criteriaStats.filledCriteriaCount / criteriaStats.totalCriteria) * 100}%`,
                        transition: 'width 0.5s ease-out',
                      }}>
                      {(criteriaStats.filledCriteriaCount / criteriaStats.totalCriteria) * 100}
                    </div>
                  </div>
                  <p>{(criteriaStats.filledCriteriaCount / criteriaStats.totalCriteria) * 100}%</p>
                </div>
              </div>
              {inProgressSheets.length > 0 && (
                <Link href={`/sheets/${inProgressSheets[0].id}/summary`}>
                  <button type="button">Lihat Hasil LKE Terkini</button>
                </Link>
              )}
            </div>

            <div className={`${styles.deadlineSection} flex`}>
              <p>Deadline Pengisian LKE</p>
              <div
                className={`${styles.dateContainer} ${daysRemaining !== null && daysRemaining <= 10
                  ? "text-red-900 bg-red-200 border-red-900"
                  : "text-green-900 bg-green-200 border-green-900"
                  }`}
              >
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <title hidden> calendar-icon</title>
                    <path
                      d="M8 14C7.71667 14 7.47933 13.904 7.288 13.712C7.09667 13.52 7.00067 13.2827 7 13C6.99933 12.7173 7.09533 12.48 7.288 12.288C7.48067 12.096 7.718 12 8 12C8.282 12 8.51967 12.096 8.713 12.288C8.90633 12.48 9.002 12.7173 9 13C8.998 13.2827 8.902 13.5203 8.712 13.713C8.522 13.9057 8.28467 14.0013 8 14ZM12 14C11.7167 14 11.4793 13.904 11.288 13.712C11.0967 13.52 11.0007 13.2827 11 13C10.9993 12.7173 11.0953 12.48 11.288 12.288C11.4807 12.096 11.718 12 12 12C12.282 12 12.5197 12.096 12.713 12.288C12.9063 12.48 13.002 12.7173 13 13C12.998 13.2827 12.902 13.5203 12.712 13.713C12.522 13.9057 12.2847 14.0013 12 14ZM16 14C15.7167 14 15.4793 13.904 15.288 13.712C15.0967 13.52 15.0007 13.2827 15 13C14.9993 12.7173 15.0953 12.48 15.288 12.288C15.4807 12.096 15.718 12 16 12C16.282 12 16.5197 12.096 16.713 12.288C16.9063 12.48 17.002 12.7173 17 13C16.998 13.2827 16.902 13.5203 16.712 13.713C16.522 13.9057 16.2847 14.0013 16 14ZM5 22C4.45 22 3.97933 21.8043 3.588 21.413C3.19667 21.0217 3.00067 20.5507 3 20V6C3 5.45 3.196 4.97933 3.588 4.588C3.98 4.19667 4.45067 4.00067 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.021 4.196 20.413 4.588C20.805 4.98 21.0007 5.45067 21 6V20C21 20.55 20.8043 21.021 20.413 21.413C20.0217 21.805 19.5507 22.0007 19 22H5ZM5 20H19V10H5V20Z"
                      fill={
                        daysRemaining !== null && daysRemaining <= 10
                          ? "#7F1D1D"
                          : "#14532D"
                      }
                    />
                  </svg>{" "}
                  {inProgressSheets.length > 0 ? (
                    <span>
                      {`${new Date(
                        inProgressSheets[0].date_start
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })} - ${new Date(
                        inProgressSheets[0].date_finish
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}`}
                    </span>
                  ) : (
                    <span>Tidak ada tanggal tersedia</span>
                  )}
                </p>
              </div>
              <div
                className={`${styles.reminderContainer} ${daysRemaining !== null && daysRemaining <= 10
                  ? "text-red-900"
                  : "text-green-900"
                  }`}
              >
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    className="mt-0.5"
                  >
                    <title hidden>bel icon</title>
                    <path
                      d="M12.9961 10.309C12.6709 9.74883 12.1875 8.16387 12.1875 6.09375C12.1875 4.85055 11.6936 3.65826 10.8146 2.77919C9.93548 1.90011 8.74319 1.40625 7.49999 1.40625C6.25679 1.40625 5.06451 1.90011 4.18543 2.77919C3.30635 3.65826 2.81249 4.85055 2.81249 6.09375C2.81249 8.16445 2.32851 9.74883 2.00331 10.309C1.92027 10.4514 1.87624 10.6132 1.87568 10.778C1.87511 10.9429 1.91802 11.105 2.00009 11.2479C2.08215 11.3909 2.20047 11.5097 2.3431 11.5924C2.48573 11.675 2.64764 11.7186 2.81249 11.7188H5.2037C5.31185 12.2479 5.59946 12.7235 6.01788 13.0651C6.43631 13.4067 6.95986 13.5932 7.49999 13.5932C8.04012 13.5932 8.56368 13.4067 8.9821 13.0651C9.40052 12.7235 9.68813 12.2479 9.79628 11.7188H12.1875C12.3523 11.7185 12.5141 11.6749 12.6567 11.5922C12.7992 11.5095 12.9175 11.3906 12.9995 11.2477C13.0815 11.1047 13.1243 10.9427 13.1237 10.7779C13.1231 10.6131 13.0791 10.4513 12.9961 10.309ZM7.49999 12.6562C7.20926 12.6562 6.9257 12.566 6.68835 12.3981C6.451 12.2302 6.27151 11.9929 6.1746 11.7188H8.82538C8.72847 11.9929 8.54899 12.2302 8.31163 12.3981C8.07428 12.566 7.79072 12.6562 7.49999 12.6562Z"
                      fill={
                        daysRemaining !== null && daysRemaining <= 10
                          ? "#7F1D1D"
                          : "#14532D"
                      }
                    />
                  </svg>{" "}
                  {daysRemaining !== null && daysRemaining > 0 ? (
                    <span>Tersisa {daysRemaining} hari lagi!</span>
                  ) : (
                    <span>Deadline sudah lewat!</span>
                  )}
                </p>
              </div>
            </div>

            <div className={styles.summarySection}>
              <p>Ringkasan Hasil Sementara</p>
              <div className={styles.summaryScoreCard}>
                <div className={styles.tempResult}>
                  <div className={styles.information}>
                    <div className={styles.scoreInfo}>
                      <p>Nilai Akuntabilitas Kinerja</p>
                      <p>
                        {(inProgressSheets[0]?.evaluationSheetScore[0]?.nilai ?? "Nilai belum tersedia")}
                      </p>

                    </div>

                    <div className={styles.scoreInfo}>
                      <p>Status Pengisian</p>
                      <p>Jumlah Kriteria Terisi:
                        <span className="text-blue-800 py-1 px-2 bg-white rounded-md">
                          {criteriaStats.filledCriteriaCount}/{criteriaStats.totalCriteria}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.grade}>
                  <div className={`${styles.gradeScore} flex flex-col justify-center items-center`}>
                    <small className="text-sm text-gray-600 font-semibold">Grade</small>
                    {(inProgressSheets[0]?.evaluationSheetScore[0]?.grade ?? "N/A")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600">Tidak ada LKE Aktif</div>
        )}

        <div className={styles.buttonSection}>
          <Link href="/guide">
            <button type="button">
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <title hidden>book icon</title>
                  <path
                    d="M5.616 20C5.15533 20 4.771 19.846 4.463 19.538C4.155 19.23 4.00067 18.8453 4 18.384V5.616C4 5.15533 4.15433 4.771 4.463 4.463C4.77167 4.155 5.156 4.00067 5.616 4H18.385C18.845 4 19.2293 4.15433 19.538 4.463C19.8467 4.77167 20.0007 5.156 20 5.616V18.385C20 18.845 19.846 19.2293 19.538 19.538C19.23 19.8467 18.8453 20.0007 18.384 20H5.616ZM12.5 5V10.414C12.5 10.5753 12.5673 10.6953 12.702 10.774C12.8367 10.8527 12.9747 10.8487 13.116 10.762L14.091 10.165C14.219 10.0783 14.3553 10.035 14.5 10.035C14.6447 10.035 14.7813 10.0783 14.91 10.165L15.884 10.762C16.0253 10.8487 16.1633 10.8527 16.298 10.774C16.4327 10.6953 16.5 10.5753 16.5 10.414V5H12.5Z"
                    fill="white"
                  />
                </svg>
              </div>
              <p>Panduan Mengisi</p>
            </button>
          </Link>

          <ContactAdminButton />
        </div>
      </div>
    </div>
  );
}
