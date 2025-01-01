import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useApiCall from '../../../hooks/useApiCall';
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { useDispatch } from 'react-redux';
import { addService } from '../servicesSlice';

function AddServiceModal({ closeModal }) {
    const { errorMessage, setErrorMessage, apiCall } = useApiCall();
    const [salons, setSalons] = useState([]);
    const dispatch = useDispatch()

    // Zod validation schema for adding a service
    const serviceSchema = z.object({
        name: z.string().min(3, 'Service name must be at least 3 characters long!'),
        price: z.coerce.number().min(0, 'Price must be a positive number!'),
        durationInMin: z.coerce.number().min(1, 'Duration must be at least 1 minute!'),
        salonId: z.string().min(1, 'Salon ID is required!'), // salonId must be a non-empty string
    });

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
            price: 0,
            durationInMin: 0,
            salonId: '',
        },
    });

    const fetchSalons = useCallback(async () => {
        try {
            const response = await apiCall('/beautysalons');
            if (response && Array.isArray(response)) {
                setSalons(response);
            } else {
                setErrorMessage('Failed to fetch salons!');
            }
        } catch (error) {
            console.error('Error fetching salons:', error);
            setErrorMessage('Failed to fetch salons!');
        }
    }, [apiCall, setErrorMessage]);

    useEffect(() => {
        fetchSalons();
    }, []);

    const onSubmit = async (data) => {
        setErrorMessage('');
        try {
            await dispatch(addService(data)).unwrap();
            closeModal();
        } catch (err) {
            setErrorMessage(err || 'An unexpected error occurred!');
        }
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Add Service</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <InputText
                            type="text"
                            labelTitle="Service Name"
                            setValue={setValue}
                            name="name"
                            containerStyle="mt-4"
                            placeholder="Enter service name"
                        />
                        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}

                        <InputText
                            type="number"
                            labelTitle="Price"
                            setValue={setValue}
                            name="price"
                            containerStyle="mt-4"
                            placeholder="Enter service price"
                        />
                        {errors.price && <ErrorText>{errors.price.message}</ErrorText>}

                        <InputText
                            type="number"
                            labelTitle="Duration (in minutes)"
                            setValue={setValue}
                            name="durationInMin"
                            containerStyle="mt-4"
                            placeholder="Enter duration in minutes"
                        />
                        {errors.durationInMin && <ErrorText>{errors.durationInMin.message}</ErrorText>}

                        <div className="mt-4">
                            <label htmlFor="salonId" className="block text-sm font-semibold">Salon</label>
                            <select
                                id="salonId"
                                name="salonId"
                                value={watch('salonId')}
                                onChange={(e) => setValue('salonId', e.target.value)} // Using onChange to handle the selection
                                className="mt-2 block w-full p-2 border rounded"
                            >
                                <option value="">Select a salon</option>
                                {salons.map((salon) => (
                                    <option key={salon.id} value={salon.id}>
                                        {salon.name} - {salon.location}
                                    </option>
                                ))}
                            </select>
                            {errors.salonId && <ErrorText>{errors.salonId.message}</ErrorText>}
                        </div>
                    </div>

                    {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
                    <button
                        type="submit"
                        className={`btn mt-2 w-full btn-primary`}
                    >
                        Add Service
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

export default AddServiceModal;
