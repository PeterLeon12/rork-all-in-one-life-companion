import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { registerProcedure } from "./routes/auth/register/route";
import { loginProcedure } from "./routes/auth/login/route";
import { getProfileProcedure, updateProfileProcedure, addAchievementProcedure } from "./routes/auth/profile/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    register: registerProcedure,
    login: loginProcedure,
    getProfile: getProfileProcedure,
    updateProfile: updateProfileProcedure,
    addAchievement: addAchievementProcedure,
  }),
});

export type AppRouter = typeof appRouter;