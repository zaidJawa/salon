import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { getServicesContent } from "./servicesSlice";
import { MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil';

const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewLeadModal = () => {
        dispatch(openModal({ title: "Add New Service", bodyType: MODAL_BODY_TYPES.ADD_NEW_SERVICE }));
    };

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewLeadModal()}>Add New</button>
        </div>
    );
};

function BookingTable() {
    const { services } = useSelector(state => state.services);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getServicesContent());
    }, [dispatch]);

    return (
        <>
            <TitleCard title="Current services" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Duration</th>

                            </tr>
                        </thead>
                        <tbody>
                            {services.length && services?.map((service) => (
                                <tr key={service.id}>
                                    <td>{service.name}</td>
                                    <td>${service.price}</td>
                                    <td>{service.durationInMin} min</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    );
}

export default BookingTable;
