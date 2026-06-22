"use client";

import { useState, useEffect } from "react";
 import { useTranslation } from "@/features/shared";

interface RequestAccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestAccessDialog({
  isOpen,
  onClose,
}: RequestAccessDialogProps) {
  const { t,locale,isRTL } = useTranslation();
 
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    roleTitle: "",
    companyTeam: "",
    githubUsername: "",
    preferredStack: "flutter",
    whyAccess: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        email: "",
        roleTitle: "",
        companyTeam: "",
        githubUsername: "",
        preferredStack: "flutter",
        whyAccess: "",
      });
      setStatus("idle");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("fullNameRequired");
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = t("validEmailRequired");
    }

    if (!formData.roleTitle.trim()) {
      newErrors.roleTitle = t("roleTitleRequired");
    }

    if (!formData.companyTeam.trim()) {
      newErrors.companyTeam = t("companyTeamRequired");
    }

    if (!formData.githubUsername.trim()) {
      newErrors.githubUsername = t("githubRequired");
    } else if (
      !/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?!-)){0,38}$/.test(formData.githubUsername)
    ) {
      newErrors.githubUsername = t("invalidGithubFormat");
    }

    if (!formData.whyAccess.trim()) {
      newErrors.whyAccess = t("whyAccessRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus("submitting");

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      setStatus("success");
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const renderIdleForm = () => (
    <>
      <p className="text-sm text-secondary mb-6 leading-relaxed">
        {t("dialogDesc")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="floating-label-group">
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder=" "
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full ${errors.fullName ? "border-rose-500 dark:border-rose-400" : ""}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <label htmlFor="fullName">{t("fullName")}</label>
          {errors.fullName && (
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="floating-label-group">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            className={`w-full ${errors.email ? "border-rose-500 dark:border-rose-400" : ""}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <label htmlFor="email">{t("workEmail")}</label>
          {errors.email && (
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Role / Title */}
        <div className="floating-label-group">
          <input
            type="text"
            name="roleTitle"
            id="roleTitle"
            placeholder=" "
            value={formData.roleTitle}
            onChange={handleChange}
            className={`w-full ${errors.roleTitle ? "border-rose-500 dark:border-rose-400" : ""}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <label htmlFor="roleTitle">{t("roleTitle")}</label>
          {errors.roleTitle && (
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
              {errors.roleTitle}
            </p>
          )}
        </div>

        {/* Company / Team */}
        <div className="floating-label-group">
          <input
            type="text"
            name="companyTeam"
            id="companyTeam"
            placeholder=" "
            value={formData.companyTeam}
            onChange={handleChange}
            className={`w-full ${errors.companyTeam ? "border-rose-500 dark:border-rose-400" : ""}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <label htmlFor="companyTeam">{t("companyTeam")}</label>
          {errors.companyTeam && (
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
              {errors.companyTeam}
            </p>
          )}
        </div>

        {/* GitHub Username */}
        <div className="floating-label-group">
          <input
            type="text"
            name="githubUsername"
            id="githubUsername"
            placeholder=" "
            value={formData.githubUsername}
            onChange={handleChange}
            className={`w-full ${errors.githubUsername ? "border-rose-500 dark:border-rose-400" : ""}`}
            dir="ltr"
          />
          <label htmlFor="githubUsername">{t("githubUsername")}</label>
          {errors.githubUsername && (
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
              {errors.githubUsername}
            </p>
          )}
          <p className="text-xs text-muted mt-1">{t("githubHelp")}</p>
        </div>

        {/* Preferred Stack */}
        <div className="floating-label-group">
          <select
            name="preferredStack"
            id="preferredStack"
            value={formData.preferredStack}
            onChange={handleChange}
            className="w-full appearance-none"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="flutter">{t("stackFlutter")}</option>
            <option value="react">{t("stackReact")}</option>
            <option value="django">{t("stackDjango")}</option>
            <option value="nestjs">{t("stackNestJS")}</option>
          </select>
          <label htmlFor="preferredStack">{t("preferredStack")}</label>
          <p className="text-xs text-muted mt-1">{t("stackHelp")}</p>
        </div>

        {/* Why Access */}
        <div className="floating-label-group">
          <textarea
            name="whyAccess"
            id="whyAccess"
            placeholder=" "
            rows={3}
            value={formData.whyAccess}
            onChange={handleChange}
            className={`w-full resize-y min-h-[80px] ${errors.whyAccess ? "border-rose-500 dark:border-rose-400" : ""}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <label htmlFor="whyAccess">{t("whyAccess")}</label>
          {errors.whyAccess && (
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
              {errors.whyAccess}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost flex-1"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? t("submitting") : t("submitRequest")}
          </button>
        </div>
      </form>
    </>
  );

  const renderSuccess = () => (
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
      <h3 className="text-xl font-semibold mb-2">{t("requestReceived")}</h3>
      <p className="text-secondary text-sm max-w-sm mx-auto">
        {t("requestReceivedText1")}
      </p>
      <p className="text-muted text-sm mt-2 max-w-sm mx-auto">
        {t("requestReceivedText2")}
      </p>
      <button onClick={onClose} className="btn btn-primary mt-6">
        {t("close")}
      </button>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 dark:bg-rose-400/10 flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-rose-500 dark:text-rose-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">{t("somethingWentWrong")}</h3>
      <button
        onClick={() => setStatus("idle")}
        className="btn btn-primary mt-6"
      >
        {t("back")}
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && status !== "submitting") {
          onClose();
        }
      }}
    >
      <div
        className="glass w-full max-w-lg rounded-2xl p-6 shadow-xl animate-slide-down max-h-[90vh] overflow-y-auto"
        style={{
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">{t("dialogTitle")}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface/80 transition-colors"
            aria-label={t("close")}
            disabled={status === "submitting"}
          >
            <svg
              className="w-5 h-5 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        {status === "idle" && renderIdleForm()}
        {status === "success" && renderSuccess()}
        {status === "error" && renderError()}
      </div>
    </div>
  );
}
