import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiExternalLink } from "react-icons/fi";

export default function EvaluationScoreCompleted() {

    const [lastEvaluationScore, setLastEvaluationScore] = useState("");
    const [lastEvaluationTitle, setLastEvaluationTitle] = useState("");
    const [lastEvaluationGrade, setLastEvaluationGrade] = useState("");
    const [lastEvaluationId, setLastEvaluationId] = useState("");

    useEffect(() => {
        const fetchLastEvalScore = async () => {
            try {
                const response = await fetch("/api/calculateScore/evaluationscore/completed");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const EvaluationScoreData = await response.json();
                setLastEvaluationScore(EvaluationScoreData.nilai.toFixed(2));
                setLastEvaluationTitle(EvaluationScoreData.evaluation.title);
                setLastEvaluationGrade(EvaluationScoreData.grade);
                setLastEvaluationId(EvaluationScoreData.evaluation.id);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchLastEvalScore();
    }, []);

    return (
        <>
            <div className='flex flex-row justify-between gap-2'>
                <div className="w-[60%] flex justify-start items-center text-left">
                    <p className={`${lastEvaluationTitle ? "text-blue-600" : "text-red-600"} text-xl`}>{lastEvaluationTitle ? lastEvaluationTitle : "Belum ada LKE Selesai"}</p>
                </div>

                <div className="w-[40%] flex items-center justify-center border border-gray-300 rounded-lg p-2 text-blue-600 font-extrabold text-2xl">
                    <span>{lastEvaluationScore ? lastEvaluationScore : "N/A"}</span>
                </div>
            </div>
            <div className='mt-2 '>
                <p>Grade LKE </p>
                <span className='flex justify-between gap-2 w-full'>
                    <span
                        className={`
                    ${lastEvaluationGrade === 'AA' ? 'bg-blue-600' : ''}
                    ${lastEvaluationGrade === 'A' ? 'bg-green-600' : ''}
                    ${lastEvaluationGrade === 'BB' ? 'bg-yellow-600' : ''}
                    ${lastEvaluationGrade === 'B' ? 'bg-yellow-500' : ''}
                    ${lastEvaluationGrade === 'CC' ? 'bg-orange-500' : ''}
                    ${lastEvaluationGrade === 'C' ? 'bg-red-500' : ''}
                    ${lastEvaluationGrade === 'D' ? 'bg-gray-500' : ''}
                    bg-gray-500 text-white flex justify-center py-1 rounded-lg shadow-md font-bold text-xl w-4/5
                `}
                    >
                        {lastEvaluationGrade ? lastEvaluationGrade : "N/A"}
                    </span>
                    <Link target='_blank' href={`/sheets/${lastEvaluationId}/summary`} className={`text-blue-500 flex justify-center py-1 rounded-lg shadow-md font-bold text-xl w-1/5 ${!lastEvaluationId ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`} >
                        <FiExternalLink className='font-bold' />
                    </Link>
                </span>
            </div>

        </>
    );
}
export function EvaluationScoreInProgress() {

    const [lastEvaluationScore, setLastEvaluationScore] = useState("");
    const [lastEvaluationTitle, setLastEvaluationTitle] = useState("");
    const [lastEvaluationGrade, setLastEvaluationGrade] = useState("");
    const [lastEvaluationId, setLastEvaluationId] = useState("");

    useEffect(() => {
        const fetchLastEvalScore = async () => {
            try {
                const response = await fetch("/api/calculateScore/evaluationscore/inprogress");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const EvaluationScoreData = await response.json();
                setLastEvaluationScore(EvaluationScoreData.nilai.toFixed(2));
                setLastEvaluationTitle(EvaluationScoreData.evaluation.title);
                setLastEvaluationGrade(EvaluationScoreData.grade);
                setLastEvaluationId(EvaluationScoreData.evaluation.id);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchLastEvalScore();
    }, []);

    return (
        <>
            <div className='flex flex-row justify-between gap-2'>
                <div className="w-[60%] flex justify-start items-center text-left">
                    <p className={`${lastEvaluationTitle ? "text-blue-600" : "text-red-600"} text-xl`}>{lastEvaluationTitle ? lastEvaluationTitle : "Tidak ada LKE In Progress"}</p>
                </div>

                <div className="w-[40%] flex items-center justify-center border border-gray-300 rounded-lg p-2 text-blue-600 font-extrabold text-2xl">
                    <span>{lastEvaluationScore ? lastEvaluationScore : "N/A"}</span>
                </div>
            </div>
            <div className='mt-2 '>
                <p>Grade LKE </p>
                <span className='flex justify-between gap-2 w-full'>
                    <span
                        className={`
                    ${lastEvaluationGrade === 'AA' ? 'bg-blue-600' : ''}
                    ${lastEvaluationGrade === 'A' ? 'bg-green-600' : ''}
                    ${lastEvaluationGrade === 'BB' ? 'bg-yellow-600' : ''}
                    ${lastEvaluationGrade === 'B' ? 'bg-yellow-500' : ''}
                    ${lastEvaluationGrade === 'CC' ? 'bg-orange-500' : ''}
                    ${lastEvaluationGrade === 'C' ? 'bg-red-500' : ''}
                    ${lastEvaluationGrade === 'D' ? 'bg-gray-500' : ''}
                    bg-gray-500 text-white flex justify-center py-1 rounded-lg shadow-md font-bold text-xl w-4/5
                `}
                    >
                        {lastEvaluationGrade ? lastEvaluationGrade : "N/A"}
                    </span>
                    <Link target='_blank' href={`/sheets/${lastEvaluationId}/summary`} className={`text-blue-500 flex justify-center py-1 rounded-lg shadow-md font-bold text-xl w-1/5 ${!lastEvaluationId ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`} >
                        <FiExternalLink className='font-bold' />
                    </Link>
                </span>
            </div>

        </>
    );
}
