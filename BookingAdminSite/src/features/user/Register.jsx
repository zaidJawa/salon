import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import useApiCall from '../../hooks/useApiCall';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

function Register() {
    const { loading, errorMessage, setErrorMessage, apiCall } = useApiCall();
    const navigate = useNavigate();

    const registerSchema = z.object({
        name: z.string().min(1, 'Name is required!'),
        email: z.string().email('Please enter a valid email address!'),
        password: z.string().min(6, 'Password must be at least 6 characters!'),
        phone: z.string().regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number!'),
    });

    const {
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
        },
    });

    const onSubmit = async (data) => {
        setErrorMessage('');
        try {
            const response = await apiCall('/auth/register', 'POST', data);
            if (response.user.email !== undefined) {
                localStorage.setItem('token', "response.accessToken");
                navigate('/app/services');
            } else {
                setErrorMessage('Registration failed!');
            }
        } catch (err) {
            setErrorMessage('An unexpected error occurred!');
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div>
                        <LandingIntro />
                    </div>
                    <div className="py-24 px-10">
                        <h2 className="text-2xl font-semibold mb-2 text-center">Register</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <InputText
                                    labelTitle="Name"
                                    name="name"
                                    containerStyle="mt-4"
                                    setValue={setValue}
                                    placeholder="Enter your name"
                                />
                                {errors.name && <ErrorText>{errors.name.message}</ErrorText>}

                                <InputText
                                    type="email"
                                    labelTitle="Email Id"
                                    name="email"
                                    containerStyle="mt-4"
                                    setValue={setValue}
                                    placeholder="Enter your email"
                                />
                                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

                                <InputText
                                    type="password"
                                    labelTitle="Password"
                                    name="password"
                                    containerStyle="mt-4"
                                    setValue={setValue}
                                    placeholder="Enter your password"
                                />
                                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}

                                <InputText
                                    labelTitle="Phone"
                                    name="phone"
                                    containerStyle="mt-4"
                                    setValue={setValue}
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
                            </div>

                            {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
                            <button
                                type="submit"
                                className={`btn mt-2 w-full btn-primary ${loading ? 'loading' : ''}`}
                                disabled={loading}  // Disable submit if loading
                            >
                                Register
                            </button>

                            <div className="text-center mt-4">
                                Already have an account?{' '}
                                <Link to="/login">
                                    <span className="inline-block hover:text-primary hover:underline transition duration-200">
                                        Login
                                    </span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
