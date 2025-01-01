import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useApiCall from '../../../hooks/useApiCall';
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';

function AddBookingModal({ closeModal }) {
    const { loading, errorMessage, setErrorMessage, apiCall } = useApiCall();

    // Zod validation schema for booking a session
    const bookingSchema = z.object({
        userId: z.string().nonempty('User ID is required!'),
        beautySalonId: z.string().nonempty('Beauty Salon ID is required!'),
        date: z.string().nonempty('Date is required!').refine(
            (value) => !isNaN(Date.parse(value)),
            'Invalid date format!'
        ),
        services: z
            .array(
                z.object({
                    serviceId: z.string().nonempty('Service ID is required!'),
                    quantity: z.coerce.number().min(1, 'Quantity must be at least 1!'),
                })
            )
            .min(1, 'At least one service is required!'),
    });

    const {
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            userId: '',
            beautySalonId: '',
            date: '',
            services: [{ serviceId: '', quantity: 1 }],
        },
    });

    const onSubmit = async (data) => {
        setErrorMessage('');
        try {
            // Call the API to add the booking
            const response = await apiCall('/api/bookings', 'POST', data);
            console.log('Booking Response:', response);

            if (response && response.id) {
                closeModal();
            } else {
                setErrorMessage('Failed to book a session!');
            }
        } catch (err) {
            setErrorMessage('An unexpected error occurred!');
        }
    };

    const handleCancel = () => {
        closeModal(); // Close the modal when user cancels or doesn't submit
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Book a New Session</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <InputText
                            type="text"
                            labelTitle="User ID"
                            setValue={setValue}
                            name="userId"
                            containerStyle="mt-4"
                            placeholder="Enter user ID"
                        />
                        {errors.userId && <ErrorText>{errors.userId.message}</ErrorText>}

                        <InputText
                            type="text"
                            labelTitle="Beauty Salon ID"
                            setValue={setValue}
                            name="beautySalonId"
                            containerStyle="mt-4"
                            placeholder="Enter beauty salon ID"
                        />
                        {errors.beautySalonId && <ErrorText>{errors.beautySalonId.message}</ErrorText>}

                        <InputText
                            type="datetime-local"
                            labelTitle="Booking Date"
                            setValue={setValue}
                            name="date"
                            containerStyle="mt-4"
                            placeholder="Enter booking date"
                        />
                        {errors.date && <ErrorText>{errors.date.message}</ErrorText>}

                        <div className="mt-4">
                            <h4 className="text-lg font-medium">Services</h4>
                            <InputText
                                type="text"
                                labelTitle="Service ID"
                                setValue={setValue}
                                name="services[0].serviceId"
                                containerStyle="mt-4"
                                placeholder="Enter service ID"
                            />
                            {errors.services?.[0]?.serviceId && (
                                <ErrorText>{errors.services[0].serviceId.message}</ErrorText>
                            )}

                            <InputText
                                type="number"
                                labelTitle="Quantity"
                                setValue={setValue}
                                name="services[0].quantity"
                                containerStyle="mt-4"
                                placeholder="Enter quantity"
                            />
                            {errors.services?.[0]?.quantity && (
                                <ErrorText>{errors.services[0].quantity.message}</ErrorText>
                            )}
                        </div>
                    </div>

                    {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
                    <button
                        type="submit"
                        className={`btn mt-2 w-full btn-primary ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        Book Session
                    </button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-block hover:text-primary hover:underline transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBookingModal;
