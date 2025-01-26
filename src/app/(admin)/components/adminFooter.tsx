import React from 'react';

function AdminFooter() {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-8 absolute left-64 w-[calc(100%-16rem)] h-16 flex items-center">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} BPMSPH. Semua hak cipta dilindungi.
                </p>
            </div>
        </footer>
    );
}

export default AdminFooter;
