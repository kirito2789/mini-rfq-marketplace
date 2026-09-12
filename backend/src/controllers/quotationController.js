import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const quotationSchema = z.object({
  rfqId: z.string().min(1, "RFQ ID is required"),
  unitPrice: z.coerce.number().positive("Unit price must be greater than 0"),
  deliveryDays: z.coerce
    .number()
    .int()
    .positive("Delivery days must be greater than 0"),
  validityDays: z.coerce
    .number()
    .int()
    .positive("Validity days must be greater than 0"),
  tax: z.coerce.number().min(0).default(0),
  shipping: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
});

/* =========================
   CREATE QUOTATION
========================= */

export const createQuotation = async (req, res) => {
  try {
    if (req.user.role !== "SUPPLIER") {
      return res.status(403).json({
        message: "Only suppliers can submit quotations",
      });
    }

    const result = quotationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0].message,
      });
    }

    const {
      rfqId,
      unitPrice,
      deliveryDays,
      validityDays,
      tax,
      shipping,
      notes,
    } = result.data;

    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (rfq.status !== "OPEN") {
      return res.status(400).json({
        message: "This RFQ is no longer accepting quotations",
      });
    }

    const existingQuotation = await prisma.quotation.findUnique({
      where: {
        rfqId_supplierId: {
          rfqId,
          supplierId: req.user.userId,
        },
      },
    });

    if (existingQuotation) {
      return res.status(409).json({
        message: "You have already submitted a quotation for this RFQ",
      });
    }

    const quotation = await prisma.quotation.create({
      data: {
        rfqId,
        supplierId: req.user.userId,
        unitPrice,
        deliveryDays,
        validityDays,
        tax,
        shipping,
        notes: notes || null,
      },
      include: {
        rfq: {
          select: {
            id: true,
            title: true,
            quantity: true,
            budget: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Quotation submitted successfully",
      quotation,
    });
  } catch (error) {
    console.error("CREATE QUOTATION ERROR:", error);

    return res.status(500).json({
      message: "Server error while submitting quotation",
    });
  }
};

/* =========================
   GET SUPPLIER QUOTATIONS
========================= */

export const getMyQuotations = async (req, res) => {
  try {
    if (req.user.role !== "SUPPLIER") {
      return res.status(403).json({
        message: "Only suppliers can access supplier quotations",
      });
    }

    const quotations = await prisma.quotation.findMany({
      where: {
        supplierId: req.user.userId,
      },
      include: {
        rfq: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      quotations,
    });
  } catch (error) {
    console.error("GET MY QUOTATIONS ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching quotations",
    });
  }
};

/* =========================
   GET RFQ QUOTATIONS
========================= */

export const getRFQQuotations = async (req, res) => {
  try {
    if (req.user.role !== "BUYER") {
      return res.status(403).json({
        message: "Only buyers can view RFQ quotations",
      });
    }

    const { rfqId } = req.params;

    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (rfq.buyerId !== req.user.userId) {
      return res.status(403).json({
        message: "You do not have permission to view these quotations",
      });
    }

    const quotations = await prisma.quotation.findMany({
      where: { rfqId },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          unitPrice: "asc",
        },
      ],
    });

    return res.status(200).json({
      quotations,
    });
  } catch (error) {
    console.error("GET RFQ QUOTATIONS ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching RFQ quotations",
    });
  }
};

/* =========================
   ACCEPT QUOTATION
========================= */

export const acceptQuotation = async (req, res) => {
  try {
    if (req.user.role !== "BUYER") {
      return res.status(403).json({
        message: "Only buyers can accept quotations",
      });
    }

    const { quotationId } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
      include: {
        rfq: true,
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found",
      });
    }

    if (quotation.rfq.buyerId !== req.user.userId) {
      return res.status(403).json({
        message: "You do not have permission to accept this quotation",
      });
    }

    if (quotation.rfq.status !== "OPEN") {
      return res.status(400).json({
        message: "This RFQ is already closed",
      });
    }

    if (quotation.status !== "PENDING") {
      return res.status(400).json({
        message: "This quotation is no longer pending",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.quotation.updateMany({
        where: {
          rfqId: quotation.rfqId,
          id: {
            not: quotationId,
          },
        },
        data: {
          status: "REJECTED",
        },
      });

      const acceptedQuotation = await tx.quotation.update({
        where: {
          id: quotationId,
        },
        data: {
          status: "ACCEPTED",
        },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              email: true,
              companyName: true,
            },
          },
          rfq: true,
        },
      });

      await tx.rFQ.update({
        where: {
          id: quotation.rfqId,
        },
        data: {
          status: "CLOSED",
        },
      });

      return acceptedQuotation;
    });

    return res.status(200).json({
      message: "Quotation accepted successfully",
      quotation: result,
    });
  } catch (error) {
    console.error("ACCEPT QUOTATION ERROR:", error);

    return res.status(500).json({
      message: "Server error while accepting quotation",
    });
  }
};

/* =========================
   REJECT QUOTATION
========================= */

export const rejectQuotation = async (req, res) => {
  try {
    if (req.user.role !== "BUYER") {
      return res.status(403).json({
        message: "Only buyers can reject quotations",
      });
    }

    const { quotationId } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
      include: {
        rfq: true,
      },
    });

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found",
      });
    }

    if (quotation.rfq.buyerId !== req.user.userId) {
      return res.status(403).json({
        message: "You do not have permission to reject this quotation",
      });
    }

    if (quotation.rfq.status !== "OPEN") {
      return res.status(400).json({
        message: "This RFQ is already closed",
      });
    }

    if (quotation.status !== "PENDING") {
      return res.status(400).json({
        message: "This quotation is no longer pending",
      });
    }

    const updatedQuotation = await prisma.quotation.update({
      where: {
        id: quotationId,
      },
      data: {
        status: "REJECTED",
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Quotation rejected successfully",
      quotation: updatedQuotation,
    });
  } catch (error) {
    console.error("REJECT QUOTATION ERROR:", error);

    return res.status(500).json({
      message: "Server error while rejecting quotation",
    });
  }
};