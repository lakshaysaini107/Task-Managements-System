import app, { prisma } from "./src/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✓ Database connected");
    console.log(`✓ Server running on port ${PORT}`);
  } catch (error) {
    console.error("✗ Database connection failed:", error.message);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
