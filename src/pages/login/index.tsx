import React from "react";
// Link from 'react-router-dom' is not available in this environment, using a simple anchor tag for demonstration.
// In a real application, you would use React Router's Link.
// import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Search, Compass } from "lucide-react"; // Updated icons for Lost&Found context
import { Link } from "react-router-dom";

// Define types for component props to resolve 'implicitly has an any type' errors
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "ghost" | "default"; // Explicitly define allowed variants
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

// Placeholder for shadcn/ui components with explicit types
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant,
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

const App = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    // Added type for event
    e.preventDefault();
    console.log("Login attempt:", formData);
    // Di sini Anda biasanya akan menangani logika login, misalnya, mengirim data ke backend
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Added type for event
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center">
      {" "}
      {/* Centering the content */}
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">
        {" "}
        {/* Added max-w-5xl, w-full, shadow, rounded, and overflow-hidden */}
        {/* Left Section - Form */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8">
          {/* Logo Lost&Found */}
          <div className="mb-12">
            <div className="flex items-center">
              <Link to={"/"} className="flex items-center">
                <Search className="h-6 w-6 text-[#1e40af] mr-2" />{" "}
                {/* Icon for Lost&Found */}
                <span className="text-[#1e40af] font-bold text-xl">
                  Lost&Found
                </span>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            {/* Using Card components directly */}
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
                        className="rounded-md border border-gray-300 focus:border-[#1e40af] focus:ring-[#1e40af] pl-10"
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

                  <Button
                    type="submit"
                    className="w-full bg-[#0A192F] hover:bg-[#1d4ed8] text-white rounded-md py-2 px-4 transition duration-300 ease-in-out shadow-md"
                  >
                    Sign In
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
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google icon"
                        className="w-5 h-5 mr-2"
                      />
                      Continue with Google
                    </Button>
                  </div>

                  <p className="mt-6 text-sm text-gray-600">
                    Don't have an Account?{" "}
                    {/* Using an anchor tag instead of Link for broader compatibility */}
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
          {/* Background pattern/gradient - Meniru gambar */}
          <div
            className="absolute inset-0 z-0"
            style={{
              // Enhanced radial gradient for a more prominent effect
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
                src="https://placehold.co/40x40/cccccc/ffffff?text=MC" // Placeholder for avatar, ganti ini nanti
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
                {/* Placeholder for community logos/icons */}
                <span className="text-gray-400 text-sm">
                  Aplikasi ini membantu ribuan pengguna setiap hari!
                </span>
                {/* You could add actual icons/logos here if needed */}
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
