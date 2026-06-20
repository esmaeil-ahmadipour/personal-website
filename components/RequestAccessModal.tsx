// components/RequestAccessModal.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  workEmail: string;
  roleTitle: string;
  companyTeam: string;
  ghUsername: string;
  prefStack: string;
  whyAccess: string;
}

const GITHUB_USERNAME_REGEX =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RequestAccessModal({
  isOpen,
  onClose,
}: RequestAccessModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    workEmail: "",
    roleTitle: "",
    companyTeam: "",
    ghUsername: "",
    prefStack: "flutter",
    whyAccess: "",
  });

  // Mount and theme detection
  useEffect(() => {
    setMounted(true);
    const checkDarkMode = () =>
      setIsDark(document.body.classList.contains("dark"));
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      setMounted(false);
      observer.disconnect();
    };
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        workEmail: "",
        roleTitle: "",
        companyTeam: "",
        ghUsername: "",
        prefStack: "flutter",
        whyAccess: "",
      });
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.workEmail.trim()) {
      newErrors.workEmail = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.workEmail)) {
      newErrors.workEmail = "Invalid email format";
    }

    if (!formData.ghUsername.trim()) {
      newErrors.ghUsername = "GitHub username is required";
    } else if (!GITHUB_USERNAME_REGEX.test(formData.ghUsername)) {
      newErrors.ghUsername = "Invalid GitHub username format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error for this field when user starts typing
    if (errors[id as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.workEmail.trim(),
          role: formData.roleTitle.trim() || undefined,
          company: formData.companyTeam.trim() || undefined,
          githubUsername: formData.ghUsername.trim(),
          preferredStack: formData.prefStack,
          message: formData.whyAccess.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(
          data.message || "Something went wrong. Please try again.",
        );
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSubmitSuccess(false);
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  if (!mounted || !isOpen) return null;

  const theme = {
    bg: isDark ? "bg-gray-900" : "bg-white",
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-gray-700" : "border-gray-200",
    inputBorder: isDark ? "border-gray-600" : "border-gray-300",
    inputFocus: "focus:ring-2 focus:ring-blue-500 focus:outline-none",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div
        className={`${theme.bg} rounded-2xl p-8 w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto shadow-2xl border ${theme.border}`}
      >
        {!submitSuccess ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${theme.text}`}>
                Request Early Access
              </h2>
              <p className={`text-sm ${theme.textSecondary}`}>
                Request access to the Tarvix Engineering System. Share your
                GitHub, technical context, and adoption or collaboration goals.
                Requests are reviewed manually and selected participants may be
                invited to repository discussions and early collaboration.
              </p>
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {submitError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-1 ${theme.text}`}
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-transparent ${theme.text} ${theme.inputBorder} ${theme.inputFocus} transition-colors ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-1 ${theme.text}`}
                >
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Email"
                  type="email"
                  id="workEmail"
                  value={formData.workEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-transparent ${theme.text} ${theme.inputBorder} ${theme.inputFocus} transition-colors ${errors.workEmail ? "border-red-500" : ""}`}
                />
                {errors.workEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.workEmail}
                  </p>
                )}
              </div>

              {/* Role / Title */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-1 ${theme.text}`}
                >
                  Role / Title
                </label>
                <input
                  type="text"
                  placeholder="Role Title"
                  id="roleTitle"
                  value={formData.roleTitle}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-transparent ${theme.text} ${theme.inputBorder} ${theme.inputFocus} transition-colors`}
                />
              </div>

              {/* Company or Team */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-1 ${theme.text}`}
                >
                  Company or Team
                </label>
                <input
                  type="text"
                  id="companyTeam"
                  placeholder="Company Team"
                  value={formData.companyTeam}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-transparent ${theme.text} ${theme.inputBorder} ${theme.inputFocus} transition-colors`}
                />
              </div>

              {/* GitHub Username */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-1 ${theme.text}`}
                >
                  GitHub Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ghUsername"
                  placeholder="Username"
                  value={formData.ghUsername}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-transparent ${theme.text} ${theme.inputBorder} ${theme.inputFocus} transition-colors ${errors.ghUsername ? "border-red-500" : ""}`}
                />
                {errors.ghUsername && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ghUsername}
                  </p>
                )}
              </div>

              {/* Preferred Stack */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-1 ${theme.text}`}
                >
                  Preferred Stack
                </label>
                <select
                  id="prefStack"
                  value={formData.prefStack}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-transparent ${theme.text} ${theme.inputBorder} ${theme.inputFocus} transition-colors cursor-pointer`}
                >
                  <option value="flutter">Flutter (available now)</option>
                  <option value="react">React (interest only)</option>
                  <option value="django">Django (interest only)</option>
                  <option value="nestjs">NestJS (interest only)</option>
                </select>
                <p className={`text-xs ${theme.textSecondary} mt-1`}>
                  Flutter CleanArc (Bloc/Riverpod) is supported in the current
                  release.
                </p>
              </div>

              {/* Why Access */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-1 ${theme.text}`}
                >
                  Why do you want access?
                </label>
                <textarea
                  id="whyAccess"
                  rows={3}
                  value={formData.whyAccess}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-transparent ${theme.text} ${theme.inputBorder} ${theme.inputFocus} transition-colors resize-none`}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Request Access"}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Success State
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <i className="fas fa-check-circle text-4xl text-green-500"></i>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>
              Request Received
            </h3>
            <p className={theme.textSecondary}>
              Thanks — your request has been received.
            </p>
            <p className={`${theme.textSecondary} mb-6`}>
              We will review it and contact you if approved.
            </p>
            <button
              onClick={closeModal}
              className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
