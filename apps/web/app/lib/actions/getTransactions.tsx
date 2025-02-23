"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getTransactions() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return { success: false, message: "User not authenticated" };
    }

    try {
        const transactions = await prisma.p2pTransfer.findMany({
            where: { fromUserId: Number(userId) },
            include: {
                toUser: {
                    select: { name: true, number: true },
                },
            },
            orderBy: { timestamp: "desc" },
        });

        return { success: true, transactions };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return { success: false, message: "Error fetching transactions" };
    }
}
