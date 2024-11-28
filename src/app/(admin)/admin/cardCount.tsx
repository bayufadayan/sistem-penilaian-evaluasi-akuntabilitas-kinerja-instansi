import React from 'react';

interface CardCountProps {
    title: string;
    value: string;
    color: string;
    icon?: React.ReactNode; // Tambahkan prop untuk ikon
}

const CardCount: React.FC<CardCountProps> = ({ title, value, color, icon }) => {
    return (
        <div className={`gap-3 w-full p-5 bg-gradient-to-tr ${color} rounded-lg shadow-md flex items-center justify-between border-l-4 border-${color}-600`}>
            <div className='flex flex-col justify-between'>
                <h2 className={`text-md font-bold mb-2 text-white`}>
                    {title}
                </h2>
                <p className={`text-3xl font-bold text-white`}>
                    {value}
                </p>
            </div>
            {icon}
        </div>
    );
}

export default CardCount;
