import { Router } from "express";

import {
  createBooking,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  getClientBookings,
  cancelBooking,
  completeBooking,
} from "../controllers/booking.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();


router.post(
  "/",
  authenticate,
  authorizeRoles("CLIENT"),
  createBooking
);

router.get(
  "/provider",
  authenticate,
  authorizeRoles("PROVIDER"),
  getProviderBookings
);

router.patch(
  "/:id/accept",
  authenticate,
  authorizeRoles("PROVIDER"),
  acceptBooking
);

router.patch(
  "/:id/reject",
  authenticate,
  authorizeRoles("PROVIDER"),
  rejectBooking
);

router.get(
  "/client",
  authenticate,
  authorizeRoles("CLIENT"),
  getClientBookings
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorizeRoles("CLIENT"),
  cancelBooking
);

router.patch(
  "/:id/complete",
  authenticate,
  authorizeRoles("PROVIDER"),
  completeBooking
);

export default router;