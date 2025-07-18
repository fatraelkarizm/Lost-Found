import React, { useState, useEffect, type ChangeEvent } from "react";
import { Eye, EyeOff, Mail, Lock, Search, Compass, Loader2 } from "lucide-react";

// Google Sign-In types
declare global {
  interface Window {
    google: any;
  }
}
import { Link, useNavigate } from "react-router-dom";

// Import dari Redux
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '@/redux/store';
import {
  loginWithGoogle, // Import thunk Google login
  loginWithEmailPassword,
  setAuthToken} from '@/redux/auth/authSlice';

// Define types for component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "ghost" | "default";
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// Placeholder for shadcn/ui components
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  let baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  if (variant === "outline") {
    baseClasses +=
      " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  } else if (variant === "ghost") {
    baseClasses += " hover:bg-accent hover:text-accent-foreground";
  } else {
    baseClasses +=
      " bg-primary text-primary-foreground shadow hover:bg-primary/90";
  }
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input: React.FC<InputProps> = ({
  className = "",
  type = "text",
  ...props
}) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  className = "",
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  );
};

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

const Login = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector((state: RootState) => state.auth.status);
  const authError = useSelector((state: RootState) => state.auth.error);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const authToken = useSelector((state: RootState) => state.auth.token);

  // State for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State for Google Sign-In loading
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        // Get Google Client ID from environment or use a fallback
        const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
        console.log("Google Client ID being used:", googleClientId); // Tambahkan ini
        
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    // Load Google Sign-In script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  // Effect untuk memuat token dari localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      dispatch(setAuthToken(storedToken));
    }
  }, [dispatch]);

  // Effect untuk redirect setelah login berhasil
  useEffect(() => {
    if (isAuthenticated && authStatus === 'succeeded' && authToken) {
      navigate('/dashboard'); // Ganti dengan path dashboard Anda
    }
  }, [isAuthenticated, authStatus, authToken, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginWithEmailPassword(formData));
  };

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Handle Google Sign-In callback
  const handleGoogleCallback = async (response: any) => {
    try {
      setIsGoogleLoading(true);
      const id_token = response.credential;
      
      // Dispatch the loginWithGoogle thunk with the id_token
      const result = await dispatch(loginWithGoogle(id_token));
      
      if (loginWithGoogle.fulfilled.match(result)) {
        // Login successful - navigation will be handled by useEffect
        console.log('Google login successful');
      } else {
        // Login failed
        console.error('Google login failed:', result.payload);
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      // Trigger Google Sign-In popup
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to one-tap if popup is not displayed
          console.log('Google Sign-In popup not displayed, trying alternative method');
          
          // Alternative: render Google Sign-In button
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              width: '300px',
              text: 'signin_with',
              shape: 'rectangular',
            }
          );
        }
      });
    } else {
      alert("Google Sign-In not loaded. Please try again.");
    }
  };

  // Fungsi handleInputChange
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Section - Form */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8">
          {/* Logo Lost&Found */}
          <div className="mb-12">
            <div className="flex items-center">
              <Link to={"/"} className="flex items-center">
                <Search className="h-6 w-6 text-[#1e40af] mr-2" />
                <span className="text-[#1e40af] font-bold text-xl">
                  Lost&Found
                </span>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <Card className="rounded-xl shadow-lg border-none">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Welcome Back!
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to access your dashboard and continue optimizing your
                  Lost&Found experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
                        placeholder="Enter your email"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10 pr-10"
                        placeholder="Enter your password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <a
                      href="#"
                      className="font-medium text-[#1e40af] hover:text-[#1d4ed8]"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-[#0A192F] hover:bg-[#1d4ed8] text-white rounded-md py-2 px-4 transition duration-300 ease-in-out shadow-md"
                    disabled={authStatus === 'loading'}
                  >
                    {authStatus === 'loading' ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center rounded-md py-2 px-4 transition duration-300 ease-in-out shadow-sm"
                      onClick={handleGoogleLogin}
                      disabled={authStatus === 'loading' || isGoogleLoading}
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <img
                          src="https://www.google.com/favicon.ico"
                          alt="Google icon"
                          className="w-5 h-5 mr-2"
                        />
                      )}
                      Continue with Google
                    </Button>
                    
                    {/* Hidden div for Google Sign-In button fallback */}
                    <div id="google-signin-button" className="hidden"></div>
                  </div>

                  <p className="mt-6 text-sm text-gray-600">
                    Don't have an Account?{" "}
                    <a
                      href="/register"
                      className="font-medium text-[#1e40af] hover:text-[#1d4ed8]"
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right Section - Promotional Content */}
        <div className="lg:w-1/2 bg-[#0A192F] text-white p-8 flex flex-col justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(30, 64, 175, 0.5), transparent 50%), radial-gradient(circle at bottom right, rgba(29, 78, 216, 0.5), transparent 50%)",
            }}
          ></div>

          <div className="relative z-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Temukan Kembali Barang Berharga Anda dengan Mudah
            </h1>
            <blockquote className="text-lg italic mb-8 text-gray-300 border-l-4 border-blue-400 pl-4">
              "Lost&Found telah sepenuhnya mengubah cara saya menemukan barang
              hilang. Ini cepat, efisien, dan memastikan barang-barang saya
              selalu kembali dengan aman."
            </blockquote>
            <div className="flex items-center justify-center lg:justify-start mb-12">
              <img
                src="https://placehold.co/40x40/cccccc/ffffff?text=MC"
                alt="Michael Carter"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold text-white">Michael Carter</p>
                <p className="text-sm text-gray-300">
                  Pengguna Setia Lost&Found
                </p>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Bergabunglah dengan Komunitas Kami
              </h3>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <span className="text-gray-400 text-sm">
                  Aplikasi ini membantu ribuan pengguna setiap hari!
                </span>
                <Compass className="h-6 w-6 text-white" />
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;