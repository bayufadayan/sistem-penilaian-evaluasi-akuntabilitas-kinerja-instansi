"use client";
import { TiHome } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useDataContext } from "../../layout";
import axios from "axios";
import { FaBell, FaEnvelope, FaClock } from "react-icons/fa";

export default function NotificationsPage() {
  const dataContext = useDataContext();
  const [isTriggering, setIsTriggering] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data: {
      evaluationsChecked: number;
      emailsSent: number;
      uniqueRecipients: number;
      errors: number;
      errorDetails: string[];
    };
  } | null>(null);

  const handleManualTrigger = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin mengirim notifikasi deadline secara manual?"
      )
    ) {
      return;
    }

    setIsTriggering(true);
    setResult(null);

    try {
      const response = await axios.post("/api/cron/deadline-notifications", {
        manualTrigger: true,
      });

      setResult(response.data);
      alert(
        `Berhasil! Email dikirim ke ${response.data.data.uniqueRecipients} penerima.`
      );
    } catch (error) {
      console.error("Error triggering notifications:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(
        `Gagal mengirim notifikasi: ${errorMessage}`
      );
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manajemen Notifikasi | {dataContext?.appNameContext}</title>
        <meta
          name="description"
          content="Mengelola notifikasi email deadline evaluasi"
        />
      </Helmet>
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 text-gray-500 flex gap-1 items-start">
          <Link href="/admin" className="text-blue-600">
            <span className="flex gap-1">
              <TiHome className="mt-0.5" /> Dashboard
            </span>
          </Link>
          <IoIosArrowForward className="h-5 w-5" />
          Manajemen Notifikasi
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Manajemen Notifikasi Email</h1>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Notifikasi Aktif</p>
                <p className="text-2xl font-bold text-gray-800">Otomatis</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FaEnvelope className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Trigger Interval</p>
                <p className="text-2xl font-bold text-gray-800">Harian</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Peringatan Deadline</p>
                <p className="text-2xl font-bold text-gray-800">3 Hari</p>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Trigger Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Kirim Notifikasi Manual
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-600 mb-2">
                Kirim email reminder ke tim yang memiliki evaluasi dengan
                deadline dalam 3 hari ke depan.
              </p>
              <p className="text-sm text-gray-500">
                💡 <strong>Info:</strong> Hanya tim dengan progress &lt; 100%
                yang akan menerima notifikasi.
              </p>
            </div>
            <button
              onClick={handleManualTrigger}
              disabled={isTriggering}
              className="btn btn-primary"
            >
              {isTriggering ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Mengirim...
                </>
              ) : (
                <>
                  <FaEnvelope className="w-4 h-4" />
                  Kirim Notifikasi
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Hasil Pengiriman</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="stat bg-blue-50 rounded-lg">
                <div className="stat-title">Evaluasi Dicek</div>
                <div className="stat-value text-blue-600">
                  {result.data.evaluationsChecked}
                </div>
              </div>
              <div className="stat bg-green-50 rounded-lg">
                <div className="stat-title">Email Terkirim</div>
                <div className="stat-value text-green-600">
                  {result.data.emailsSent}
                </div>
                <div className="stat-desc">
                  Ke {result.data.uniqueRecipients} penerima unik
                </div>
              </div>
            </div>

            {result.data.errors > 0 && (
              <div className="alert alert-warning mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  {result.data.errors} email gagal dikirim. Cek console untuk
                  detail.
                </span>
              </div>
            )}
          </div>
        )}

        {/* How it Works */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Cara Kerja Notifikasi</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Pemeriksaan Otomatis
                </h3>
                <p className="text-gray-600 text-sm">
                  Sistem memeriksa evaluasi yang deadline-nya dalam 3 hari ke
                  depan setiap hari.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Filter Progress</h3>
                <p className="text-gray-600 text-sm">
                  Hanya tim dengan progress pengisian &lt; 100% yang akan
                  menerima notifikasi.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Kirim Email</h3>
                <p className="text-gray-600 text-sm">
                  Email dikirim ke semua anggota tim yang aktif dengan informasi
                  deadline dan progress saat ini.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-gray-700">
              <strong>⚙️ Setup Cron Job (Production):</strong>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Untuk mengaktifkan notifikasi otomatis di production, set up cron
              job atau scheduled task yang memanggil endpoint berikut setiap
              hari:
            </p>
            <code className="block mt-2 p-2 bg-gray-800 text-green-400 text-xs rounded">
              GET {process.env.NEXTAUTH_URL}/api/cron/deadline-notifications
              <br />
              Header: Authorization: Bearer [CRON_SECRET]
            </code>
            <p className="text-sm text-gray-600 mt-2">
              Tambahkan <code className="bg-gray-200 px-1 rounded">CRON_SECRET</code> ke file .env Anda.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
