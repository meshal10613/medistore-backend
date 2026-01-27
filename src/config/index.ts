import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    better_auth: {
        secret: process.env.BETTER_AUTH_SECRET,
        url: process.env.BETTER_AUTH_URL,
        app_url: process.env.APP_URL,
    },
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    }
};

export default config;
