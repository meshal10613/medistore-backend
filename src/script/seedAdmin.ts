import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";

(async function seedAdmin() {
    try {
        console.log("***** Admin Seeding Started..... *****");
        const adminData = {
            name: "Admin",
            email: config.admin.email!,
            password: config.admin.password!,
            role: Role.ADMIN,
        };

        console.log("***** Check Admin Exist or Not..... *****");
        //? check if the user exist or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email,
            },
        });
        if (existingUser) {
            throw new Error("User already exist");
        }

        console.log("***** Create Admin..... *****");
        const signupAdmin = await fetch(
            `${config.better_auth.url}/api/auth/sign-up/email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Origin: "http://localhost:3000",
                },
                body: JSON.stringify(adminData),
            },
        );

        if (signupAdmin.ok) {
            console.log("***** Admin Created..... *****");
            await prisma.user.update({
                where: {
                    email: adminData.email,
                },
                data: {
                    emailVerified: true,
                },
            });

            console.log("***** Email Verification Status Updated..... *****");
        }

        console.log("***** Admin Seeding Completed..... *****");
    } catch (error: any) {
        console.error("Error:", error);
    }
})();
