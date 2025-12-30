import {
  useGetMonthlySpendingQuery,
  useGetProjectStatsQuery,
  useGetTopFreelancersQuery,
} from "@/features/analytics/customerAnalyticsApi";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../LoadingSpinner";
import FeedbackMessage from "../FeedbackMessage";
import useCustomerId from "@/hooks/useCustomerId";
import { parseApiError } from "@/utils/parseApiError";

const CustomerAnalytics = () => {
  const [apiError, setApiError] = useState<string>("");

  const {
    customerId,
    isLoading: isLoadingCustomerId,
    error: customerIdError,
  } = useCustomerId();

  useEffect(() => {
    if (customerIdError) {
      setApiError(parseApiError(customerIdError));
    }
  }, [customerIdError]);

  const { data: monthlySpending, isLoading: isLoadingMonthlySpending } =
    useGetMonthlySpendingQuery(customerId!, {
      skip: !customerId || isLoadingCustomerId || !!customerIdError,
    });
  const { data: projectStats, isLoading: isLoadingProjectStats } =
    useGetProjectStatsQuery(customerId!, {
      skip: !customerId || isLoadingCustomerId || !!customerIdError,
    });
  const { data: topFreelancers, isLoading: isLoadingTopFreelancers } =
    useGetTopFreelancersQuery(customerId!, {
      skip: !customerId || isLoadingCustomerId || !!customerIdError,
    });

  if (!customerId) {
    return <LoadingSpinner fullScreen={true} size={36} />;
  }

  return (
    <div className="p-4 m-4 xl:p-16 xl:m-16 grid grid-cols-1 xl:grid-cols-2 gap-2 xl:gap-16 bg-gray-200 dark:bg-gray-800 dark:text-gray-500 w-full">
      {isLoadingCustomerId && <LoadingSpinner fullScreen={true} size={36} />}
      {customerIdError && (
        <FeedbackMessage
          type="error"
          message={parseApiError(customerIdError)}
        />
      )}
      {apiError && <FeedbackMessage type="error" message={apiError} />}
      {/* Monthly Spending */}
      {isLoadingMonthlySpending ? (
        <LoadingSpinner fullScreen={false} size={24} />
      ) : (
        <>
          {monthlySpending && (
            <div className="overflow-x-auto xl:overflow-hidden text-xs lg:text-base">
              <h2 className="mb-8">Monthly Spending</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  width={600}
                  height={300}
                  data={monthlySpending.map((ms) => ({
                    name: `${ms.year}-${ms.month}`,
                    total: ms.total,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {isLoadingProjectStats ? (
        <LoadingSpinner fullScreen={false} size={24} />
      ) : (
        <>
          {/* Project Stats */}
          {projectStats && (
            <div className="overflow-x-auto xl:overflow-hidden text-xs lg:text-base">
              <h2 className="mb-8">Project Stats</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart width={400} height={300}>
                  <Pie
                    data={[
                      { name: "Active", value: projectStats.active },
                      { name: "Completed", value: projectStats.completed },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    <Cell fill="#0088FE" />
                    <Cell fill="#00C49F" />
                    <Cell fill="#FF8042" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {isLoadingTopFreelancers ? (
        <LoadingSpinner fullScreen={false} size={24} />
      ) : (
        <>
          {/* Top Freelancers */}
          {topFreelancers && (
            <div className="overflow-x-auto xl:overflow-hidden text-xs lg:text-base">
              <h2 className="mb-8">Top Freelancers</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart width={600} height={300} data={topFreelancers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="freelancerName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalEarned" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerAnalytics;
