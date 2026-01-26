import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

(async function main() {
    try {
		await prisma.$connect();
		console.log("✅ Connected to the database successfully.");

        app.listen(config.port, () => {
            console.log(
                `🔗 Server is running on port http://localhost:${config.port}`,
            );
        });
    } catch (error: any) {
		console.log("An error occurred: ", error);
		await prisma.$disconnect();
		process.exit(1);
    }
})();
