import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// CREATE SERVICE
export async function createService(req: AuthRequest, res: Response) {
  try {
    const { title, description, price, pricingType, availability } = req.body;

    if (!title || !description || price === undefined || !pricingType) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const providerId = req.user!.userId;

    const service = await prisma.service.create({
      data: {
        providerId,
        title,
        description,
        price,
        pricingType,
        availability,
      },
    });

    return res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// GET ALL SERVICES
/*export async function getServices(req: Request, res: Response) {
  try {
    const services = await prisma.service.findMany({
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
          },
        },
      },
    });

    return res.status(200).json({
      services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}*/


export async function getServices(req: Request, res: Response) {
  try {
    const { search, pricingType, location } = req.query;

    const services = await prisma.service.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  {
                    title: {
                      contains: String(search),
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: String(search),
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {},

          pricingType
            ? {
                pricingType: String(pricingType),
              }
            : {},

          location
            ? {
                provider: {
                  location: {
                    contains: String(location),
                    mode: "insensitive",
                  },
                },
              }
            : {},
        ],
      },

      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
          },
        },
      },
    });

    return res.status(200).json({
      count: services.length,
      services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// GET ONE SERVICE
export async function getService(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
          },
        },
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.status(200).json({
      service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// UPDATE SERVICE
export async function updateService(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const providerId = req.user!.userId;

    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    if (existingService.providerId !== providerId) {
      return res.status(403).json({
        message: "You can only update your own services",
      });
    }

    const {
      title,
      description,
      price,
      pricingType,
      availability,
    } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        price,
        pricingType,
        availability,
      },
    });

    return res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// DELETE SERVICE
export async function deleteService(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const providerId = req.user!.userId;

    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    if (existingService.providerId !== providerId) {
      return res.status(403).json({
        message: "You can only delete your own services",
      });
    }

    await prisma.service.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}