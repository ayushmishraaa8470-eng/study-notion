import { toast } from "react-hot-toast";
import { setLoading, setToken, setSignupData } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

// ================= SEND OTP =================
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, { email });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      localStorage.setItem("signupEmail", email);

      // ✅ ALWAYS GO TO VERIFY PAGE
      navigate("/verify-email");
    } catch (error) {
      console.log("SEND OTP ERROR:", error);
      toast.error(error?.response?.data?.message || "Could not send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ================= SIGN UP (OTP VERIFY HAPPENS HERE) =================
export function signUp(formData, otp, navigate) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const response = await apiConnector("POST", SIGNUP_API, {
        ...formData,
        otp,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Signup successful");

      // 🧹 CLEANUP
      localStorage.removeItem("signupData");
      localStorage.removeItem("signupEmail");
      dispatch(setSignupData(null));

      // ✅ BACKEND FLOW: LOGIN AFTER SIGNUP
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP ERROR:", error);
      toast.error(error?.response?.data?.message || "OTP Verification Failed");
    }

    dispatch(setLoading(false));
  };
}

// ================= LOGIN =================
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");

      dispatch(setToken(response.data.token));

      const userImage = response.data.user.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}`;

      dispatch(
        setUser({
          ...response.data.user,
          image: userImage,
        })
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      toast.error(error?.response?.data?.message || "Login Failed");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// ================= LOGOUT =================
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

// ================= RESET PASSWORD =================
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, { email });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET TOKEN ERROR:", error);
      toast.error(error?.response?.data?.message || "Failed to send reset email");
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password reset successful");
    } catch (error) {
      console.log("RESET PASSWORD ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Unable to reset password"
      );
    }
    dispatch(setLoading(false));
  };
}
