import React, { useEffect, useState } from 'react';
import { User } from '@prisma/client';

function UserActivityTable() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const usersData = await response.json();
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Daftar User</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Nama</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length !== 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id || index}>
                                    <td className="px-4 py-2">{index}</td>
                                    <td className="px-4 py-2">{user.name}</td>
                                </tr>
                            ))
                        ) : (<tr>
                            <td colSpan={2} className="px-4 py-2">Tidak ada Data</td>
                        </tr>)}


                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserActivityTable;