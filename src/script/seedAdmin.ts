import config from "../config";
import { Role } from "../constants/enum";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
    try {
        console.log("***** Admin Seeding Started..... *****");
        //! must put in env
        const adminData = {
            name: "Syed Mohiuddin Meshal",
            email: "syedmohiuddinmeshal@gmail.com",
            password: "12345678",
            role: Role.ADMIN,
            emailVerified: true,
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
            `http://localhost:5000/api/auth/sign-up/email`, //${config.better_auth.url}
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(adminData),
				credentials: "include",
            },
        );
		console.log(signupAdmin)
        if (signupAdmin.ok) {
            console.log("***** Admin Created..... *****");
            // await prisma.user.update({
            //     where: {
            //         email: adminData.email,
            //     },
            //     data: {
            //         emailVerified: true,
            //     },
            // });

            // console.log("***** Email Verification Status Updated..... *****");
        }

        console.log("***** Admin Seeding Completed..... *****");
    } catch (error: any) {
        console.error("Error:", error);
    }
}

seedAdmin();
