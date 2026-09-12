import express from "express";

import {
  createRFQ,
  getMyRFQs,
  getOpenRFQs,
  getRFQById,
} from "../controllers/rfqController.js";

import {
  authenticate,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Buyer creates RFQ
router.post(
  "/",
  authenticate,
  requireRole("BUYER"),
  createRFQ
);

// Buyer gets their RFQs
router.get(
  "/my",
  authenticate,
  requireRole("BUYER"),
  getMyRFQs
);

// Suppliers browse open RFQs
router.get(
  "/open",
  authenticate,
  requireRole("SUPPLIER"),
  getOpenRFQs
);

// Get one RFQ
router.get(
  "/:id",
  authenticate,
  getRFQById
);

export default router;