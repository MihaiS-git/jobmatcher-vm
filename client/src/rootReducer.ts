import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { authApi } from "./features/authApi";
import { userApi } from "./features/user/userApi";
import { freelancerApi } from "./features/profile/freelancerApi";
import { jobCategoriesApi } from "./features/jobs/jobCategoriesApi";
import { languagesApi } from "./features/languages/languagesApi";
import { customerApi } from "./features/profile/customerApi";
import { portfolioApi } from "./features/profile/portfolio/portfolioApi";
import { projectsApi } from "./features/projects/projectsApi";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, type PersistConfig } from "redux-persist";
import { proposalApi } from "./features/proposal/proposalApi";
import { milestoneApi } from "./features/contracts/milestone/milestoneApi";
import { contractsApi } from "./features/contracts/contractsApi";
import { invoiceApi } from "./features/invoices/invoiceApi";
import { paymentApi } from "./features/payment/paymentApi";
import { freelancerAnalyticsApi } from "./features/analytics/freelancerAnalyticsApi";
import { customerAnalyticsApi } from "./features/analytics/customerAnalyticsApi";

const appReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [jobCategoriesApi.reducerPath]: jobCategoriesApi.reducer,
  [languagesApi.reducerPath]: languagesApi.reducer,
  [freelancerApi.reducerPath]: freelancerApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [portfolioApi.reducerPath]: portfolioApi.reducer,
  [projectsApi.reducerPath]: projectsApi.reducer,
  [proposalApi.reducerPath]: proposalApi.reducer,
  [milestoneApi.reducerPath]: milestoneApi.reducer,
  [contractsApi.reducerPath]: contractsApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [freelancerAnalyticsApi.reducerPath]: freelancerAnalyticsApi.reducer,
  [customerAnalyticsApi.reducerPath]: customerAnalyticsApi.reducer,
});

const persistConfig: PersistConfig<ReturnType<typeof appReducer>> = {
  key: "root",
  storage,
  whitelist: [
    "auth", // keep only auth slice persisted
  ],
};

export const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Reset everything (auth + RTK Query caches + any other slices)
    state = undefined;
  }
  return appReducer(state, action);
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
