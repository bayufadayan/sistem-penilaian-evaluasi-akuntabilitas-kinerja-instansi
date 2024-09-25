"use client";
import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {FaPlus} from "react-icons/fa6";

export default function AddCriteria({
  subComponentId,
}: {
  subComponentId: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [criteriaNumber, setCriteriaNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await axios.post("/api/criterias", {
      name: name,
      description: description,
      criteria_number: criteriaNumber,
      id_subcomponents: Number(subComponentId),
    });
    setIsLoading(false);
    setName("");
    setDescription("");
    setCriteriaNumber("");
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
        Tambah Kriteria
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah Kriteria Baru</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Nomor Kriteria
              </label>
              <input
                type="number"
                value={criteriaNumber}
                onChange={(e) => setCriteriaNumber(e.target.value)}
                className="input input-bordered"
                placeholder="Nomor Kriteria"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Nama Kriteria
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
                placeholder="Nama Kriteria"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-5 py-2 textarea textarea-bordered"
                placeholder="Deskripsi"
              />
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModal}>
                Close
              </button>
              {!isLoading ? (
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Saving...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
