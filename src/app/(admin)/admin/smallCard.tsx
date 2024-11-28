import React, { useEffect, useState } from 'react';

function SmallCard({ title, value, color, borderColor }: { title: string; value: string; color: string; borderColor: string }) {


   

    return (
        <div className={`shadow-md flex flex-col items-center justify-center bg-white border ${borderColor} rounded-lg p-2`}>
            <h3 className={`text-xs font-medium ${color}`}>{title}</h3>
            <p className={`text-xl font-bold ${color} mt-1`}>{value}</p>
        </div>
    );
}

export default SmallCard;
