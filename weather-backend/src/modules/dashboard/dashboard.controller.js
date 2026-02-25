import { getUserDashboard } from "./dashboard.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await getUserDashboard(req.user._id);

    res.status(200).json({
      success: true,
      cities: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};