import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { hashPassword } from "@/app/lib/auth/password";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const username = data.username?.trim();
    const email = data.email?.trim().toLowerCase();
    const password = data.password?.trim();

    if (!username || !email || !password) {
        return NextResponse.json(
            {
                message: "Username, email, and password are required",
            },
            {
                status: 400,
            },
        );
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmailValid) {
        return NextResponse.json(
            {
                message: "Please provide a valid email address",
            },
            {
                status: 400,
            },
        );
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    username,
                },
                {
                    email,
                },
            ],
        },
    });

    if (existingUser) {
        return NextResponse.json(
            {
                message: "Username or email already exists",
            },
            {
                status: 409,
            },
        );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    return NextResponse.json({
        message: "You have been signed up",
    });
}
