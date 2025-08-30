import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { registerProcedure } from "./routes/auth/register/route";
import { loginProcedure } from "./routes/auth/login/route";
import { logoutProcedure } from "./routes/auth/logout/route";
import { getProfileProcedure, updateProfileProcedure, addAchievementProcedure } from "./routes/auth/profile/route";
import { updateDailyGoalsProcedure } from "./routes/health/update-daily-goals/route";
import { generateWeeklyReportProcedure } from "./routes/health/weekly-report/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    register: registerProcedure,
    login: loginProcedure,
    logout: logoutProcedure,
    getProfile: getProfileProcedure,
    updateProfile: updateProfileProcedure,
    addAchievement: addAchievementProcedure,
  }),
  health: createTRPCRouter({
    updateDailyGoals: updateDailyGoalsProcedure,
    getWeeklyReport: generateWeeklyReportProcedure,
  }),
});

export type AppRouter = typeof appRouter;