import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { getServicesContent, deleteService } from "./servicesSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";

const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewLeadModal = () => {
        dispatch(openModal({ title: "Add New Service", bodyType: MODAL_BODY_TYPES.ADD_NEW_SERVICE }));
    };

    return (
        <div className="inline-block float-right">
            <button
                className="btn px-6 btn-sm normal-case btn-primary"
                onClick={openAddNewLeadModal}
            >
                Add New
            </button>
        </div>
    );
};

function ServicesTable() {
    const { services, pagination } = useSelector((state) => ({
        services: state.services.servicesList,
        pagination: state.services.pagination,
    }));

    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;

    useEffect(() => {
        dispatch(getServicesContent({ page: currentPage, limit }));
    }, [dispatch, currentPage]);


    const handleDelete = async (serviceId) => {
        try {
            await dispatch(deleteService(serviceId));

            dispatch(getServicesContent({ page: currentPage, limit }));
        } catch (error) {
            console.error("Failed to delete service:", error);
        }
    };


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <TitleCard
                title="Current services"
                topMargin="mt-2"
                TopSideButtons={<TopSideButtons />}
            >
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!!services?.length ? (
                                services.map((service) => (
                                    <tr key={service.id}>
                                        <td>{service.name}</td>
                                        <td>${service.price}</td>
                                        <td>{service.durationInMin} min</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(service.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No services available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        className="btn btn-sm normal-case btn-secondary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {pagination?.totalPages || 1}
                    </span>
                    <button
                        className="btn btn-sm normal-case btn-secondary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination?.totalPages}
                    >
                        Next
                    </button>
                </div>
            </TitleCard>
        </>
    );
}

export default ServicesTable;
