import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchBookings } from "../bookings/bookingsSlice";
import moment from "moment";
import { PDF_API } from "../../hooks/useApiCall";
import Datepicker from "react-tailwindcss-datepicker";

function BookedSessions() {
    const dispatch = useDispatch();
    const { bookings, isLoading } = useSelector((state) => state.bookings);

    const [searchText, setSearchText] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("name");
    const [isDownloading, setIsDownloading] = useState(false);


    const [dateValue, setDateValue] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    useEffect(() => {
        dispatch(searchBookings({}));
    }, [dispatch]);

    const applySearch = (searchText) => {
        if (!searchText) {
            dispatch(searchBookings({}));
        } else {
            dispatch(searchBookings({ [selectedFilter]: searchText }));
        }
    };

    const handleSearchTextChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        applySearch(value);
    };

    const downloadHandler = async () => {
        setIsDownloading(true);
        try {
            const response = await PDF_API({ url: process.env.REACT_APP_BASE_URL + "/bookings/pdf" });

            const file = new Blob([response.data], { type: "application/pdf" });
            const element = document.createElement("a");

            element.href = URL.createObjectURL(file);
            element.download = "bookings_report.pdf-" + Date.now() + ".pdf";
            document.body.appendChild(element);
            element.click();

            document.body.removeChild(element);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("Failed to download the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDatePickerValueChange = (newValue) => {
        setDateValue(newValue);
        dispatch(
            searchBookings({
                startDate: moment(newValue.startDate).valueOf(),
                endDate: moment(newValue.endDate).valueOf()
            })
        );
    }

    return (
        <div className="p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Booked Sessions</h1>
            </div>
            <Datepicker
                containerClassName="w-72 "
                value={dateValue}
                theme={"light"}
                inputClassName="input input-bordered w-72"
                popoverDirection={"down"}
                toggleClassName="invisible"
                onChange={handleDatePickerValueChange}
                showShortcuts={true}
                primaryColor={"white"}
            />

            <div className="flex justify-end gap-4 mb-6">
                {/* Search with Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        aria-label="Select filter"
                    >
                        <option value="name">Service</option>
                        <option value="minPrice">Min Price</option>
                        <option value="maxPrice">Max Price</option>
                    </select>

                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        placeholder={`Search by ${selectedFilter === "name" ? "service" : selectedFilter}`}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        aria-label="Search bookings"
                    />
                </div>

                {/* Download Button */}
                <button
                    className={`px-4 py-2 rounded-lg shadow transition ${isDownloading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} text-white`}
                    onClick={downloadHandler}
                    disabled={isDownloading}
                    aria-label={isDownloading ? "Downloading PDF report" : "Download PDF Report"}
                >
                    {isDownloading ? "Downloading..." : "Download PDF Report"}
                </button>
            </div>



            {/* Loading State */}
            {isLoading ? (
                <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                <th className="border px-4 py-2 text-left">Name</th>
                                <th className="border px-4 py-2 text-left">Email</th>
                                <th className="border px-4 py-2 text-left">Location</th>
                                <th className="border px-4 py-2 text-left">Service</th>
                                <th className="border px-4 py-2 text-left">Amount</th>
                                <th className="border px-4 py-2 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, k) => (
                                <tr
                                    key={k}
                                    className={k % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}
                                >
                                    <td className="border px-4 py-2">{booking.user.name}</td>
                                    <td className="border px-4 py-2">{booking.user.email}</td>
                                    <td className="border px-4 py-2">{booking.beautySalon.location}</td>
                                    <td className="border px-4 py-2">
                                        {booking.services.map(({ service }) => service.name).join(", ")}
                                    </td>
                                    <td className="border px-4 py-2">
                                        $
                                        {booking.services.reduce((sum, { service }) => sum + service.price, 0)}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {moment(booking.date).format("DD/MM/YYYY")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BookedSessions;
