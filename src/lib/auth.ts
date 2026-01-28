import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config";
import { Role, Status } from "../constants/enum";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [config.better_auth.app_url!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: Role.CUSTOMER,
                required: true,
                allowedValues: [Role.CUSTOMER, Role.SELLER, Role.ADMIN],
            },
            status: {
                type: "string",
                defaultValue: Status.ACTIVE,
                required: true,
                allowedValues: [Status.ACTIVE, Status.BANNED],
            }
        },
    },
    emailAndPassword: {
        enabled: true,
        requireVerifiedEmail: false,
    },
    socialProviders: {
        google: {
            accessType: "offline",
            prompt: "select_account consent",
            clientId: config.google.client_id as string,
            clientSecret: config.google.client_secret as string,
        },
    },
});
