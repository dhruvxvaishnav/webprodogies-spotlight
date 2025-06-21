import {
  validateAdditionalFieldInfo,
  validateBasicInfo,
  validateCTA,
  ValidationErrors,
} from "@/lib/type";
import { CtaTypeEnum } from "@prisma/client";
import { create } from "zustand";

export type WebinarFormState = {
  basicInfo: {
    webinarName?: string;
    description?: string;
    date?: Date;
    time?: string;
    timeFormat?: "AM" | "PM";
  };
  cta: {
    ctaLabel?: string;
    tags?: string[];
    ctaType: CtaTypeEnum;
    aiAgent?: string;
    priceId?: string;
  };
  additionalInfo: {
    lockChat?: boolean;
    couponCode?: string;
    couponEnabled?: boolean;
  };
};

type ValidationState = {
  basicInfo: {
    valid: boolean;
    error: ValidationErrors;
  };
  cta: {
    valid: boolean;
    error: ValidationErrors;
  };
  additionalInfo: {
    valid: boolean;
    error: ValidationErrors;
  };
};

type WebinarStore = {
  isModalOpen: boolean;
  isComplete: boolean;
  isSubmitting: boolean;
  formData: WebinarFormState;
  validation: ValidationState;

  setModalOpen: (open: boolean) => void;
  setComplete: (complete: boolean) => void;
  setSubmitting: (submitting: boolean) => void;

  updateBasicInfoField: <K extends keyof WebinarFormState["basicInfo"]>(
    field: K,
    value: WebinarFormState["basicInfo"][K]
  ) => void;

  updateCTAField: <K extends keyof WebinarFormState["cta"]>(
    field: K,
    value: WebinarFormState["cta"][K]
  ) => void;

  updateAdditionalInfoField: <
    K extends keyof WebinarFormState["additionalInfo"]
  >(
    field: K,
    value: WebinarFormState["additionalInfo"][K]
  ) => void;

  validateStep: (stepId: keyof WebinarFormState) => boolean;
  getStepValidationErrors: (stepId: keyof WebinarFormState) => ValidationErrors;

  resetForm: () => void;
};

const initialState: WebinarFormState = {
  basicInfo: {
    webinarName: "",
    description: "",
    date: undefined,
    time: "",
    timeFormat: "AM",
  },
  cta: {
    ctaLabel: "",
    tags: [],
    ctaType: "BOOK_A_CALL",
    aiAgent: "",
    priceId: "",
  },
  additionalInfo: {
    lockChat: false,
    couponCode: "",
    couponEnabled: false,
  },
};

const initialValidation: ValidationState = {
  basicInfo: { valid: false, error: {} },
  cta: { valid: false, error: {} },
  additionalInfo: { valid: true, error: {} }, // Additional Information Is Optional By Default
};

export const useWebinarStore = create<WebinarStore>((set, get) => ({
  isModalOpen: false,
  isComplete: false,
  isSubmitting: false,
  formData: initialState,
  validation: initialValidation,

  setModalOpen: (open: boolean) => set({ isModalOpen: open }),
  setComplete: (complete: boolean) => set({ isComplete: complete }),
  setSubmitting: (submitting: boolean) => set({ isSubmitting: submitting }),

  updateBasicInfoField: (field, value) => {
    set((state) => {
      const newBasicInfo = { ...state.formData.basicInfo, [field]: value };

      const { valid, errors } = validateBasicInfo(newBasicInfo);

      return {
        formData: { ...state.formData, basicInfo: newBasicInfo },
        validation: {
          ...state.validation,
          basicInfo: { valid, error: errors },
        },
      };
    });
  },
  updateCTAField: (field, value) => {
    set((state) => {
      const newCTA = { ...state.formData.cta, [field]: value };
      const { valid, errors } = validateCTA(newCTA);

      return {
        formData: { ...state.formData, cta: newCTA },
        validation: { ...state.validation, cta: { valid, error: errors } },
      };
    });
  },

  updateAdditionalInfoField: (field, value) => {
    set((state) => {
      const newAdditionalInfo = {
        lockChat: state.formData.additionalInfo.lockChat ?? false,
        couponCode: state.formData.additionalInfo.couponCode ?? "",
        couponEnabled: state.formData.additionalInfo.couponEnabled ?? false,
        [field]: value,
      };
      const { valid, errors } = validateAdditionalFieldInfo(newAdditionalInfo);

      return {
        formData: { ...state.formData, additionalInfo: newAdditionalInfo },
        validation: {
          ...state.validation,
          additionalInfo: { valid, error: errors },
        },
      };
    });
  },
  validateStep: (stepId: keyof WebinarFormState) => {
    const { formData } = get();
    let validationResult: { valid: boolean; errors: ValidationErrors };

    switch (stepId) {
      case "basicInfo":
        validationResult = validateBasicInfo(formData.basicInfo);
        break;
      case "cta":
        validationResult = validateCTA(formData.cta);
        break;
      case "additionalInfo":
        validationResult = validateAdditionalFieldInfo(formData.additionalInfo);
        break;
      default:
        validationResult = { valid: true, errors: {} };
    }
    set((state) => {
      return {
        validation: {
          ...state.validation,
          [stepId]: {
            valid: validationResult.valid,
            error: validationResult.errors,
          },
        },
      };
    });
    return validationResult.valid;
  },
  getStepValidationErrors: (stepId: keyof WebinarFormState) => {
    return get().validation[stepId].error;
  },
  resetForm: () =>
    set({
      isComplete: false,
      isSubmitting: false,
      formData: initialState,
      validation: initialValidation,
    }),
}));
