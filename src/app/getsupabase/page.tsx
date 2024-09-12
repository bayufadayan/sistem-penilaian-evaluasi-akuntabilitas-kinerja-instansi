'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Database palsu (array untuk menyimpan data sementara)
let fakeDatabase: { id: number; file_name: string; file_type: string; file_size: number; file_path: string; date_uploaded_at: string }[] = [];

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState(fakeDatabase); // State untuk menyimpan data file

  // Generate ID unik
  const generateId = () => {
    return fakeDatabase.length + 1;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadedFile(null); // Reset uploaded file state when selecting a new file

    if (!selectedFile) {
      return;
    }

    const fileExt = selectedFile.name.split('.').pop();
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    if (!allowedExtensions.includes(fileExt || '')) {
      setMessage('Hanya file bertipe PDF, Word, atau Excel yang diperbolehkan.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.storage
      .from('coba') // ganti dengan nama bucket Anda
      .upload(`public/${selectedFile.name}`, selectedFile);

    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('File berhasil diunggah!');
      setUploadedFile({ name: selectedFile.name, size: selectedFile.size }); // Simpan info file yang diunggah

      // Simpan data ke "database" palsu
      const newFile = {
        id: generateId(),
        file_name: selectedFile.name,
        file_type: fileExt || '',
        file_size: selectedFile.size,
        file_path: `public/${selectedFile.name}`, // Path ke file
        date_uploaded_at: new Date().toISOString(), // Tanggal sekarang
      };

      fakeDatabase.push(newFile);
      setFiles([...fakeDatabase]); // Update state dengan file yang baru
    }
  };

  const handleDelete = async (id: number, filePath: string) => {
    // Hapus file dari Supabase Storage
    const { error } = await supabase.storage.from('coba').remove([filePath]); // ganti 'coba' dengan nama bucket Anda

    if (error) {
      setMessage(`Gagal menghapus file di storage: ${error.message}`);
      return;
    }

    // Hapus file dari "database" palsu
    fakeDatabase = fakeDatabase.filter(file => file.id !== id);
    setFiles([...fakeDatabase]); // Update state setelah penghapusan

    setMessage('File berhasil dihapus dari storage dan database.');
  };

  const formatFileSize = (size: number) => {
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    return `${fileSize.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">Upload File</h1>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
        />

        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}

        {/* Menampilkan card dengan informasi file yang baru saja diunggah */}
        {uploadedFile && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">File Uploaded</h2>
            <p className="text-gray-600">Nama: {uploadedFile.name}</p>
            <p className="text-gray-600">Ukuran: {formatFileSize(uploadedFile.size)}</p>
          </div>
        )}

        {/* Menampilkan semua file dari "database" palsu */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700">Uploaded Files</h2>
          {files.map((file) => (
            <div key={file.id} className="mt-4 p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p className="text-gray-800">Nama: {file.file_name}</p>
                <p className="text-gray-600">Tipe: {file.file_type}</p>
                <p className="text-gray-600">Ukuran: {formatFileSize(file.file_size)}</p>
                <p className="text-gray-600">Tanggal: {new Date(file.date_uploaded_at).toLocaleString()}</p>
                <p className="text-gray-600">Path: {file.file_path}</p>
              </div>
              {/* Tombol Hapus dengan Icon */}
              <button
                onClick={() => handleDelete(file.id, file.file_path)}
                className="ml-4 text-red-600 hover:text-red-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upload;
