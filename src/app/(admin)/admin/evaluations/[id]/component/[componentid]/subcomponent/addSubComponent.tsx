"use client";
import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";

export default function AddSubComponent({
  componentId,
}: {
  componentId: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [subcomponenNumber, setSubComponentNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await axios.post("/api/subcomponents", {
      name: name,
      description: description,
      weight: weight,
      subcomponent_number: subcomponenNumber,
      id_components: componentId,
    });
    setIsLoading(false);
    setName("");
    setDescription("");
    setWeight("");
    setSubComponentNumber("");
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
        Tambah Sub Komponen
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah Sub Komponen Baru</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Nomor Sub Komponen
              </label>
              <input
                type="number"
                value={subcomponenNumber}
                onChange={(e) => setSubComponentNumber(e.target.value)}
                className="input input-bordered"
                placeholder="Nomor Sub Komponen"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Nama Sub Komponen
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
                placeholder="Nama Sub Komponen"
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
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Bobot
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input input-bordered"
                placeholder="0.00"
                required
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
