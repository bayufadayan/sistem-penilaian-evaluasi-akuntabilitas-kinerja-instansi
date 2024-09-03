import Image from "next/image";

export default function AkipCard() {
  return (
    <div className="evaluation-card-section">
      <div className="evaluation-card">
        <div className="background">
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

        <div className="card-information">
          <h3>LKE AKIP BPMSPH 2024</h3>
          <p className="range-date">17 Nov 2024 - 10 Des 2024</p>
        </div>
      </div>
    </div>
  );
}
