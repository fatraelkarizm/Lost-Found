import React from 'react';
// Link from 'react-router-dom' is not available in this environment, using a simple anchor tag for demonstration.
// In a real application, you would use React Router's Link.
// import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, MapPin, Search, Compass } from 'lucide-react';

import { Link } from 'react-router-dom';


// Define types for component props to resolve 'implicitly has an any type' errors
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'outline' | 'ghost' | 'default'; // Explicitly define allowed variants
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

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// Placeholder for shadcn/ui components with explicit types
const Button: React.FC<ButtonProps> = ({ children, className = '', variant, ...props }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  if (variant === 'outline') {
    baseClasses += ' border border-input bg-background hover:bg-accent hover:text-accent-foreground';
  } else if (variant === 'ghost') {
    baseClasses += ' hover:bg-accent hover:text-accent-foreground';
  } else {
    baseClasses += ' bg-primary text-primary-foreground shadow hover:bg-primary/90';
  }
  return <button className={`${baseClasses} ${className}`} {...props}>{children}</button>;
};

const Input: React.FC<InputProps> = ({ className = '', type = 'text', ...props }) => {
  return <input type={type} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
};

const Label: React.FC<LabelProps> = ({ children, htmlFor, className = '', ...props }) => {
  return <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>{children}</label>;
};

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>{children}</div>;
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>;
};

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => {
  return <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>;
};

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '', ...props }) => {
  return <p className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</p>;
};

const CardContent: React.FC<CardContentProps> = ({ children, className = '', ...props }) => {
  return <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>;
};

const App = () => { // Renamed to App for default export
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordMismatch, setPasswordMismatch] = React.useState(false); // State for password mismatch message
  const [formData, setFormData] = React.useState({
    name: '', // Changed from firstName/lastName to name
    username: '', // Added username
    email: '',
    password: '',
    confirmPassword: '',
    city: '', // Added city
    province: '' // Added province
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true); // Set state to show mismatch message
      return;
    }
    setPasswordMismatch(false); // Clear mismatch message if passwords match
    console.log('Register attempt:', formData);
    // Here you would typically send data to your API
    // Example fetch call (replace with your actual API endpoint)
    /*
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        username: formData.username,
        password: formData.password,
        city: formData.city,
        province: formData.province,
        // photoprofile and isAdmin are not typically set during registration
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Registration successful:', data);
      // Handle successful registration, e.g., redirect to login
    })
    .catch(error => {
      console.error('Registration failed:', error);
      // Handle registration error
    });
    */
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center py-4"> {/* Reduced py-8 to py-4 */}
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Section - Form */}
        <div className="lg:w-1/2 flex flex-col justify-center p-4"> {/* Reduced padding */}
          {/* Logo Lost&Found */}
          <div className="mb-4"> {/* Reduced margin-bottom */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
              <Search className="h-6 w-6 text-[#1e40af] mr-2" />
              <span className="text-[#1e40af] font-bold text-xl">Lost&Found</span>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <Card className="rounded-xl shadow-lg border-none">
              <CardHeader className="text-center pb-2"> {/* Reduced padding-bottom */}
                <CardTitle className="text-2xl font-bold text-gray-900">Join our community</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Create your Lost&Found account to start helping others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3"> {/* Reduced space-y */}
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-1">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
                        placeholder="John Doe"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="username">Username (Optional)</Label>
                    <div className="relative mt-1">
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
                        placeholder="johndoe123"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative mt-1">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
                        placeholder="john@example.com"
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
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
                        placeholder="Create a strong password"
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

                  <div>
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
                        placeholder="Confirm your password"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordMismatch && (
                      <p className="text-red-500 text-sm mt-2">Passwords do not match!</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3"> {/* Reduced gap */}
                    <div>
                      <Label htmlFor="city">City (Optional)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
                          placeholder="Jakarta"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="province">Province (Optional)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="province"
                          name="province"
                          type="text"
                          value={formData.province}
                          onChange={handleInputChange}
                          className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
                          placeholder="DKI Jakarta"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="agree"
                      name="agree"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-[#1e40af] focus:ring-[#1d4ed8] border-gray-300 rounded"
                    />
                    <label htmlFor="agree" className="ml-2 block text-sm text-gray-900">
                      I agree to the{' '}
                      <a href="#" className="text-[#1e40af] hover:text-[#1d4ed8]">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#1e40af] hover:text-[#1d4ed8]">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-[#1e40af] hover:bg-[#1d4ed8] text-white rounded-md py-2 px-4 transition duration-300 ease-in-out shadow-md">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create account
                  </Button>
                </form>

                <div className="mt-4 text-center"> {/* Reduced mt-6 to mt-4 */}
                  <div className="relative mb-4"> {/* Reduced mb-6 to mb-4 */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center rounded-md py-2 px-4 transition duration-300 ease-in-out shadow-sm">
                      <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-2" />
                      Continue with Google
                    </Button>
                  </div>

                  <p className="mt-4 text-sm text-gray-600"> {/* Reduced mt-6 to mt-4 */}
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-[#1e40af] hover:text-[#1d4ed8]">
                      Sign in instead
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Section - Promotional Content */}
        <div className="lg:w-1/2 bg-[#0A192F] text-white p-8 flex flex-col justify-center relative overflow-hidden">
          {/* Background pattern/gradient */}
          <div className="absolute inset-0 z-0" style={{
            background: 'radial-gradient(circle at top left, rgba(30, 64, 175, 0.5), transparent 50%), radial-gradient(circle at bottom right, rgba(29, 78, 216, 0.5), transparent 50%)'
          }}></div>

          <div className="relative z-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Bergabunglah dengan Komunitas Lost&Found Kami
            </h1>
            <blockquote className="text-lg italic mb-8 text-gray-300 border-l-4 border-blue-400 pl-4">
              "Mendaftar di Lost&Found adalah langkah pertama untuk membantu orang lain menemukan barang berharga mereka. Komunitas yang luar biasa!"
            </blockquote>
            <div className="flex items-center justify-center lg:justify-start mb-6"> {/* Reduced mb-12 to mb-6 */}
              <img
                src="https://placehold.co/40x40/cccccc/ffffff?text=JD" // Placeholder for avatar
                alt="Jane Doe"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold text-white">Jane Doe</p>
                <p className="text-sm text-gray-300">Anggota Komunitas Lost&Found</p>
              </div>
            </div>

            <div className="mt-6"> {/* Reduced mt-12 to mt-6 */}
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Mulai Berkontribusi Hari Ini</h3>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <span className="text-gray-400 text-sm">Temukan dan bantu kembalikan barang hilang dengan mudah!</span>
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

export default App;
