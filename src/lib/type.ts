import { CtaTypeEnum } from "@prisma/client";

export type ValidationErrors = Record<string, string>;

export type ValidationResult = {
  valid: boolean;
  errors: ValidationErrors;
};

export const validateBasicInfo = (data: {
  webinarName?: string;
  description?: string;
  date?: Date;
  time?: string;
  timeFormat?: "AM" | "PM";
}): ValidationResult => {
  const errors: ValidationErrors = {};

  if (!data.webinarName?.trim()) {
    errors.webinarName = "Webinar Name Is Required";
  }
  if (!data.description?.trim()) {
    errors.description = "Description Is Required";
  }
  if (!data.date) {
    errors.date = "Date Is Required";
  }
  if (!data.time?.trim()) {
    errors.time = "Time Is Required";
  } else {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;
    if (!timeRegex.test(data.time)) {
      errors.time = "Time Must Be In Format HH:MM (eg: 10:30)";
    }
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCTA = (data: {
  ctaLabel?: string;
  tags?: string[];
  ctaType: string;
  aiAgent?: string;
}): ValidationResult => {
  const errors: ValidationErrors = {};

  if (!data.ctaLabel?.trim()) {
    errors.ctaLabel = "CTA label is required";
  }
  if (!data.ctaType) {
    errors.ctaType = "Please select a CTA type";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAdditionalFieldInfo = (data: {
  lockChat?: boolean;
  couponCode?: string;
  couponEnabled?: boolean;
}): ValidationResult => {
  const errors: ValidationErrors = {};

  if (data.couponEnabled && !data.couponCode?.trim()) {
    errors.couponCode = "Coupon Code Is Required When Enabled";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
