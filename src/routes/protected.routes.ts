import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get("/", authenticate, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: (req as any).user,
  });
});

router.get(
  "/client",
  authenticate,
  authorizeRoles("CLIENT"),
  (req, res) => {
    res.json({
      message: "Welcome, Client!",
    });
  }
);

router.get(
  "/provider",
  authenticate,
  authorizeRoles("PROVIDER"),
  (req, res) => {
    res.json({
      message: "Welcome, Provider!",
    });
  }
);

router.get(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome, Admin!",
    });
  }
);

export default router;