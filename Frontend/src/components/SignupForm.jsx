import AuthContext from "@/context/auth/AuthContext";
import React, {useContext} from "react";
import {useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {Label} from "./ui/label";
import {Input} from "./ui/input";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "./ui/button";
import {Link, useNavigate} from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const {signup} = authContext;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    //Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    //Email Validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    //Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    //Confirm Password Validation
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      await signup(formData);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setIsLoading(false);
    }
    navigate("/");
  };

  const getPasswordStrength = () => {
    const {password} = formData;
    if (!password) return {strength: 0, label: ""};

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const labels = ["Weak", "Fair", "Good", "Strong"];
    return {
      strength,
      label: strength > 0 ? labels[strength - 1] : "",
    };
  };
  const passwordStrength = getPasswordStrength();
  const strengthColors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  return (
    <div className='container flex items-center justify-center py-6 px-4'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Create an account
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='John Doe'
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='name'>Email</Label>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='name'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  name='password'
                  placeholder='********'
                  value={formData.password}
                  onChange={handleChange}
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700'>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-sm text-red-500'>{errors.password}</p>
              )}

              {formData.password && (
                <div className='space-y-1'>
                  <div className='flex gap-1 h-1'>
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-full flex-1 rounded-full ${
                          index < passwordStrength.strength
                            ? strengthColors[passwordStrength.strength - 1]
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className='text-xs text-gray-500'>
                    {passwordStrength.label &&
                      `Password strength: ${passwordStrength.label}`}
                  </p>
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='name'>Confirm Password</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? "text" : "password"}
                  name='confirmPassword'
                  placeholder='********'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700'>
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm text-red-500'>{errors.confirmPassword}</p>
              )}
            </div>
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full cursor-pointer'>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-center text-gray-600'>
            Already have an account?{" "}
            <Link
              to='/login'
              className='text-primary font-medium hover:underline'>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupForm;
