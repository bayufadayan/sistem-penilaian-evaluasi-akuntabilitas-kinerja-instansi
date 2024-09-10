"use client";
import styles from "@/styles/styles.module.css";
import Link from "next/link";
import AkipCard from "@/components/akipCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface EvaluationSheet {
  id: string;
  title: string;
  date_start: string | Date;
  date_finish: string | Date;
  status: string;
}

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status }: { data: unknown; status: string } =
    useSession();
  const router = useRouter();

  const [inProgressSheets, setInProgressSheets] = useState<EvaluationSheet[]>(
    []
  );
  const [previousSheets, setPreviousSheets] = useState<EvaluationSheet[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchSheets = async () => {
      const res = await fetch("/api/evaluations");
      const sheets: EvaluationSheet[] = await res.json();

      const currentYear = new Date().getFullYear();
      const inProgress = sheets.filter(
        (sheet) => sheet.status === "IN_PROGRESS"
      );
      const previous = sheets.filter(
        (sheet) => new Date(sheet.date_finish).getFullYear() < currentYear
      );

      setInProgressSheets(inProgress);
      setPreviousSheets(previous);
    };

    fetchSheets();
  }, [router, status]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.evaluationCardContainer}>
        <h4>Lembar Kerja Evaluasi Tersedia</h4>

        {inProgressSheets.map((sheet) => (
          <div className={styles.evaluationCardSection} key={sheet.id}>
            <AkipCard
              title={sheet.title}
              startDate={sheet.date_start}
              endDate={sheet.date_finish}
              url={`/sheets/${sheet.id}`}
            />
          </div>
        ))}

        <h4>Lembar Kerja Evaluasi Sebelumnya</h4>

        {previousSheets.map((sheet) => (
          <div className={styles.evaluationCardSection} key={sheet.id}>
            <AkipCard
              title={sheet.title}
              startDate={sheet.date_start}
              endDate={sheet.date_finish}
              url={`/sheets/${sheet.id}`}
            />
          </div>
        ))}
      </div>
      <div className={styles.summaryCard}>
        <div className={styles.title}>
          <h2 className="font-bold text-2xl">Ringkasan</h2>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.persentageSection}>
            <p>Progress Pengisian LKE Anda</p>
            <div className={styles.persentage}>
              <div className={styles.progressBar}>
                <div className={styles.insideProgress}>a</div>
              </div>
              <p>90%</p>
            </div>
          </div>
          <Link href="#">
            <button type="button">Lengkapi Sekarang</button>
          </Link>
        </div>

        <div className={`${styles.deadlineSection} flex`}>
          <p>Deadline Pengisian LKE</p>
          <div className={styles.dateContainer}>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <title hidden> calendar-icon</title>
                <path
                  d="M8 14C7.71667 14 7.47933 13.904 7.288 13.712C7.09667 13.52 7.00067 13.2827 7 13C6.99933 12.7173 7.09533 12.48 7.288 12.288C7.48067 12.096 7.718 12 8 12C8.282 12 8.51967 12.096 8.713 12.288C8.90633 12.48 9.002 12.7173 9 13C8.998 13.2827 8.902 13.5203 8.712 13.713C8.522 13.9057 8.28467 14.0013 8 14ZM12 14C11.7167 14 11.4793 13.904 11.288 13.712C11.0967 13.52 11.0007 13.2827 11 13C10.9993 12.7173 11.0953 12.48 11.288 12.288C11.4807 12.096 11.718 12 12 12C12.282 12 12.5197 12.096 12.713 12.288C12.9063 12.48 13.002 12.7173 13 13C12.998 13.2827 12.902 13.5203 12.712 13.713C12.522 13.9057 12.2847 14.0013 12 14ZM16 14C15.7167 14 15.4793 13.904 15.288 13.712C15.0967 13.52 15.0007 13.2827 15 13C14.9993 12.7173 15.0953 12.48 15.288 12.288C15.4807 12.096 15.718 12 16 12C16.282 12 16.5197 12.096 16.713 12.288C16.9063 12.48 17.002 12.7173 17 13C16.998 13.2827 16.902 13.5203 16.712 13.713C16.522 13.9057 16.2847 14.0013 16 14ZM5 22C4.45 22 3.97933 21.8043 3.588 21.413C3.19667 21.0217 3.00067 20.5507 3 20V6C3 5.45 3.196 4.97933 3.588 4.588C3.98 4.19667 4.45067 4.00067 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.021 4.196 20.413 4.588C20.805 4.98 21.0007 5.45067 21 6V20C21 20.55 20.8043 21.021 20.413 21.413C20.0217 21.805 19.5507 22.0007 19 22H5ZM5 20H19V10H5V20Z"
                  fill="#622026"
                />
              </svg>{" "}
              12 Nov 2024 - 10 Des 2024
            </p>
          </div>
          <div className={styles.reminderContainer}>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
              >
                <title hidden>bel icon</title>
                <path
                  d="M12.9961 10.309C12.6709 9.74883 12.1875 8.16387 12.1875 6.09375C12.1875 4.85055 11.6936 3.65826 10.8146 2.77919C9.93548 1.90011 8.74319 1.40625 7.49999 1.40625C6.25679 1.40625 5.06451 1.90011 4.18543 2.77919C3.30635 3.65826 2.81249 4.85055 2.81249 6.09375C2.81249 8.16445 2.32851 9.74883 2.00331 10.309C1.92027 10.4514 1.87624 10.6132 1.87568 10.778C1.87511 10.9429 1.91802 11.105 2.00009 11.2479C2.08215 11.3909 2.20047 11.5097 2.3431 11.5924C2.48573 11.675 2.64764 11.7186 2.81249 11.7188H5.2037C5.31185 12.2479 5.59946 12.7235 6.01788 13.0651C6.43631 13.4067 6.95986 13.5932 7.49999 13.5932C8.04012 13.5932 8.56368 13.4067 8.9821 13.0651C9.40052 12.7235 9.68813 12.2479 9.79628 11.7188H12.1875C12.3523 11.7185 12.5141 11.6749 12.6567 11.5922C12.7992 11.5095 12.9175 11.3906 12.9995 11.2477C13.0815 11.1047 13.1243 10.9427 13.1237 10.7779C13.1231 10.6131 13.0791 10.4513 12.9961 10.309ZM7.49999 12.6562C7.20926 12.6562 6.9257 12.566 6.68835 12.3981C6.451 12.2302 6.27151 11.9929 6.1746 11.7188H8.82538C8.72847 11.9929 8.54899 12.2302 8.31163 12.3981C8.07428 12.566 7.79072 12.6562 7.49999 12.6562Z"
                  fill="#ED1B24"
                />
              </svg>{" "}
              tersisa 3 hari lagi!
            </p>
          </div>
        </div>

        <div className={styles.summarySection}>
          <p>Ringkasan Hasil Sementara</p>
          <div className={styles.summaryScoreCard}>
            <div className={styles.tempResult}>
              <div className={styles.information}>
                <div className={styles.scoreInfo}>
                  <p>Nilai AKuntabilitas Kinerja</p>
                  <p>79,55</p>
                </div>

                <div className={styles.scoreInfo}>
                  <p>Status Pengisian</p>
                  <p>45 ASN telah mengisi LKE</p>
                </div>
              </div>
            </div>

            <div className={styles.grade}>
              <div className={styles.gradeScore}>BB</div>
            </div>
          </div>
        </div>

        <div className={styles.buttonSection}>
          <Link href="#">
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

          <Link href="#">
            <button type="button">
              <div className={styles.icon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <title hidden>whatsapp icon</title>
                  <g clip-path="url(#clip0_118_4026)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12C2 13.89 2.525 15.66 3.438 17.168L2.546 20.2C2.49478 20.3741 2.49141 20.5587 2.53624 20.7346C2.58107 20.9104 2.67245 21.0709 2.80076 21.1992C2.92907 21.3276 3.08958 21.4189 3.26542 21.4638C3.44125 21.5086 3.62592 21.5052 3.8 21.454L6.832 20.562C8.39074 21.5049 10.1782 22.0023 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM9.738 14.263C11.761 16.285 13.692 16.552 14.374 16.577C15.411 16.615 16.421 15.823 16.814 14.904C16.8632 14.7896 16.881 14.6641 16.8655 14.5405C16.85 14.417 16.8019 14.2998 16.726 14.201C16.178 13.501 15.437 12.998 14.713 12.498C14.5619 12.3932 14.3761 12.3512 14.1946 12.3806C14.0131 12.4101 13.8502 12.5088 13.74 12.656L13.14 13.571C13.1083 13.62 13.0591 13.6551 13.0025 13.6692C12.9459 13.6833 12.886 13.6754 12.835 13.647C12.428 13.414 11.835 13.018 11.409 12.592C10.983 12.166 10.611 11.6 10.402 11.219C10.3767 11.1705 10.3696 11.1145 10.3819 11.0611C10.3941 11.0078 10.425 10.9606 10.469 10.928L11.393 10.242C11.5252 10.1276 11.6106 9.96841 11.6328 9.79495C11.6549 9.62149 11.6123 9.44596 11.513 9.302C11.065 8.646 10.543 7.812 9.786 7.259C9.6881 7.18866 9.57369 7.14479 9.45385 7.13165C9.33402 7.11851 9.21282 7.13654 9.102 7.184C8.182 7.578 7.386 8.588 7.424 9.627C7.449 10.309 7.716 12.24 9.738 14.263Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_118_4026">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p>Hubungi Admin</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
