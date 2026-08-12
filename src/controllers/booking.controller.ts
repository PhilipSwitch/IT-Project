import { Response } from "express";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuthRequest } from "../middleware/auth.middleware";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function createBooking(
  req: AuthRequest,
  res: Response
) {
  try {
    const { serviceId, bookingDate, scheduledTime, notes } = req.body;

    if (!serviceId || !bookingDate || !scheduledTime) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const clientId = req.user!.userId;

    const service = await prisma.service.findUnique({
      where: {
        id: Number(serviceId),
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        clientId,
        serviceId: Number(serviceId),
        bookingDate: new Date(bookingDate),
        scheduledTime: new Date(scheduledTime),
        notes,
      },
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getProviderBookings(
  req: AuthRequest,
  res: Response
) {
  try {
    const providerId = req.user!.userId;

    const bookings = await prisma.booking.findMany({
      where: {
        service: {
          providerId,
        },
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            price: true,
            pricingType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


export async function acceptBooking(
  req: AuthRequest,
  res: Response
) {
  try {
    const bookingId = Number(req.params.id);
    const providerId = req.user!.userId;

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        service: {
          providerId,
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending bookings can be accepted",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    return res.status(200).json({
      message: "Booking accepted successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function rejectBooking(
  req: AuthRequest,
  res: Response
) {
  try {
    const bookingId = Number(req.params.id);
    const providerId = req.user!.userId;

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        service: {
          providerId,
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending bookings can be rejected",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "REJECTED",
      },
    });

    return res.status(200).json({
      message: "Booking rejected successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getClientBookings(
  req: AuthRequest,
  res: Response
) {
  try {
    const clientId = req.user!.userId;

    const bookings = await prisma.booking.findMany({
      where: {
        clientId,
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            price: true,
            pricingType: true,
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
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
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function cancelBooking(
  req: AuthRequest,
  res: Response
) {
  try {
    const bookingId = Number(req.params.id);
    const clientId = req.user!.userId;

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        clientId,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending bookings can be cancelled",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function completeBooking(
  req: AuthRequest,
  res: Response
) {
  try {
    const bookingId = Number(req.params.id);
    const providerId = req.user!.userId;

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        service: {
          providerId,
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "ACCEPTED") {
      return res.status(400).json({
        message: "Only accepted bookings can be completed",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    return res.status(200).json({
      message: "Booking completed successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}