import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../features/common/modalSlice'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'
import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import AddServiceModal from '../features/services/components/AddServiceModal'
import AddBookingModal from '../features/bookings/components/AddBookingModal'

const ModalLayout = () => {
    const { isOpen, bodyType, size, extraObject, title } = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const close = () => {
        dispatch(closeModal())
    }

    // A function to render the correct modal body based on the bodyType
    const renderModalBody = () => {
        switch (bodyType) {
            case MODAL_BODY_TYPES.CONFIRMATION:
                return <ConfirmationModalBody extraObject={extraObject} closeModal={close} />
            case MODAL_BODY_TYPES.ADD_NEW_SERVICE:
                return <AddServiceModal extraObject={extraObject} closeModal={close} />
            case MODAL_BODY_TYPES.DEFAULT:
            default:
                return <div></div>
        }
    }

    return (
        <>
            {/* Modal Structure */}
            <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
                <div className={`modal-box ${size === 'lg' ? 'max-w-5xl' : ''}`}>
                    {/* Close Button */}
                    <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={close}>
                        ✕
                    </button>
                    {/* Modal Title */}
                    <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>
                    {/* Modal Body */}
                    {renderModalBody()}
                </div>
            </div>
        </>
    )
}

export default ModalLayout
