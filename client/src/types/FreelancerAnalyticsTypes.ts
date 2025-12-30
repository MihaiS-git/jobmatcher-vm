export type MonthlyEarningsDTO = {
  year: number;
  month: number;
  total: string;
};

export type JobCompletionDTO = {
  completed: number;
  total: number;
  rate: number;
};

export type TopClientDTO = {
  clientName: string;
  totalSpent: string;
};

export type SkillEarningsDTO = {
  skillName: string;
  totalEarnings: string;
};