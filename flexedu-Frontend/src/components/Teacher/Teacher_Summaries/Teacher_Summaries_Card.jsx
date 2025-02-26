import { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../../../AppContext";
import { CiImageOn } from "react-icons/ci";
import {
    FaStar,
    FaStarHalf,
    FaUserGraduate,
    FaBookOpen,
    FaCalendarAlt,
    FaTrashAlt,
    FaEye,
} from "react-icons/fa";
import dayjs from "dayjs";

function Teacher_Summaries_Card({ Summary, setSummaries }) {
    const { user } = useAppContext();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const deleteSummary = async () => {
        setDeleteLoading(true);
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                const response = await axios.delete(
                    `http://localhost:3000/Teachers/${user?.id}/Summaries/${Summary?.id}`,
                    { withCredentials: true, validateStatus: () => true }
                );
                if (response.status === 200) {
                    Swal.fire(
                        "Deleted!",
                        "Summary has been deleted.",
                        "success"
                    );
                    setSummaries((prev) =>
                        prev.filter((s) => s.id !== Summary?.id)
                    );
                } else {
                    Swal.fire("Error", response.data.message, "error");
                }
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="relative">
                {Summary?.Image ? (
                    !imgError ? (
                        <img
                            className="w-full h-48 object-cover"
                            src={`http://localhost:3000/${Summary?.Image}`}
                            alt="Course"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <CiImageOn className="w-full h-48 text-gray-500" />
                    )
                ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <CiImageOn className="text-4xl text-gray-400" />
                    </div>
                )}
                <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
                    {Summary?.Category}
                </div>
            </div>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {Summary?.Title}
                </h2>
                <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                        {[...Array(5)].map((_, index) =>
                            index < Math.floor(Summary?.Rate || 0) ? (
                                <FaStar
                                    key={index}
                                    className="text-yellow-400"
                                />
                            ) : index < Math.ceil(Summary?.Rate || 0) ? (
                                <FaStarHalf
                                    key={index}
                                    className="text-yellow-400"
                                />
                            ) : (
                                <FaStar key={index} className="text-gray-300" />
                            )
                        )}
                    </div>
                    <span className="text-gray-600">
                        ({Summary?.Rate?.toFixed(1) || null})
                    </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        <FaUserGraduate className="mr-2" />
                        {Summary?.Students_count || 0} Enrolled
                    </div>
                    <div className="flex items-center">
                        <FaBookOpen className="mr-2" />
                        {Summary?.Pages_Count || 0} Pages
                    </div>
                    <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        {dayjs(Summary?.createdAt).format("MMM D, YYYY")}
                    </div>
                </div>
                {
                    <div className="text-2xl font-bold text-green-600 mb-4">
                        {Summary?.Price == 0 ? "Free" : `${Summary?.Price} DA `}
                    </div>
                }
                <div className="flex justify-between">
                    <Link
                        to={`/Teacher/Summaries/${Summary?.id}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-purple-700"
                    >
                        <FaEye className="mr-2" /> View
                    </Link>
                    <button
                        onClick={deleteSummary}
                        disabled={deleteLoading}
                        className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-red-600 disabled:opacity-50"
                    >
                        {deleteLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <FaTrashAlt className="mr-2" /> Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Teacher_Summaries_Card;
