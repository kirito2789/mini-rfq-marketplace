import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const createRFQSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  category: z.string().optional(),
  quantity: z.coerce.number().int().positive().optional(),
  budget: z.coerce.number().positive().optional(),
  deliveryDate: z.string().optional(),
  location: z.string().optional(),
});

export const createRFQ = async (req, res) => {
  try {
    // Only BUYER accounts can create RFQs
    if (req.user.role !== "BUYER") {
      return res.status(403).json({
        message: "Only buyers can create RFQs",
      });
    }

    const result = createRFQSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0].message,
      });
    }

    const {
      title,
      description,
      category,
      quantity,
      budget,
      deliveryDate,
      location,
    } = result.data;

    const rfq = await prisma.rFQ.create({
      data: {
        title,
        description,
        category: category || null,
        quantity: quantity || null,
        budget: budget || null,
        deliveryDate: deliveryDate
          ? new Date(deliveryDate)
          : null,
        location: location || null,
        buyerId: req.user.userId,
      },
    });

    return res.status(201).json({
      message: "RFQ created successfully",
      rfq,
    });
  } catch (error) {
    console.error("CREATE RFQ ERROR:", error);

    return res.status(500).json({
      message: "Server error while creating RFQ",
    });
  }
};

export const getMyRFQs = async (req, res) => {
  try {
    const rfqs = await prisma.rFQ.findMany({
      where: {
        buyerId: req.user.userId,
      },
      include: {
        quotations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      rfqs,
    });
  } catch (error) {
    console.error("GET MY RFQS ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching RFQs",
    });
  }
};

export const getOpenRFQs = async (req, res) => {
  try {
    const rfqs = await prisma.rFQ.findMany({
      where: {
        status: "OPEN",
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      rfqs,
    });
  } catch (error) {
    console.error("GET OPEN RFQS ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching open RFQs",
    });
  }
};

export const getRFQById = async (req, res) => {
  try {
    const { id } = req.params;

    const rfq = await prisma.rFQ.findUnique({
      where: {
        id,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        quotations: {
          include: {
            supplier: {
              select: {
                id: true,
                name: true,
                companyName: true,
              },
            },
          },
        },
      },
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    return res.status(200).json({
      rfq,
    });
  } catch (error) {
    console.error("GET RFQ ERROR:", error);

    return res.status(500).json({
      message: "Server error while fetching RFQ",
    });
  }
};