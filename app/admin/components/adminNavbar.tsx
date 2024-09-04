import Image from "next/image";

export default function AdminNavbar() {
  return (
    <header className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
      {/* Search Bar */}
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Type to search..."
            className="pl-10 pr-4 py-2 w-80 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="20"
            height="20"
          >
            <title hidden>a</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-6-6m0 0l6-6m-6 6h18"
            />
          </svg>
        </div>
      </div>

      {/* Right Side (Profile Section) */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" type="button">
            <svg
              className="text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
                <title hidden>a</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405a2.032 2.032 0 00-.59-1.412L15 9.341V7a3 3 0 10-6 0v2.341L6.996 14.183a2.032 2.032 0 00-.591 1.412L5 17h5m0 4h4m-5-4v1m0-5v-5m5 5v1"
              />
            </svg>
          </button>
          {/* Notification Dot */}
          {/* <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span> */}
        </div>

        {/* Profile Info */}
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <Image
            src="/profile.png" // ganti dengan path gambar profile
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="text-gray-900 font-semibold">Thomas Anree</p>
            <p className="text-sm text-gray-500">UX Designer</p>
          </div>
          <svg
            className="text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <title hidden>a</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
