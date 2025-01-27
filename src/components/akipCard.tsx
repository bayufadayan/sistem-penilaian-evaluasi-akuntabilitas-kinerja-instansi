import Image from "next/image";
import styles from "@/styles/styles.module.css";
import Link from "next/link";

interface AkipCardProps {
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  url: string;
}

export default function AkipCard({
  title,
  startDate,
  endDate,
  url,
}: AkipCardProps) {
  return (
    <Link href={url}>
      <div className={styles.evaluationCard}>
        <div className={styles.background}>
          <Image
            src="/images/card-bg-1.png"
            alt="card-bg2"
            width={147}
            height={144}
          />
          <Image
            src="/images/card-bg-2png.png"
            alt="card-bgs"
            width={165}
            height={165}
          />
        </div>

        <div className={styles.cardInformation}>
          <h3 className="font-bold">
            {" "}
            {title.length > 20 ? `${title.slice(0, 20)}...` : title}
          </h3>
          <p className={`${styles.rangeDate} shadow-md md:shadow-none`}>
            {new Date(startDate).toLocaleDateString()} -{" "}
            {new Date(endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
