"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CONTACT_TOPICS,
  ContactSchema,
  type ContactData,
} from "../schemas/contact.schema";
import { useContact } from "../hooks/useContact";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
  onSuccess?: () => void;
}

const ERROR_KEYS: Record<string, string> = {
  name: "fbErrName",
  email: "fbErrEmail",
  topic: "fbErrTopic",
  message: "fbErrMessage",
};

export function ContactForm({ onSuccess }: ContactFormProps) {
  const { t } = useTranslation();
  const { mutate, isPending, isSuccess, error } = useContact({
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { fullName: "", email: "", message: "", website: "" },
  });

  const err = (message?: string) =>
    message && ERROR_KEYS[message] ? t(ERROR_KEYS[message]) : undefined;

  if (isSuccess) {
    return (
      <p
        role="status"
        className="rounded-lg border border-[hsl(var(--accent))] bg-[hsl(var(--accent-soft))] p-4 text-[hsl(var(--text-primary))]"
      >
        {t("fbSuccess")}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => mutate(data))}
      noValidate
      className="grid gap-4 sm:grid-cols-2"
    >
      <Field label={t("fbName")} htmlFor="fb-name" error={err(errors.fullName?.message)}>
        <Input
          id="fb-name"
          autoComplete="name"
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
      </Field>

      <Field label={t("fbEmail")} htmlFor="fb-email" error={err(errors.email?.message)}>
        <Input
          id="fb-email"
          type="email"
          autoComplete="email"
          dir="ltr"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <Field
        label={t("fbTopic")}
        htmlFor="fb-topic"
        error={err(errors.service?.message)}
        className="sm:col-span-2"
      >
        <Select
          id="fb-topic"
          defaultValue=""
          aria-invalid={!!errors.service}
          {...register("service")}
        >
          <option value="" disabled>
            {t("fbTopicPlaceholder")}
          </option>
          {CONTACT_TOPICS.map((topic, i) => (
            <option key={topic} value={topic}>
              {t(`fbTopic${i + 1}`)}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label={t("fbMessage")}
        htmlFor="fb-message"
        error={err(errors.message?.message)}
        className="sm:col-span-2"
      >
        <Textarea
          id="fb-message"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" loading={isPending}>
          {t("fbSend")}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-[hsl(var(--accent-rose))]">
            {t("fbErrServer")}
          </p>
        )}
      </div>
    </form>
  );
}
