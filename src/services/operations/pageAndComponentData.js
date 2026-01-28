import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = null;

  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId }
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch catalog page data");
    }

    result = response.data; // ✅ ALWAYS return response.data
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR:", error);
    toast.error(error?.response?.data?.message || "Something went wrong");
    result = { success: false };
  }

  toast.dismiss(toastId);
  return result;
};

export default getCatalogPageData;
