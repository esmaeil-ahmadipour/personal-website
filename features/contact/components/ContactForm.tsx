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
            className="block text-sm font-semibold mb-1 text-[var(--text-primary)]"
          >
            {t("fullName")}
          </label>
          <input
            id="fullName"
            type="text"
            placeholder={t("fullName")}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border-[var(--border-subtle)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 focus:outline-none ${
              errors.fullName ? "border-red-500" : ""
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
            className="block text-sm font-semibold mb-1 text-[var(--text-primary)]"
          >
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t("email")}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border-[var(--border-subtle)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 focus:outline-none ${
              errors.email ? "border-red-500" : ""
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
            className="block text-sm font-semibold mb-1 text-[var(--text-primary)]"
          >
            {t("serviceSelect")}
          </label>
          <select
            id="service"
            className="w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 focus:outline-none appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2.5rem",
            }}
            {...register("service")}
          >
            <option
              value="flutter"
              className={`
                  w-full px-3 py-1.5 text-sm transition-colors
                  ${"text-gray-700 dark:text-gray-900 bg-blue-800 dark:bg-blue-900/50  hover:bg-gray-600 dark:hover:bg-gray-900/30"}
                `}
            >
              {t("serviceFlutter")}
            </option>
            <option
              value="web"
              className={`
                  w-full px-3 py-1.5 text-sm transition-colors
                  ${"text-gray-700 dark:text-gray-900 bg-blue-800 dark:bg-blue-900/50  hover:bg-gray-600 dark:hover:bg-gray-900/30"}
                `}
            >
              {t("serviceWeb")}
            </option>
            <option
              value="web3"
              className={`
                  w-full px-3 py-1.5 text-sm transition-colors
                  ${"text-gray-700 dark:text-gray-900 bg-blue-800 dark:bg-blue-900/50  hover:bg-gray-600 dark:hover:bg-gray-900/30"}
                `}
            >
              {t("serviceWeb3")}
            </option>
            <option
              value="consulting"
              className={`
                  w-full px-3 py-1.5 text-sm transition-colors
                  ${"text-gray-700 dark:text-gray-900 bg-blue-800 dark:bg-blue-900/50  hover:bg-gray-600 dark:hover:bg-gray-900/30"}
                `}
            >
              {t("serviceConsulting")}
            </option>
            <option
              value="foundation"
              className={`
                  w-full px-3 py-1.5 text-sm transition-colors
                  ${"text-gray-700 dark:text-gray-900 bg-blue-800 dark:bg-blue-900/50  hover:bg-gray-600 dark:hover:bg-gray-900/30"}
                `}
            >
              {t("serviceFoundation")}
            </option>
            <option
              value="audit"
              className={`
                  w-full px-3 py-1.5 text-sm transition-colors
                  ${"text-gray-700 dark:text-gray-900 bg-blue-800 dark:bg-blue-900/50  hover:bg-gray-600 dark:hover:bg-gray-900/30"}
                `}
            >
              {t("serviceAudit")}
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold mb-1 text-[var(--text-primary)]"
          >
            {t("projectDesc")}
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder={t("projectDesc")}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border-[var(--border-subtle)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)]/20 focus:outline-none resize-y ${
              errors.message ? "border-red-500" : ""
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
          className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press overflow-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? t("submitting") : t("sendInquiry")} →
        </button>
      </div>
    </form>
  );
}
