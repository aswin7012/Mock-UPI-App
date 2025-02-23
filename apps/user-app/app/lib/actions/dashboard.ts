"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function getBalance() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { amount: 0, locked: 0 };

    const balance = await prisma.balance.findUnique({
        where: { userId: Number(session.user.id) },
        select: { amount: true, locked: true }
    });

    return balance || { amount: 0, locked: 0 };
}

export async function getRecentTransactions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    return await prisma.onRampTransaction.findMany({
        where: { userId: Number(session.user.id) },
        orderBy: { startTime: "desc" },
        take: 5
    });
}
