import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import useApiCall from '../../hooks/useApiCall';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

function Login() {
    const { loading, errorMessage, setErrorMessage, apiCall } = useApiCall();
    const navigate = useNavigate();

    const loginSchema = z.object({
        email: z.string().email('Please enter a valid email address!'),
        password: z.string().min(6, 'Password must be at least 6 characters!'),
    });

    const {
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setErrorMessage('');
        try {
            // Call the API to authenticate the user
            const response = await apiCall('/auth/login', 'POST', data);

            if (response.accessToken) {
                localStorage.setItem('token', "response.accessToken");
                navigate('/app/services');
            } else {
                setErrorMessage('Invalid email or password!');
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
                        <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <InputText
                                    type="email"
                                    labelTitle="Email Id"
                                    setValue={setValue}  // Pass setValue to child
                                    name="email"
                                    containerStyle="mt-4"
                                    placeholder="Enter your email"
                                />
                                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

                                <InputText
                                    type="password"
                                    labelTitle="Password"
                                    setValue={setValue}  // Pass setValue to child
                                    name="password"
                                    containerStyle="mt-4"
                                    placeholder="Enter your password"
                                />
                                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
                            </div>

                            {/* <div className="text-right text-primary">
                                <Link to="/forgot-password">
                                    <span className="text-sm inline-block hover:text-primary hover:underline transition duration-200">
                                        Forgot Password?
                                    </span>
                                </Link>
                            </div> */}

                            {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
                            <button
                                type="submit"
                                className={`btn mt-2 w-full btn-primary ${loading ? 'loading' : ''}`}
                                disabled={loading}  // Disable submit if form is not dirty or loading
                            >
                                Login
                            </button>

                            <div className="text-center mt-4">
                                Don't have an account yet?
                                <Link to="/register">
                                    <span className="inline-block hover:text-primary hover:underline transition duration-200">
                                        Register
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

export default Login;
