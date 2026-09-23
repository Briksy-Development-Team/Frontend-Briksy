import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apple from '../../../assets/login/apple.svg';
import google from '../../../assets/login/google.svg';
import LogoM from '../../../assets/logo/logomobile.svg';
import {
  type Screen,
  ScreenWrapper,
  Field,
  Btn,
  AuthHeader,
} from '../shared';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';

type LoginScreenProps = {
  go: (s: Screen) => void;
};

export const LoginScreen = ({ go }: LoginScreenProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    const validationErrors = {
      email: !email.trim() ? "Email is required" : "",
      password: !password ? "Password is required" : "",
    };

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);

      setErrors({
        email: "",
        password: "",
      });

      await login({
        email: email.trim(),
        password,
      });

      navigate("/", { replace: true });
    } catch (error) {
      setErrors({ email: "", password: "We couldn't sign you in with those details." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper className="w-full lg:px-[3rem] py-[2.75rem] h-screen lg:h-auto flex flex-col   lg:gap-[1.5rem] mx-auto text-[primary-brown]">
      <img
        src={LogoM}
        alt=""
        className="block lg:hidden h-[4.1925rem] mx-auto w-[3.0556rem]"
      />
      <AuthHeader title="Log in" subtitle="Welcome back — good to see you." />

      <div className="flex flex-col gap-[0.75rem]">
        <Field
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);

            setErrors((previous) => ({
              ...previous,
              email: "",
            }));
          }}
          error={errors.email}
        />

        <Field
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);

            setErrors((previous) => ({
              ...previous,
              password: "",
            }));
          }}
          error={errors.password}
        >
          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 text-[#A89F95] hover:text-[primary-brown] transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-[1.25rem] h-[1.25rem]" />
            ) : (
              <Eye className="w-[1.25rem] h-[1.25rem]" />
            )}
          </button>
        </Field>
      </div>

      <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-between mt-[-0.25rem]">
        <label className="flex items-center gap-[0.5rem]  w-full text-[0.875rem] text-primary-brown cursor-pointer select-none">
          <input
            type="checkbox"
            className="accent-primary-brown rounded  w-[1rem] h-[1rem]"
          />
          Keep me signed in
        </label>

        <button
          type="button"
          onClick={() => go("forgot")}
          className="text-[0.75rem] text-[primary-light-brown] text-nowrap  text-end hover:text-[#3D2C1E] underline transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Btn onClick={submit}>{isLoading ? "Logging in..." : "Login"}</Btn>

      <p className="text-primary-light-brown text-sm   text-center">
        Or continue with
      </p>

      <div className="flex mt-2 gap-[0.75rem]">
        <button
          type="button"
          className="flex-1 flex items-center justify-center border border-slate-300 rounded-[56.25rem] py-[0.625rem]  "
        >
          <img src={apple} className="h-[1.25rem] w-[1.25rem]" alt="Apple" />
        </button>

        <button
          type="button"
          className="flex-1 flex items-center justify-center border border-slate-300 rounded-[56.25rem] py-[0.625rem]  "
        >
          <img src={google} className="h-[1.25rem] w-[1.25rem]" alt="Google" />
        </button>
      </div>

      <div className="flex text-sm text-primary-light-brown lg:hidden justify-center gap-x-2 mt-20 w-full">
        <p>Not a member yet?</p>
        <Link to="/register" className="underline underline-offset-2 transition hover:text-white">Create an account</Link>
      </div>



    </ScreenWrapper>
  );
};
