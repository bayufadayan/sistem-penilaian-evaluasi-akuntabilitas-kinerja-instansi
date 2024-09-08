"use client";
import { type SyntheticEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UpdateEvaluationPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [loadingData, setLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateFinish, setDateFinish] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [year, setYear] = useState("");

  const router = useRouter();

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/evaluations/${id}`, {
        title: title,
        date_start: new Date(dateStart),
        date_finish: new Date(dateFinish),
        description: description,
        status: status,
        year: year,
      });

      console.log("Response:", response.data);
      setTitle("");
      setDateStart("");
      setDateFinish("");
      setDescription("");
      setStatus("");
      setYear("");
      setIsLoading(false);

      router.replace(`/admin/evaluations?timestamp=${new Date().getTime()}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`/api/evaluations/${id}`);
      console.log("Response from API:", response.data);

      const evaluation = response.data;

      if (!evaluation) {
        router.push("/404");
        return;
      }
      setTitle(evaluation.title || "");
      setDateStart(new Date(evaluation.date_start).toISOString().split("T")[0]);
      setDateFinish(
        new Date(evaluation.date_finish).toISOString().split("T")[0]
      );
      setDescription(evaluation.description || "");
      setStatus(evaluation.status || "");
      setYear(evaluation.year || "");

      setLoadingData(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      {loadingData && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            <p className="mt-4 text-white text-lg">Sedang mengambil data...</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Update Evaluation
        </h2>
        <form onSubmit={handleUpdate}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="title"
                className="label font-bold"
              >
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                id="title"
                className="input input-bordered w-full"
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="col-span-1">
              <label
                htmlFor="dateStart"
                className="label font-bold"
              >
                Start Date
              </label>
              <input
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                type="date"
                id="dateStart"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="col-span-1">
              <label
                htmlFor="dateFinish"
                className="label font-bold"
              >
                Finish Date
              </label>
              <input
                value={dateFinish}
                onChange={(e) => setDateFinish(e.target.value)}
                type="date"
                id="dateFinish"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="description"
                className="label font-bold"
              >
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                className="px-5 py-2 textarea textarea-bordered rounded-lg w-full"
                placeholder="Enter event description"
                required
              />
            </div>

            <div className="col-span-1">
              <label
                htmlFor="status"
                className="label font-bold"
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                id="status"
                className="input input-bordered w-full"
              >
                <option value="">Select status</option>
                <option value="PENDING" selected>
                  PENDING
                </option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="year"
                className="label font-bold"
              >
                Year
              </label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                type="number"
                id="year"
                className="input input-bordered w-full"
                placeholder="Enter year"
                required
              />
            </div>
          </div>

          {!isLoading ? (
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Saving...
            </button>
          )}
        </form>
      </div>
    </>
  );
}
