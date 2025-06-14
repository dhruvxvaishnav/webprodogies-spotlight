"use server";

import { prismaClient } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function onAuthenticatedUser() {
  try {
    console.log("🔍 Checking authentication...");

    const user = await currentUser();
    console.log("👤 Current user:", user ? "Found" : "Not found");

    if (!user) {
      console.log("❌ No user found, returning 403");
      return {
        status: 403,
      };
    }

    console.log("🔍 Looking for user in database...");
    const userExists = await prismaClient.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (userExists) {
      console.log("✅ User exists in database");
      return {
        status: 200,
        user: userExists,
      };
    }

    console.log("🆕 Creating new user...");
    const newUser = await prismaClient.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + " " + user.lastName,
        profileImage: user.imageUrl,
      },
    });

    if (!newUser) {
      console.log("❌ Failed to create user");
      return {
        status: 500,
        message: "Error Creating a User",
      };
    }

    console.log("✅ New user created successfully");
    return {
      status: 201,
      user: newUser,
    };
  } catch (error) {
    console.log("💥 Error in authentication:", error);
    return { status: 500, message: "Internal Server Error" };
  }
}
