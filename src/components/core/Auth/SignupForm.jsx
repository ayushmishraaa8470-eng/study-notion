import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUser, FaLock } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import Tab from "../../common/Tab";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // input change
  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // password validation
  const isPasswordValid = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>_]/.test(password)
    );
  };

  // submit
  const handleOnSubmit = (e) => {
    e.preventDefault();

    // 1️⃣ validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isPasswordValid(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number & special character"
      );
      return;
    }

    // 2️⃣ prepare signup data
    const signupPayload = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    };

    // 3️⃣ SAVE IN REDUX (for normal flow)
    dispatch(setSignupData(signupPayload));

    // 4️⃣ SAVE IN LOCALSTORAGE (VERY IMPORTANT for OTP page)
    localStorage.setItem("signupData", JSON.stringify(signupPayload));
    localStorage.setItem("signupEmail", email);

    // 5️⃣ SEND OTP ONLY
    dispatch(sendOtp(email, navigate));

    // ❌ DO NOT call signUp here
    // ❌ DO NOT navigate manually
  };

  const tabData = [
    { id: 1, tabName: "Student", type: ACCOUNT_TYPE.STUDENT },
    { id: 2, tabName: "Instructor", type: ACCOUNT_TYPE.INSTRUCTOR },
  ];

  return (
    <div>
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex gap-x-4">
          <label className="relative w-full">
            <p className="mb-1 text-sm text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <FaUser className="absolute left-3 top-[38px] text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="w-full rounded-md bg-richblack-800 p-3 pl-10 text-richblack-5"
            />
          </label>

          <label className="relative w-full">
            <p className="mb-1 text-sm text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <FaUser className="absolute left-3 top-[38px] text-gray-400" />
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="w-full rounded-md bg-richblack-800 p-3 pl-10 text-richblack-5"
            />
          </label>
        </div>

        <label className="relative">
          <p className="mb-1 text-sm text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <SiGmail className="absolute left-3 top-[38px] text-gray-400" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="w-full rounded-md bg-richblack-800 p-3 pl-10 text-richblack-5"
          />
        </label>

        <div className="flex gap-x-4">
          <label className="relative w-full">
            <p className="mb-1 text-sm text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <FaLock className="absolute left-3 top-[38px] text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter password"
              className="w-full rounded-md bg-richblack-800 p-3 pl-10 pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>
          </label>

          <label className="relative w-full">
            <p className="mb-1 text-sm text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <FaLock className="absolute left-3 top-[38px] text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm password"
              className="w-full rounded-md bg-richblack-800 p-3 pl-10 pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-md bg-yellow-50 py-2 font-semibold text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
