// "use client";
// import { useEffect, useState } from "react";
// import { uploadFileToSupabase, supabase } from "@/lib/supabaseClient";
// import type { Evidence } from "@prisma/client";
// import axios from "axios";

// export default function Upload() {
//   const [file, setFile] = useState<File | null>(null);
//   const [evidenceData, setEvidenceData] = useState<Evidence[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [fileIdToDelete, setFileIdToDelete] = useState<number | null>(null);

//   const handleUpload = async (selectedFile: File) => {
//     setIsLoading(true);
//     try {
//       const data = await uploadFileToSupabase(selectedFile);
//       if (data) {
//         const fileName = selectedFile.name;
//         const fileType = selectedFile.type;
//         const fileSize = selectedFile.size;
//         const filePath = data.path;
//         const dateUploadedAt = new Date().toISOString();

//         const { data: publicData } = supabase.storage
//           .from("evidence")
//           .getPublicUrl(filePath);

//         const publicUrl = publicData?.publicUrl || "";

//         const newEvidence = {
//           file_name: fileName,
//           file_type: fileType,
//           file_size: fileSize,
//           file_path: filePath,
//           public_path: publicUrl,
//           date_uploaded_at: dateUploadedAt,
//           id_score: 1,
//         };

//         await axios.post("/api/evidence", newEvidence);

//         alert("File berhasil diunggah dan data berhasil disimpan di database!");
//         fetchEvidence();
//       }
//     } catch (error) {
//       const errorMessage = error;
//       alert(`Gagal mengunggah file: ${errorMessage}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFileChange = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const selectedFile = event.target.files?.[0] || null;
//     setFile(selectedFile);

//     if (selectedFile) {
//       await handleUpload(selectedFile);
//     }
//   };

//   const handleButtonClick = () => {
//     const fileInput = document.getElementById(
//       "hiddenFileInput"
//     ) as HTMLInputElement;
//     if (fileInput) {
//       fileInput.click();
//     }
//   };

//   // Fetch data evidence dari API
//   const fetchEvidence = async () => {
//     try {
//       const response = await axios.get("/api/evidence");
//       setEvidenceData(response.data.evidence);
//     } catch (error) {
//       console.error("Error fetching evidence:", error);
//     }
//   };

//   // UseEffect untuk fetch data evidence saat komponen pertama kali di-mount
//   useEffect(() => {
//     fetchEvidence();
//   }, []);

//   const handleDelete = async (id: number) => {
//     try {
//       await axios.delete(`/api/evidence/${id}`);
//       alert("File berhasil dihapus");
//       fetchEvidence(); // Fetch ulang data setelah delete
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       alert("Gagal menghapus file");
//     }
//   };

//   const openModal = (id: number) => {
//     setFileIdToDelete(id); // Simpan id file yang akan dihapus
//     const modal = document.getElementById("popup-modal");
//     modal?.classList.remove("hidden"); // Tampilkan modal
//   };

//   const closeModal = () => {
//     const modal = document.getElementById("popup-modal");
//     modal?.classList.add("hidden"); // Sembunyikan modal
//   };

//   const confirmDelete = () => {
//     if (fileIdToDelete) {
//       handleDelete(fileIdToDelete); // Hapus file dengan id yang dipilih
//       closeModal(); // Tutup modal setelah delete
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50 overflow-scroll">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md overflow-scroll">
//         <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
//           Upload File
//         </h1>

//         <input
//           id="hiddenFileInput"
//           type="file"
//           onChange={handleFileChange}
//           style={{ display: "none" }}
//         />

//         <button
//           type="button"
//           onClick={handleButtonClick}
//           className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
//         >
//           {isLoading ? "Uploading..." : "+ Tambah file"}
//         </button>

//         {/* Tampilkan data evidence sebagai card */}
//         <div className="mt-6">
//           {evidenceData.length > 0 ? (
//             evidenceData.map((evidence) => (
//               <div
//                 key={evidence.id}
//                 className="p-4 mb-4 bg-gray-100 rounded-lg shadow-md"
//               >
//                 <h2 className="text-lg font-semibold">{evidence.file_name}</h2>
//                 <p>Type: {evidence.file_type}</p>
//                 <p>Size: {(evidence.file_size / 1024).toFixed(2)} KB</p>
//                 <p>
//                   Uploaded At:{" "}
//                   {new Date(evidence.date_uploaded_at).toLocaleString()}
//                 </p>
//                 <p>
//                   Public URL:{" "}
//                   <a
//                     href={evidence.public_path}
//                     target="_blank"
//                     className="text-blue-500"
//                     rel="noreferrer"
//                   >
//                     View File
//                   </a>
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => openModal(evidence.id)}
//                   className="text-white bg-red-600 hover:bg-red-800 px-4 py-2"
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No evidence found.</p>
//           )}
//         </div>
//       </div>

//       {/* Modal untuk konfirmasi delete */}
//       <div
//         id="popup-modal"
//         className="hidden fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50"
//       >
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
//           <p className="mb-4">Apakah kamu yakin ingin menghapus file ini?</p>
//           <div className="flex justify-end">
//             <button
//             type="button"
//               onClick={confirmDelete}
//               className="bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
//             >
//               Yes, I&apos;m sure
//             </button>
//             <button
//             type="button"
//               onClick={closeModal}
//               className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
//             >
//               No, cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
