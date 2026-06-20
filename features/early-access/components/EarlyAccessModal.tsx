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
          error instanceof Error ? error.message : "Error submitting request",
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
                Request Early Access
              </h2>
              <p className="text-sm leading-relaxed text-white/50">
                Request access to the Tarvix Engineering System. Share your
                GitHub, technical context, and adoption goals.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-2xl leading-none ml-4 hover:opacity-70 transition-opacity text-white/50"
              aria-label="Close dialog"
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
                  htmlFor="workEmail"
                  className="block text-sm font-semibold mb-1"
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
                  {...register("workEmail")}
                />
                {errors.workEmail && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.workEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="roleTitle"
                  className="block text-sm font-semibold mb-1"
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
                  {...register("roleTitle")}
                />
              </div>

              <div>
                <label
                  htmlFor="companyTeam"
                  className="block text-sm font-semibold mb-1"
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
                  {...register("companyTeam")}
                />
              </div>

              <div>
                <label
                  htmlFor="ghUsername"
                  className="block text-sm font-semibold mb-1"
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
                  {...register("ghUsername")}
                />
                {errors.ghUsername && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.ghUsername.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-white/30">
                  Please provide a valid GitHub username.
                </p>
              </div>

              <div>
                <label
                  htmlFor="prefStack"
                  className="block text-sm font-semibold mb-1"
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
                    background: isDark ? "#141a22" : "#ffffff",
                  }}
                  {...register("prefStack")}
                >
                  <option value="flutter">Flutter (available now)</option>
                  <option value="react">React (interest only)</option>
                  <option value="django">Django (interest only)</option>
                  <option value="nestjs">NestJS (interest only)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="whyAccess"
                  className="block text-sm font-semibold mb-1"
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
          <div className="text-center py-8">
            <i className="fas fa-check-circle text-5xl text-blue-600 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Request Received</h3>
            <p className="text-sm text-white/50 mb-1">
              Thanks — your request has been received.
            </p>
            <p className="text-sm text-white/50">
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
