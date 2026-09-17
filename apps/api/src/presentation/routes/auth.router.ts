import { extractToken, resolveUserScopes, verifySupabaseToken } from "@repo/auth";
import { Router, type Router as ExpressRouter } from "express";

const authRouter: ExpressRouter = Router();

/**
 * GET /api/v1/auth/session
 * Returns the current user's session data with roles and scopes.
 * Expects Supabase JWT in Authorization header or cookie.
 */
authRouter.get("/session", async (req, res) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_UNAUTHORIZED",
          message: "Authentication required",
        },
      });
    }

    const supabaseUser = await verifySupabaseToken(token);

    if (!supabaseUser) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_SESSION_INVALID",
          message: "Invalid or expired session",
        },
      });
    }

    const sessionUser = await resolveUserScopes(supabaseUser.id);

    return res.json({
      success: true,
      user: sessionUser,
    });
  } catch (error) {
    console.error("Session error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "AUTH_SESSION_ERROR",
        message: "Failed to verify session",
        detail: error instanceof Error ? error.message : String(error),
      },
    });
  }
});

/**
 * POST /api/v1/auth/sign-out
 * Client-side sign out. The client calls supabase.auth.signOut() directly.
 * This endpoint exists for API contract compatibility.
 */
authRouter.post("/sign-out", (_req, res) => {
  res.json({ success: true });
});

export { authRouter };
