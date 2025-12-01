import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import { useContext, useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import InfoCard from "../../components/Cards/InfoCard";
import TaskListTable from "../../components/layouts/TaskListTable";
import { LuArrowRight } from "react-icons/lu";
import {
  IoMdCard,
  IoMdTime,
  IoMdCheckmarkCircle,
  IoMdAlert,
} from "react-icons/io";
import { addThousandsSeparator } from "../../utils/helper";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#8D52FF", "#00B8D8", "#7BCE00"];

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const prepareChartData = (data) => {
    console.log("Chart data received:", data); // DEBUG
    
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    // FIXED: Match backend keys (lowercase, no spaces)
    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.pending || 0 },
      { status: "In Progress", count: taskDistribution?.inprogress || 0 },
      { status: "Completed", count: taskDistribution?.completed || 0 },
    ];
    
    console.log("Pie chart data:", taskDistributionData); // DEBUG
    setPieChartData(taskDistributionData);

    // FIXED: Match backend keys (lowercase)
    const priorityLevelData = [
      { status: "Low", count: taskPriorityLevels?.low || 0 },
      { status: "Medium", count: taskPriorityLevels?.medium || 0 },
      { status: "High", count: taskPriorityLevels?.high || 0 },
    ];

    console.log("Bar chart data:", priorityLevelData); // DEBUG
    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      
      console.log("Dashboard API response:", response.data); // DEBUG

      if (response?.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      } else {
        setErrorMsg("No dashboard data available.");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setErrorMsg(
        error?.response?.data?.message ||
          "Error fetching dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {loading && (
        <div className="flex items-center justify-center py-10">
          <p>Loading dashboard...</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg my-4">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && (
        <>
          <div className="card my-5 p-4 bg-white rounded shadow">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Good Morning, {user?.name}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1.5">
                  {moment().format("dddd, Do MMM YYYY")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-6">
              <InfoCard
                icon={<IoMdCard className="text-primary text-3xl" />}
                label="Total Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.All || 0
                )}
                color="bg-primary"
              />
              <InfoCard
                icon={<IoMdTime className="text-yellow-500 text-3xl" />}
                label="Pending Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.pending || 0
                )}
                color="bg-yellow-500"
              />
              <InfoCard
                icon={<IoMdCheckmarkCircle className="text-green-500 text-3xl" />}
                label="Completed Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.completed || 0
                )}
                color="bg-green-500"
              />
              <InfoCard
                icon={<IoMdAlert className="text-red-500 text-3xl" />}
                label="Overdue Tasks"
                value={addThousandsSeparator(
                  dashboardData?.statistics?.overdueTasks || 0
                )}
                color="bg-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
            <div>
              <div className="card p-4 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium">Task Distribution</h5>
                </div>
                {pieChartData.length > 0 ? (
                  <CustomPieChart data={pieChartData} colors={COLORS} />
                ) : (
                  <div className="h-[325px] flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="card p-4 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium">Task Priority Levels</h5>
                </div>
                {barChartData.length > 0 ? (
                  <CustomBarChart data={barChartData} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="card p-4 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-gray-800">
                    Recent Tasks
                  </h5>
                  <button className="card-btn" onClick={onSeeMore}>
                    See All <LuArrowRight className="text-base" />
                  </button>
                </div>

                <TaskListTable tableData={dashboardData?.recentTasks || []} />
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;