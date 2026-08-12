import { Router } from "express";
import {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} from "../controllers/service.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", getServices);
router.get("/:id", getService);

// Provider-only routes
router.post(
  "/",
  authenticate,
  authorizeRoles("PROVIDER"),
  createService
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("PROVIDER"),
  updateService
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("PROVIDER"),
  deleteService
);

export default router;