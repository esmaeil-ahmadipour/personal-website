"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EarlyAccessSchema,
  type EarlyAccessData,
} from "../schemas/early-access.schema";
import { useEarlyAccessStore } from "../store/early-access.store";
import { useEarlyAccessMutation } from "../hooks/useEarlyAccessModal";

import { useTranslation } from "@/features/shared";

export function EarlyAccessModal() {
  const { t, locale, isRTL } = useTranslation();

  const { isOpen, isSubmitted, closeModal, setSubmitted, reset } =
    useEarlyAccessStore();
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const { mutate, isPending } = useEarlyAccessMutation();

  useEffect(() => {
    const checkTheme = () => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    setError,
  } = useForm<EarlyAccessData>({
    resolver: zodResolver(EarlyAccessSchema),
    defaultValues: {
      prefStack: "flutter",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const onSubmit = async (data: EarlyAccessData) => {
    try {
      await mutate(data);
      setSubmitted(true);
      resetForm();
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error ? error.message : t("somethingWentWrong"),
      });
    }
  };

  const handleClose = () => {
    reset();
    resetForm();
    closeModal();
  };

  if (!mounted || !isOpen) return null;

  const isDark = theme === "dark";

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl p-8 shadow-2xl border"
        style={{
          background: isDark ? "#141a22" : "#ffffff",
          color: isDark ? "#eef2f5" : "#111827",
          borderColor: isDark ? "#2a353f" : "#eef2f0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 id="modal-title" className="text-2xl font-bold mb-2">
                {t("dialogTitle")}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                }}
              >
                {t("dialogDesc")}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-2xl leading-none ml-4 hover:opacity-70 transition-opacity"
              style={{
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              }}
              aria-label={t("close")}
            >
              ×
            </button>
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold mb-1"
                >
                  {t("fullName")}
                </label>
                <input
                  id="fullName"
                  type="text"
                  dir={isRTL ? "rtl" : "ltr"}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    errors.fullName
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  placeholder={t("fullNamePlaceholder")}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">
                    {t("fullNameRequired")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="workEmail"
                  className="block text-sm font-semibold mb-1"
                >
                  {t("workEmail")}
                </label>
                <input
                  id="workEmail"
                  type="email"
                  dir={isRTL ? "rtl" : "ltr"}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    errors.workEmail
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  placeholder={t("workEmailPlaceholder")}
                  {...register("workEmail")}
                />
                {errors.workEmail && (
                  <p className="mt-1 text-sm text-red-500">
                    {t("validEmailRequired")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="roleTitle"
                  className="block text-sm font-semibold mb-1"
                >
                  {t("roleTitle")}
                </label>
                <input
                  id="roleTitle"
                  type="text"
                  dir={isRTL ? "rtl" : "ltr"}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    errors.roleTitle
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  placeholder={t("roleTitlePlaceholder")}
                  {...register("roleTitle")}
                />
                {errors.roleTitle && (
                  <p className="mt-1 text-sm text-red-500">
                    {t("roleTitleRequired")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="companyTeam"
                  className="block text-sm font-semibold mb-1"
                >
                  {t("companyTeam")}
                </label>
                <input
                  id="companyTeam"
                  type="text"
                  dir={isRTL ? "rtl" : "ltr"}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    errors.companyTeam
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  placeholder={t("companyTeamPlaceholder")}
                  {...register("companyTeam")}
                />
                {errors.companyTeam && (
                  <p className="mt-1 text-sm text-red-500">
                    {t("companyTeamRequired")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ghUsername"
                  className="block text-sm font-semibold mb-1"
                >
                  {t("githubUsername")}
                </label>
                <input
                  id="ghUsername"
                  type="text"
                  dir="ltr"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    errors.ghUsername
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  placeholder={t("githubUsernamePlaceholder")}
                  {...register("ghUsername")}
                />
                {errors.ghUsername && (
                  <p className="mt-1 text-sm text-red-500">
                    {t("githubRequired")}
                  </p>
                )}
                <p
                  className="mt-1 text-xs"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                  }}
                >
                  {t("githubHelp")}
                </p>
              </div>

              <div>
                <label
                  htmlFor="prefStack"
                  className="block text-sm font-semibold mb-1"
                >
                  {t("preferredStack")}
                </label>
                <select
                  id="prefStack"
                  dir={isRTL ? "rtl" : "ltr"}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    isDark
                      ? "border-[#2a353f] focus:border-blue-600"
                      : "border-gray-200 focus:border-blue-600"
                  }`}
                  style={{
                    background: isDark ? "#141a22" : "#ffffff",
                  }}
                  {...register("prefStack")}
                >
                  <option value="flutter">{t("stackFlutter")}</option>
                  <option value="react">{t("stackReact")}</option>
                  <option value="django">{t("stackDjango")}</option>
                  <option value="nestjs">{t("stackNestJS")}</option>
                </select>
                <p
                  className="mt-1 text-xs"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                  }}
                >
                  {t("stackHelp")}
                </p>
              </div>

              <div>
                <label
                  htmlFor="whyAccess"
                  className="block text-sm font-semibold mb-1"
                >
                  {t("whyAccess")}
                </label>
                <textarea
                  id="whyAccess"
                  rows={3}
                  dir={isRTL ? "rtl" : "ltr"}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none resize-y ${
                    errors.whyAccess
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  placeholder={t("whyAccessPlaceholder")}
                  {...register("whyAccess")}
                />
                {errors.whyAccess && (
                  <p className="mt-1 text-sm text-red-500">
                    {t("whyAccessRequired")}
                  </p>
                )}
              </div>

              {errors.root && (
                <p className="text-sm text-red-500">{errors.root.message}</p>
              )}

              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-opacity-10"
                  style={{
                    borderColor: isDark ? "#2a353f" : "#eef2f0",
                    color: isDark ? "#eef2f5" : "#111827",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? t("submitting") : t("submitRequest")}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-500 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t("requestReceived")}</h3>
            <p
              className="text-sm mb-1"
              style={{
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              }}
            >
              {t("requestReceivedText1")}
            </p>
            <p
              className="text-sm"
              style={{
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              }}
            >
              {t("requestReceivedText2")}
            </p>
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-opacity-10"
                style={{
                  borderColor: isDark ? "#2a353f" : "#eef2f0",
                  color: isDark ? "#eef2f5" : "#111827",
                  background: "transparent",
                }}
              >
                {t("close")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
