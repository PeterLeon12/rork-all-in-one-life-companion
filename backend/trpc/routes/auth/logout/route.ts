import { publicProcedure } from "../../../create-context";

export const logoutProcedure = publicProcedure
  .mutation(async () => {
    // For JWT-based auth, logout is handled client-side by removing the token
    // This endpoint can be used for logging purposes or token blacklisting if needed
    
    return {
      success: true,
      message: "Successfully logged out"
    };
  });