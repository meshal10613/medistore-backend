import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { auth as betterAuth } from "../lib/auth";

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            //? get user session info
            const session = await betterAuth.api.getSession({
                headers: req.headers as any,
            });

            if (!session) {
                return res
                    .status(401)
                    .json({ success: false, message: "Unauthorized Access!" });
            }

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email is not verified!",
                });
            }

            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified,
            };

            if (roles.length && !roles.includes(req.user.role as Role)) {
                return res
                    .status(403)
                    .json({ success: false, message: "Forbidden Access!" });
            }
            next();
        } catch (error: any) {
            next(error);
        }
    };
};

export default auth;
