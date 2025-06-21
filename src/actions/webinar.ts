"use server";

import { WebinarFormState } from "@/store/useWebinarStore";
import { onAuthenticatedUser } from "./auth";
import { prismaClient } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";

function combineDateTime(
  date: Date,
  timeStr: string,
  timeFormat: "AM" | "PM"
): Date {
  const [hoursStr, minutesStr] = timeStr.split(":");
  let hours = Number.parseInt(hoursStr, 10);
  const minutes = Number.parseInt(minutesStr || "0", 10);

  if (timeFormat === "PM" && hours < 12) {
    hours += 12;
  } else if (timeFormat === "AM" && hours === 12) {
    hours = 0;
  }

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export const createWebinar = async (formData: WebinarFormState) => {
  try {
    const user = await onAuthenticatedUser();
    if (!user) {
      return { status: 401, message: "Unauthorized" };
    }

    // Check if user has a subscription
    // if (!user.user?.subscription) {
    //   return { status: 402, message: "Subscription Required" };
    // }

    const presenterId = user.user?.id;
    console.log("Form Data: ", formData, presenterId);

    if (!formData.basicInfo.webinarName) {
      return { status: 404, message: "Webinar Name is Required" };
    }

    if (!formData.basicInfo.date) {
      return { status: 404, message: "Webinar date is required" };
    }
    if (!formData.basicInfo.time) {
      return { status: 404, message: "Webinar time is required" };
    }

    const combinedDateTime = combineDateTime(
      formData.basicInfo.date,
      formData.basicInfo.time,
      formData.basicInfo.timeFormat || "AM"
    );
    const now = new Date();
    if (combinedDateTime < now) {
      return {
        status: 400,
        message: "Webinar Date and Time cannot be in the Past",
      };
    }
    const webinar = await prismaClient.webinar.create({
      data: {
        title: formData.basicInfo.webinarName,
        description: formData.basicInfo.description || "",
        startTime: combinedDateTime,
        tags: formData.cta.tags || [],
        ctaLabel: formData.cta.ctaLabel,
        ctaType: formData.cta.ctaType,
        aiAgentId: formData.cta.aiAgent || null,
        priceId: formData.cta.priceId || null,
        lockChat: formData.additionalInfo.lockChat || false,
        couponCode: formData.additionalInfo.couponEnabled
          ? formData.additionalInfo.couponCode || null
          : null,
        couponEnabled: formData.additionalInfo.couponEnabled || false,
        presenterId: presenterId!,
      },
    });
    revalidatePath("/");
    return {
      status: 200,
      message: "Webinar Created Successfully",
      webinarId: webinar.id,
      webinarLink: `/webinar/${webinar.id}`,
    };
  } catch (error) {
    console.log("Error Creating Webinar: ", error);
    return {
      status: 500,
      message: "Error Creating Webinar",
    };
  }
};
