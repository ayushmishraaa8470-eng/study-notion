import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { sendOtp, signUp } from "../services/operations/authAPI";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔑 Signup data MUST come from localStorage
  const signupData = JSON.parse(localStorage.getItem("signupData"));
  const email = signupData?.email || localStorage.getItem("signupEmail");

  // 🔒 Page protection
  useEffect(() => {
    if (!signupData || !email) {
      toast.error("Please signup again");
      navigate("/signup");
    }
  }, [signupData, email, navigate]);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter valid 6 digit OTP");
      return;
    }

    // ✅ FINAL STEP: OTP VERIFY + SIGNUP
    dispatch(signUp(signupData, otp, navigate));
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem]">
            Verify Email
          </h1>

          <p className="text-[1.125rem] my-4 text-richblack-100">
            A verification code has been sent to <br />
            <span className="font-medium text-richblack-5">{email}</span>
          </p>

          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="text"
              shouldAutoFocus
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  className="w-[48px] lg:w-[60px] bg-richblack-800 rounded-md text-richblack-5 aspect-square text-center focus:outline focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />


            <button
              type="submit"
              className="w-full bg-yellow-50 py-3 rounded-md mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link
              to="/signup"
              className="flex items-center gap-x-2 text-richblack-5"
            >
              <BiArrowBack /> Back To Signup
            </Link>

            <button
              className="flex items-center text-blue-100 gap-x-2"
              onClick={() => email && dispatch(sendOtp(email, navigate))}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
