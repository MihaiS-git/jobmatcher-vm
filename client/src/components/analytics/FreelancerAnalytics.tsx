import {
  useGetFreelancerJobCompletionQuery,
  useGetFreelancerMonthlyEarningsQuery,
  useGetFreelancerSkillEarningsQuery,
  useGetFreelancerTopClientsQuery,
} from "@/features/analytics/freelancerAnalyticsApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../LoadingSpinner";
import useFreelancerId from "@/hooks/useFreelancerId";
import { useEffect, useState } from "react";
import { parseApiError } from "@/utils/parseApiError";
import FeedbackMessage from "../FeedbackMessage";

const FreelancerAnalytics = () => {
  const [apiError, setApiError] = useState<string>("");

  const {
    freelancerId,
    isLoading: isLoadingFreelancerId,
    error: freelancerIdError,
  } = useFreelancerId();

  useEffect(() => {
    if (freelancerIdError) {
      setApiError(parseApiError(freelancerIdError));
    }
  }, [freelancerIdError]);

  const {
    data: monthlyEarnings,
    isLoading: isLoadingMonthlyEarnings,
    error: monthlyEarningsError,
  } = useGetFreelancerMonthlyEarningsQuery(freelancerId!, {
    skip: !freelancerId || isLoadingFreelancerId || !!freelancerIdError,
  });
  const {
    data: jobCompletion,
    isLoading: isLoadingJobCompletion,
    error: jobCompletionError,
  } = useGetFreelancerJobCompletionQuery(freelancerId!, {
    skip: !freelancerId || isLoadingFreelancerId || !!freelancerIdError,
  });
  const {
    data: topClients,
    isLoading: isLoadingTopClients,
    error: topClientsError,
  } = useGetFreelancerTopClientsQuery(freelancerId!, {
    skip: !freelancerId || isLoadingFreelancerId || !!freelancerIdError,
  });
  const {
    data: skillEarnings,
    isLoading: isLoadingSkillEarnings,
    error: skillEarningsError,
  } = useGetFreelancerSkillEarningsQuery(freelancerId!, {
    skip: !freelancerId || isLoadingFreelancerId || !!freelancerIdError,
  });

  if (!freelancerId) {
    return <LoadingSpinner fullScreen={true} size={36} />;
  }

  return (
    <div className="p-4 m-4 xl:p-16 xl:m-16 grid grid-cols-1 xl:grid-cols-2 gap-2 xl:gap-16 bg-gray-200 dark:bg-gray-800 dark:text-gray-500 w-full">
      {isLoadingFreelancerId && <LoadingSpinner fullScreen={true} size={36} />}
      {freelancerIdError && <FeedbackMessage type="error" message={apiError} />}

      {isLoadingMonthlyEarnings ? (
        <LoadingSpinner fullScreen={false} size={24} />
      ) : (
        <>
          {monthlyEarningsError ? (
            <div className="text-red-600 font-semibold">
              {parseApiError(monthlyEarningsError)}
            </div>
          ) : (
            <>
              {monthlyEarnings && (
                <div className="overflow-x-auto xl:overflow-hidden text-xs lg:text-base">
                  <h2 className="mb-8">Monthly Earnings</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      width={600}
                      height={300}
                      data={monthlyEarnings.map((me) => ({
                        name: `${me.year}-${me.month}`,
                        total: me.total,
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
        </>
      )}

      {isLoadingJobCompletion ? (
        <LoadingSpinner fullScreen={false} size={24} />
      ) : (
        <>
          {jobCompletionError ? (
            <div className="text-red-600 font-semibold">
              {parseApiError(jobCompletionError)}
            </div>
          ) : (
            <>
              {jobCompletion && (
                <div className="overflow-x-auto xl:overflow-hidden">
                  <h2 className="mb-8">Job Completion Rate</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={[
                          { name: "Completed", value: jobCompletion.completed },
                          {
                            name: "Rejected",
                            value:
                              jobCompletion.total - jobCompletion.completed,
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </>
      )}

      {isLoadingTopClients ? (
        <LoadingSpinner fullScreen={false} size={24} />
      ) : (
        <>
          {topClientsError ? (
            <div className="text-red-600 font-semibold">
              {parseApiError(topClientsError)}
            </div>
          ) : (
            <>
              {topClients && (
                <div className="overflow-x-auto xl:overflow-hidden">
                  <h2 className="mb-8">Top Clients</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart width={600} height={300} data={topClients}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="clientName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalSpent" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </>
      )}

      {isLoadingSkillEarnings ? (
        <LoadingSpinner fullScreen={false} size={24} />
      ) : (
        <>
          {skillEarningsError ? (
            <div className="text-red-600 font-semibold">
              {parseApiError(skillEarningsError)}
            </div>
          ) : (
            <>
              {skillEarnings && (
                <div className="overflow-x-auto xl:overflow-hidden">
                  <h2 className="mb-8">Earnings per Skill</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart width={600} height={300} data={skillEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skillName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="earnings" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FreelancerAnalytics;
