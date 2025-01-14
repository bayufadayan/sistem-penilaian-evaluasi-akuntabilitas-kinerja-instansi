"use client";
import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Team } from "@prisma/client";
import { FaPlus } from "react-icons/fa6";

export default function AddComponents({
  teams,
  id_LKE,
}: {
  teams: Team[];
  id_LKE: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [componentNumber, setComponentNumber] = useState("");
  const [idTeam, setIdTeam] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await axios.post("/api/components", {
      name: name,
      description: description,
      weight: weight,
      component_number: componentNumber,
      id_team: idTeam,
      id_LKE: id_LKE,  
    });

    setIsLoading(false);
    setName("");
    setDescription("");
    setWeight("");
    setComponentNumber("");
    setIdTeam("");
    router.refresh();
    setIsOpen(false);
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleModal}
        className="h-full inline-flex gap-1 items-center px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-blue-800 transition-all transform active:scale-95 shadow-md"
      >
        <FaPlus className="w-5 h-5 font-bold"/>
        Tambah Komponen
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-xl">Tambah Komponen Baru</h3>
          <form onSubmit={handleSubmit}>
          <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">Nomor <span className="text-xs text-red-600">Untuk urutan komponen</span></label>
              <input
                type="number"
                value={componentNumber}
                onChange={(e) => setComponentNumber(e.target.value)}
                className="input input-bordered"
                placeholder="Nomor Urutan Komponen"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">Nama Komponen</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
                placeholder="Masukan Nama Komponen"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-5 py-2 textarea textarea-bordered"
                placeholder="Masukan Deskripsi (Opsional)"
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">Bobot</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input input-bordered"
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="idTeam">Team</label>
              <select
                value={idTeam}
                onChange={(e) => setIdTeam(e.target.value)}
                id="idTeam"
                className="input input-bordered w-full"
                required
              >
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option value={team.id} key={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModal}>
                Batal
              </button>
              {!isLoading ? (
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Menyimpan...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
