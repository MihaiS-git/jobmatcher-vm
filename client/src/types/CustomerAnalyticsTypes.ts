export type MonthlySpendingDTO = {
  year: number;
  month: number;
  total: string;
};

export type ProjectStatsDTO = {
  active: number;
  completed: number;
};

export type TopFreelancerDTO = {
  freelancerName: string;
  totalEarned: string;
};
