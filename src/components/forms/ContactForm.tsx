"use client";

import { useRef, useState, type FormEvent } from "react";
import { contact } from "@/data/pages";

type Values = { firstName: string; lastName: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = "Enter your first name.";
  if (!v.lastName.trim()) e.lastName = "Enter your last name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter an email address like name@company.com.";
  if (!v.message.trim()) e.message = "Write a message.";
  return e;
}

// Frontend-only for now: replace this function with a real API call when a backend exists.
async function submitContact(values: Values): Promise<void> {
  void values;
  await new Promise((r) => setTimeout(r, 1200));
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({ firstName: "", lastName: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const form = useRef<HTMLFormElement>(null);
  const f = contact.form;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    await submitContact(values);
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div role="status" className="flex min-h-80 flex-col justify-center gap-6">
        <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden>
          <circle cx="26" cy="26" r="24" fill="none" stroke="var(--brand-red)" strokeWidth="2" />
          <path d="M15 27l7 7 15-16" fill="none" stroke="var(--brand-red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="[stroke-dasharray:40] [stroke-dashoffset:40] animate-[draw_600ms_var(--ease-out)_200ms_forwards]" />
        </svg>
        <p className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">{f.success}</p>
        <button type="button" onClick={() => { setValues({ firstName: "", lastName: "", email: "", message: "" }); setStatus("idle"); }} className="w-fit border-b border-current pb-1 text-sm font-medium">
          Send another message
        </button>
      </div>
    );
  }

  const field = (name: keyof Values, label: string, type = "text") => {
    const err = errors[name];
    const Tag = name === "message" ? "textarea" : "input";
    return (
      <div className={name === "message" ? "sm:col-span-2" : ""}>
        <label htmlFor={`cf-${name}`} className="mb-2 block text-sm font-medium">
          {label}
        </label>
        <Tag
          id={`cf-${name}`}
          name={name}
          type={Tag === "input" ? type : undefined}
          rows={name === "message" ? 6 : undefined}
          autoComplete={name === "firstName" ? "given-name" : name === "lastName" ? "family-name" : name === "email" ? "email" : undefined}
          value={values[name]}
          onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
          aria-invalid={!!err}
          aria-describedby={err ? `cf-${name}-err` : undefined}
          className={`w-full rounded-[var(--radius-control)] border bg-transparent px-4 py-3 outline-none transition-colors focus-visible:border-brand-red-mid ${err ? "border-brand-red-mid" : "border-line-light"}`}
        />
        {err && (
          <p id={`cf-${name}-err`} className="mt-2 text-sm text-brand-red-mid">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form ref={form} noValidate onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2" aria-busy={status === "submitting"}>
      {field("firstName", f.firstName)}
      {field("lastName", f.lastName)}
      <div className="sm:col-span-2">{field("email", f.email, "email")}</div>
      {field("message", f.message)}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-brand-red-press px-8 font-medium text-white transition-colors hover:bg-brand-red disabled:cursor-wait disabled:opacity-70"
        >
          {status === "submitting" && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {status === "submitting" ? "Sending…" : f.submit}
        </button>
      </div>
    </form>
  );
}
