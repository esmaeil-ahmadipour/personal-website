"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, type ContactData } from "../schemas/contact.schema";
import { useContact } from "../hooks/useContact";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { CheckIcon } from "@/features/shared/components/icons/CheckIcon";
import { useEffect, useState } from "react";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const { t } = useTranslation();
  const { mutate, isPending, isSuccess, error } = useContact({
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactData>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = (data: ContactData) => {
    mutate(data);
  };

  // Trigger slide-up animation when success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setShowSuccess(true), 100);
      return () => clearTimeout(timer);
    }
    setShowSuccess(false);
  }, [isSuccess]);

  // ===== SUCCESS STATE =====
  if (isSuccess) {
    return (
      <div
        className={`transition-all duration-500 ease-out ${
          showSuccess ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="text-center py-6 px-4">
          {/* Animated checkmark */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 animate-in zoom-in duration-300">
            <CheckIcon
              size={32}
              strokeWidth={2.5}
              className="text-green-600 dark:text-green-400"
            />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1.5">
            {t("contactSuccess1")}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            {t("contactSuccessDesc1")}
          </p>

          {/* Confirmation chips */}
          <div className="mt-4 flex justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckIcon
                size={14}
                strokeWidth={2.5}
                className="text-green-500"
              />
              {t("emailSent")}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon
                size={14}
                strokeWidth={2.5}
                className="text-green-500"
              />
              {t("responseWithin24h")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ===== FORM =====
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white"
          >
            {t("fullName")}
          </label>
          <input
            id="fullName"
            type="text"
            placeholder={t("fullName")}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent dark:border-[#2a353f] focus:border-blue-600 focus:outline-none ${
              errors.fullName ? "border-red-500" : "border-gray-200"
            }`}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white"
          >
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t("email")}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent dark:border-[#2a353f] focus:border-blue-600 focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="service"
            className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white"
          >
            {t("serviceSelect")}
          </label>
          <select
            id="service"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors bg-transparent dark:border-[#2a353f] focus:border-blue-600 focus:outline-none"
            {...register("service")}
          >
            <option value="flutter">{t("serviceFlutter")}</option>
            <option value="web">{t("serviceWeb")}</option>
            <option value="web3">{t("serviceWeb3")}</option>
            <option value="consulting">{t("serviceConsulting")}</option>
            <option value="foundation">{t("serviceFoundation")}</option>
            <option value="audit">{t("serviceAudit")}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white"
          >
            {t("projectDesc")}
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder={t("projectDesc")}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent dark:border-[#2a353f] focus:border-blue-600 focus:outline-none resize-y ${
              errors.message ? "border-red-500" : "border-gray-200"
            }`}
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? t("submitting") : t("sendInquiry")} →
        </button>
      </div>
    </form>
  );
}
