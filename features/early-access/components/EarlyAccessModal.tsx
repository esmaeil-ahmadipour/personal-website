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

export function EarlyAccessModal() {
  const { isOpen, isSubmitted, closeModal, setSubmitted, reset } =
    useEarlyAccessStore();
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const { mutate, isPending } = useEarlyAccessMutation();

  // تشخیص تم از body
  useEffect(() => {
    const checkTheme = () => {
      setTheme(document.body.classList.contains("dark") ? "dark" : "light");
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, {
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

  // جلوگیری از hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // مدیریت باز/بسته شدن مودال
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");

      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector(
          "input, select, textarea",
        );
        if (firstInput) (firstInput as HTMLElement).focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  // مدیریت کلید Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  // مدیریت کلیک روی backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // مدیریت Trap Focus
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const focusable = Array.from(focusableElements).filter(
        (el) =>
          (el as HTMLElement).offsetWidth > 0 ||
          (el as HTMLElement).offsetHeight > 0,
      ) as HTMLElement[];

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // مدیریت submit فرم
  const onSubmit = async (data: EarlyAccessData) => {
    try {
      await mutate(data);
      setSubmitted(true);
      resetForm();
      setTimeout(() => {
        const closeBtn = successRef.current?.querySelector("button");
        if (closeBtn) (closeBtn as HTMLElement).focus();
      }, 100);
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error ? error.message : "خطا در ارسال درخواست",
      });
    }
  };

  // ریست کردن مودال هنگام بسته شدن
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl p-8 shadow-2xl border"
        style={{
          background: isDark ? "#141a22" : "#ffffff",
          color: isDark ? "#eef2f5" : "#111827",
          borderColor: isDark ? "#2a353f" : "#eef2f0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2
                id="modal-title"
                className="text-2xl font-bold mb-2"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Request Early Access
              </h2>
              <p
                id="modal-description"
                className="text-sm leading-relaxed"
                style={{ color: isDark ? "#b0c0ca" : "#4a5b5e" }}
              >
                Request access to the Tarvix Engineering System. Share your
                GitHub, technical context, and adoption or collaboration goals.
                Requests are reviewed manually and selected participants may be
                invited to repository discussions and early collaboration.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-2xl leading-none ml-4 hover:opacity-70 transition-opacity"
              style={{ color: isDark ? "#b0c0ca" : "#4a5b5e" }}
              aria-label="Close dialog"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    errors.fullName
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label
                  htmlFor="workEmail"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                >
                  Work Email
                </label>
                <input
                  id="workEmail"
                  type="email"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    errors.workEmail
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                  {...register("workEmail")}
                />
                {errors.workEmail && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.workEmail.message}
                  </p>
                )}
              </div>

              {/* Role / Title */}
              <div>
                <label
                  htmlFor="roleTitle"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                >
                  Role / Title
                </label>
                <input
                  id="roleTitle"
                  type="text"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    isDark
                      ? "border-[#2a353f] focus:border-blue-600"
                      : "border-gray-200 focus:border-blue-600"
                  }`}
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                  {...register("roleTitle")}
                />
              </div>

              {/* Company or Team */}
              <div>
                <label
                  htmlFor="companyTeam"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                >
                  Company or Team
                </label>
                <input
                  id="companyTeam"
                  type="text"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    isDark
                      ? "border-[#2a353f] focus:border-blue-600"
                      : "border-gray-200 focus:border-blue-600"
                  }`}
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                  {...register("companyTeam")}
                />
              </div>

              {/* GitHub Username */}
              <div>
                <label
                  htmlFor="ghUsername"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                >
                  GitHub Username
                </label>
                <input
                  id="ghUsername"
                  type="text"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    errors.ghUsername
                      ? "border-red-500"
                      : isDark
                        ? "border-[#2a353f] focus:border-blue-600"
                        : "border-gray-200 focus:border-blue-600"
                  }`}
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                  {...register("ghUsername")}
                />
                {errors.ghUsername && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.ghUsername.message}
                  </p>
                )}
                <p
                  className="mt-1 text-xs"
                  style={{ color: isDark ? "#b0c0ca" : "#4a5b5e" }}
                >
                  Please provide a valid GitHub username.
                </p>
              </div>

              {/* Preferred Stack */}
              <div>
                <label
                  htmlFor="prefStack"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                >
                  Preferred Stack
                </label>
                <select
                  id="prefStack"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none ${
                    isDark
                      ? "border-[#2a353f] focus:border-blue-600"
                      : "border-gray-200 focus:border-blue-600"
                  }`}
                  style={{
                    color: isDark ? "#eef2f5" : "#111827",
                    background: isDark ? "#141a22" : "#ffffff",
                  }}
                  {...register("prefStack")}
                >
                  <option value="flutter">Flutter (available now)</option>
                  <option value="react">React (interest only)</option>
                  <option value="django">Django (interest only)</option>
                  <option value="nestjs">NestJS (interest only)</option>
                </select>
                <p
                  className="mt-1 text-xs"
                  style={{ color: isDark ? "#b0c0ca" : "#4a5b5e" }}
                >
                  Flutter CleanArc (Bloc/Riverpod) is supported in the current
                  release. Other stacks are in the interest‑gathering phase.
                </p>
              </div>

              {/* Why Access */}
              <div>
                <label
                  htmlFor="whyAccess"
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                >
                  Why do you want access?
                </label>
                <textarea
                  id="whyAccess"
                  rows={3}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors bg-transparent focus:outline-none resize-y ${
                    isDark
                      ? "border-[#2a353f] focus:border-blue-600"
                      : "border-gray-200 focus:border-blue-600"
                  }`}
                  style={{ color: isDark ? "#eef2f5" : "#111827" }}
                  {...register("whyAccess")}
                />
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Submitting..." : "Request Access"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Success State */
          <div ref={successRef} className="text-center py-8">
            <i className="fas fa-check-circle text-5xl text-blue-600 mb-4"></i>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Request Received
            </h3>
            <p
              className="text-sm mb-1"
              style={{ color: isDark ? "#b0c0ca" : "#4a5b5e" }}
            >
              Thanks — your request has been received.
            </p>
            <p
              className="text-sm"
              style={{ color: isDark ? "#b0c0ca" : "#4a5b5e" }}
            >
              We will review it and contact you if your access is approved.
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
