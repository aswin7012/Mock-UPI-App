import express from "express";
import { PrismaClient, OnRampStatus } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const HDFC_SECRET = process.env.HDFC_SECRET || "your_secret_key";

// Define Zod schema for validation
const paymentSchema = z.object({
  token: z.string(),
  user_identifier: z.string(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  signature: z.string(),
});

// Webhook Endpoint
app.post("/hdfcWebhook", async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = paymentSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: "Invalid payload", errors: validation.error.errors });
      return;
    }

    const { token, user_identifier, amount, signature } = validation.data;
    const userId = Number(user_identifier);
    const amountValue = Number(amount);

    // Verify HDFC Webhook Signature
    const expectedSignature = crypto.createHmac("sha256", HDFC_SECRET)
      .update(token + user_identifier + amount)
      .digest("hex");

    if (expectedSignature !== signature) {
      res.status(403).json({ message: "Invalid signature, request not authorized" });
      return;
    }

    // Fetch the transaction to ensure it exists
    const transaction = await prisma.onRampTransaction.findUnique({ where: { token } });

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    // Perform Database Transactions
    await prisma.$transaction([
      prisma.balance.update({
        where: { userId },
        data: { amount: { increment: amountValue } },
      }),
      prisma.onRampTransaction.update({
        where: { token },
        data: { status: OnRampStatus.Success },
      }),
    ]);

    res.json({ message: "Payment Captured Successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Error processing webhook" });
  }
});

// Keep the Server Running
const PORT = process.env.PORT || 3003;
const server = app.listen(PORT, () => {
  console.log(`Bank Webhook Service is running on port ${PORT}...`);
});

// Graceful Shutdown - Disconnect Prisma when stopping the server
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed, Prisma disconnected.");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed, Prisma disconnected.");
    process.exit(0);
  });
});
