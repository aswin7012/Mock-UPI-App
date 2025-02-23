"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;

    if (!from) return { success: false, message: "User not authenticated" };
    if (amount <= 0) return { success: false, message: "Invalid amount" };

    const toUser = await prisma.user.findFirst({ where: { number: to } });
    if (!toUser) return { success: false, message: "Recipient not found" };

    try {
        await prisma.$transaction(async (tx) => {
            // Lock both sender and receiver balance
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${toUser.id} FOR UPDATE`;

            const fromBalance = await tx.balance.findUnique({ where: { userId: Number(from) } });
            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient funds");
            }

            // Deduct from sender
            await tx.balance.update({
                where: { userId: Number(from) },
                data: { amount: { decrement: amount } },
            });

            // Add to recipient
            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            // Log transaction
            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(from),
                    toUserId: toUser.id,
                    amount,
                    timestamp: new Date()
                }
            });
        });

        return { success: true, message: "Transfer successful" };
    } catch (error) {
        let errorMessage = "Transfer failed due to an unexpected error";
        
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return { success: false, message: errorMessage };
    }
}
