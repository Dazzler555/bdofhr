module.exports = {
    config: function() {
        if (typeof process.env.ADMIN_ID === "undefined") {
            console.error("Error: ADMIN_ID environment variable is not defined.");
            return;
        }
        if (typeof process.env.BOT_TOKEN === "undefined") {
            console.error("Error: BOT_TOKEN environment variable is not defined.");
            return;
        }
        const adminId = Number(process.env.ADMIN_ID);
        if (isNaN(adminId)) {
            console.error("Error: ADMIN_ID environment variable is not a valid number.");
            return;
        }

        return {
            adminUsers: [adminId],
            botToken: process.env.BOT_TOKEN
        }
    }
};
