import React, { useEffect, useState } from 'react';

interface EvaluationSheetScore {
    id: number;
    nilai: number | null;
    grade: string | null;
    id_LKE: string;
    evaluation: EvaluationSheet;
}

interface EvaluationSheet {
    id: string;
    title: string;
    date_start: Date;
    date_finish: Date;
    description: string;
    status: string;
    year: string;
    color: string;
}

function EvaluationScoreTable() {
    const [evaluationSheetScoreData, setEvaluationSheetScoreData] = useState<EvaluationSheetScore[]>([]);

    useEffect(() => {
        const fetchEvaluationSheetScoreData = async () => {
            try {
                const response = await fetch("/api/calculateScore/evaluationscore");
                if (!response.ok) {
                    throw new Error("Failed to fetch EvaluationSheetScore");
                }
                const EvaluationSheetScoreData = await response.json();
                setEvaluationSheetScoreData(EvaluationSheetScoreData);
            } catch (error) {
                console.error("Failed to fetch EvaluationSheetScoreData:", error);
            }
        };

        fetchEvaluationSheetScoreData();
    }, []);

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Nilai LKE</h3>
            <small className='text-blue-600'>Diurutkan dari nilai terbesar</small>
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 min-w-fit text-left">#</th>
                            <th className="px-4 py-2 min-w-[60%] text-left">Judul</th>
                            <th className="px-4 py-2 min-w-[35%] text-left">Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {evaluationSheetScoreData.length !== 0 ? (
                            evaluationSheetScoreData.map((evalScore, index) => (
                                <tr
                                    key={evalScore.id || index}
                                    style={{
                                        background: index === 0
                                            ? "linear-gradient(90deg, #FFA500, #FFC700, #FFA500)"
                                            : "transparent",
                                        backgroundSize: "200% 200%",
                                        animation: index === 0
                                            ? "gradientMove 3s infinite alternate"
                                            : "none",
                                        animationName: index === 0
                                            ? `keyframes-gradientMove`
                                            : "none",
                                    }}
                                    className={index === 0 ? "text-white font-bold" : ""}
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{evalScore.evaluation.title}</td>
                                    <td className="px-4 py-2">{evalScore.nilai}</td>
                                </tr>
                            ))
                        ) : (<tr>
                            <td colSpan={3} className="px-4 py-2">Tidak ada Data</td>
                        </tr>)}


                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EvaluationScoreTable;