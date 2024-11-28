import React, { useEffect, useState } from 'react';

export default function EvaluationScore() {

    const [lastEvaluationScore, setLastEvaluationScore] = useState("");
    const [lastEvaluationTitle, setLastEvaluationTitle] = useState("");
    const [lastEvaluationGrade, setLastEvaluationGrade] = useState("");

    useEffect(() => {
        const fetchLastEvalScore = async () => {
            try {
                const response = await fetch("/api/calculateScore/evaluationscore");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const EvaluationScoreData = await response.json();
                setLastEvaluationScore(EvaluationScoreData.nilai.toFixed(2));
                setLastEvaluationTitle(EvaluationScoreData.evaluation.title);
                setLastEvaluationGrade(EvaluationScoreData.evaluation.grade);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchLastEvalScore();
    }, []);

    return (
        <div className='flex flex-row justify-between gap-2'>
            <div className="w-[60%] flex justify-start items-center text-left">
                <p className='text-blue-600 text-xl'>{lastEvaluationTitle}</p>
            </div>

            <div className="w-[40%] flex items-center justify-center border border-gray-300 rounded-lg p-2 text-blue-600 font-extrabold text-2xl">
                <span>{lastEvaluationScore}</span>
                <span>{lastEvaluationGrade}</span>
            </div>
        </div>
    );
}
