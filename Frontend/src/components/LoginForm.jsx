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

const LoginForm = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const {login} = authContext;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    //Email Validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    //Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
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
      await login(formData, navigate);
      setFormData({
        email: "",
        password: "",
      });
      setIsLoading(false);
    }
    // navigate("/");
  };

  return (
    <div className='container flex items-center justify-center py-6 px-4'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Welcome back
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
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
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <a href='' className='text-sm text-primary hover:underline'>
                  Forgot password?
                </a>
              </div>
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
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full cursor-pointer'>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-center text-gray-600'>
            Don't have an account?{" "}
            <Link
              to='/signup'
              className='text-primary font-medium hover:underline'>
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
