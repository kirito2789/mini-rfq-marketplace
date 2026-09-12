import express from "express";

import {
  createQuotation,
  getMyQuotations,
  getRFQQuotations,
  acceptQuotation,
  rejectQuotation,
} from "../controllers/quotationController.js";

import {
  authenticate,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Supplier
router.post(
  "/",
  authenticate,
  requireRole("SUPPLIER"),
  createQuotation
);

router.get(
  "/my",
  authenticate,
  requireRole("SUPPLIER"),
  getMyQuotations
);

// Buyer
router.get(
  "/rfq/:rfqId",
  authenticate,
  requireRole("BUYER"),
  getRFQQuotations
);

router.post(
  "/:quotationId/accept",
  authenticate,
  requireRole("BUYER"),
  acceptQuotation
);

router.post(
  "/:quotationId/reject",
  authenticate,
  requireRole("BUYER"),
  rejectQuotation
);

export default router;