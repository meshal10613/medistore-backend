import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function globalErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    let statusCode = 500;
    let message = "Internal Server Error";
    let error = err;

    // Prisma validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid or missing fields";
    }

    // Prisma known errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 409;
                message = "Duplicate key error";
                break;
            case "P2003":
                statusCode = 400;
                message = "Foreign key constraint failed";
                break;
            case "P2025":
                statusCode = 404;
                message = "Record not found";
                break;
        }
    }

    // Prisma connection issues
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            message = "Database authentication failed";
        } else if (err.errorCode === "P1001") {
            statusCode = 503;
            message = "Database server unreachable";
        }
    }

    // Custom app error (we’ll add this next 👇)
    else if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Log full error (server-side only)
    console.error(error);

    res.status(statusCode).json({
        success: false,
        message,
        error,
    });
}

export default globalErrorHandler;
