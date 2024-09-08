import Link from "next/link"
import SubComponentCard from "./subComponent"

export default function SidebarUser() {

    return (
        <div className="lke-sidebar">
        <div className="sidebar-header">
          <div className="title">
            <h4>LKE AKIP BPMSPH 2024</h4>
          </div>

          <a href="/fill-scoring-explain.html">
            <button type="button">Penjelasan Penilaian</button>
          </a>
        </div>

        <div className="lke-components-container">
          <h5>Pengisian LKE</h5>

          <div className="lke-components-section">
            
            <SubComponentCard/>
            <SubComponentCard/>
            
          </div>
        </div>

        <Link href="#"><button type="button">Selesai</button></Link>
      </div>
    )
}