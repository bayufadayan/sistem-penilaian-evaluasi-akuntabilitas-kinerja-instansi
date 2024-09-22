"use client";
import { useState, type SyntheticEvent } from "react";
import type { SubComponent } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UpdateSubComponent({
  subComponent,
  componentId, // Ambil `componentId` dari parameter
}: {
  subComponent: SubComponent;
  componentId: string;
}) {
  const [name, setName] = useState(subComponent.name);
  const [description, setDescription] = useState(subComponent.description);
  const [weight, setWeight] = useState(subComponent.weight);
  const [subComponentNumber, setSubComponentNumber] = useState(subComponent.subcomponent_number);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await axios.patch(`/api/subcomponents/${subComponent.id}`, {
      name: name,
      description: description,
      weight: weight,
      subcomponent_number: subComponentNumber,
      id_components: Number(componentId),
    });
    setIsLoading(false);
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
        className="mb-2 group-hover:opacity-100 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:focus:ring-yellow-900 h-full"
      >
        Edit
      </button>

      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Sub Komponen</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Nomor Sub Komponen
              </label>
              <input
                type="text"
                value={subComponentNumber}
                onChange={(e) => setSubComponentNumber(Number.parseInt(e.target.value))}
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
                value={description ?? "Tidak ada deskripsi"}
                onChange={(e) => setDescription(e.target.value)}
                className="px-5 py-2 textarea textarea-bordered"
                placeholder="Deskripsi"
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="">
                Weight
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number.parseFloat(e.target.value))}
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
                  Update
                </button>
              ) : (
                <button type="button" className="btn loading">
                  Updating...
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
