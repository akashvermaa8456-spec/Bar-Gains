"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormInput, FormSelect, FormTextarea } from "@/components/forms/FormFields";
import { PersistenceNotice } from "@/components/forms/PersistenceNotice";
import { SuccessPopup } from "@/components/ui/SuccessPopup";
import { programOptions } from "@/lib/seo";
import { courses } from "@/lib/content/courses";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[0-9+\-\s()]{8,20}$/;

type Errors = Record<string, string>;
type JsonBody = Record<string, unknown>;

async function postJson(path: string, body: JsonBody) {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const body = String(data.get("message") ?? "").trim();

    if (name.length < 2) next.name = "Enter your name.";
    if (!emailRe.test(email)) next.email = "Enter a valid email.";
    if (!phoneRe.test(phone)) next.phone = "Enter a valid phone number.";
    if (subject.length < 3) next.subject = "Enter a subject.";
    if (body.length < 10) next.message = "Message should be at least 10 characters.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const res = await postJson("/api/contact", { name, email, phone, subject, message: body });
      if (res.ok) {
        setMessage("Thanks — your message was received.");
        (event.target as HTMLFormElement).reset();
      } else {
        setMessage("Sorry — an error occurred. Please try again later.");
      }
    } catch {
      setMessage("Server error — try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <PersistenceNotice />
      <FormInput id="name" name="name" label="Name" autoComplete="name" required error={errors.name} />
      <FormInput id="email" name="email" type="email" label="Email" autoComplete="email" required error={errors.email} />
      <FormInput id="phone" name="phone" type="tel" label="Phone" autoComplete="tel" required error={errors.phone} />
      <FormInput id="subject" name="subject" label="Subject" required error={errors.subject} />
      <FormTextarea id="message" name="message" label="Message" required error={errors.message} />
      {message ? <p className="text-sm text-teal-dark">{message}</p> : null}
      <Button type="submit" disabled={loading}>{loading ? "Sending…" : "Send message"}</Button>
    </form>
  );
}

export function CollegePartnerForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const college = String(data.get("college") ?? "").trim();
    const designation = String(data.get("designation") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const students = Number(data.get("students"));
    const requirement = String(data.get("requirement") ?? "").trim();
    const body = String(data.get("message") ?? "").trim();

    if (name.length < 2) next.name = "Enter your name.";
    if (college.length < 2) next.college = "Enter the college name.";
    if (designation.length < 2) next.designation = "Enter your designation.";
    if (!emailRe.test(email)) next.email = "Enter a valid email.";
    if (!phoneRe.test(phone)) next.phone = "Enter a valid phone number.";
    if (!Number.isFinite(students) || students < 1) next.students = "Enter the number of students.";
    if (!requirement) next.requirement = "Select a requirement.";
    if (body.length < 10) next.message = "Add a short message.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const res = await postJson("/api/business-leads", { name, college, designation, email, phone, students, requirement, message: body });
      if (res.ok) {
        setMessage("Thanks — your partnership request was submitted.");
        (event.target as HTMLFormElement).reset();
      } else {
        setMessage("Sorry — an error occurred. Please try again later.");
      }
    } catch {
      setMessage("Server error — try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <PersistenceNotice />
      <FormInput id="c-name" name="name" label="Name" required error={errors.name} />
      <FormInput id="c-college" name="college" label="College Name" required error={errors.college} />
      <FormInput id="c-designation" name="designation" label="Designation" required error={errors.designation} />
      <FormInput id="c-email" name="email" type="email" label="Email" required error={errors.email} />
      <FormInput id="c-phone" name="phone" type="tel" label="Phone" required error={errors.phone} />
      <FormInput id="c-students" name="students" type="number" min={1} label="Number of Students" required error={errors.students} />
      <FormSelect id="c-requirement" name="requirement" label="Requirement" required error={errors.requirement} defaultValue="">
        <option value="" disabled>
          Select
        </option>
        <option>Industrial training</option>
        <option>Internship programs</option>
        <option>Technical workshops</option>
        <option>Seminars</option>
        <option>Hackathons</option>
        <option>Final-year project guidance</option>
        <option>Certification programs</option>
        <option>Placement preparation</option>
        <option>Other</option>
      </FormSelect>
      <FormTextarea id="c-message" name="message" label="Message" required error={errors.message} />
      {message ? <p className="text-sm text-teal-dark">{message}</p> : null}
      <Button type="submit" disabled={loading}>{loading ? "Sending…" : "Partner With Us"}</Button>
    </form>
  );
}

export function BusinessEnquiryForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const business_type = String(data.get("business_type") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const budget = String(data.get("budget") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();

    if (name.length < 2) next.name = "Enter your name.";
    if (company.length < 2) next.company = "Enter the company name.";
    if (!emailRe.test(email)) next.email = "Enter a valid email.";
    if (!phoneRe.test(phone)) next.phone = "Enter a valid phone number.";
    if (!business_type) next.business_type = "Select a business type.";
    if (!service) next.service = "Select a service.";
    if (!budget) next.budget = "Select a budget range.";
    if (description.length < 20) next.description = "Describe the project (20+ characters).";

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const res = await postJson("/api/business-leads", { name, company, email, phone, business_type, service, budget, description });
      if (res.ok) {
        setMessage("Thanks — we received your project enquiry.");
        (event.target as HTMLFormElement).reset();
      } else {
        setMessage("Sorry — an error occurred. Please try again later.");
      }
    } catch {
      setMessage("Server error — try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="start-project" onSubmit={onSubmit} className="space-y-4" noValidate>
      <PersistenceNotice />
      <FormInput id="b-name" name="name" label="Name" required error={errors.name} />
      <FormInput id="b-company" name="company" label="Company Name" required error={errors.company} />
      <FormInput id="b-email" name="email" type="email" label="Email" required error={errors.email} />
      <FormInput id="b-phone" name="phone" type="tel" label="Phone" required error={errors.phone} />
      <FormSelect id="b-type" name="business_type" label="Business Type" required defaultValue="" error={errors.business_type}>
        <option value="" disabled>
          Select
        </option>
        <option>Startup</option>
        <option>Small business</option>
        <option>Local business</option>
        <option>New company</option>
        <option>Entrepreneur</option>
        <option>Other</option>
      </FormSelect>
      <FormSelect id="b-service" name="service" label="Required Service" required defaultValue="" error={errors.service}>
        <option value="" disabled>
          Select
        </option>
        <option>Business Websites</option>
        <option>Startup Websites</option>
        <option>E-commerce</option>
        <option>Custom Web Applications</option>
        <option>Website Maintenance</option>
      </FormSelect>
      <FormSelect id="b-budget" name="budget" label="Budget Range" required defaultValue="" error={errors.budget}>
        <option value="" disabled>
          Select (indicative)
        </option>
        <option>To be discussed</option>
        <option>Under ₹50,000</option>
        <option>₹50,000 – ₹1,50,000</option>
        <option>₹1,50,000+</option>
      </FormSelect>
      <FormTextarea id="b-desc" name="description" label="Project Description" required error={errors.description} />
      {message ? <p className="text-sm text-teal-dark">{message}</p> : null}
      <Button type="submit" disabled={loading}>{loading ? "Sending…" : "Start Your Project"}</Button>
    </form>
  );
}

export function StudentApplicationForm({ defaultProgram }: { defaultProgram?: string }) {
  const options = useMemo(() => programOptions(), []);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const full_name = String(data.get("full_name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const college = String(data.get("college") ?? "").trim();
    const degree = String(data.get("degree") ?? "").trim();
    const branch = String(data.get("branch") ?? "").trim();
    const year = String(data.get("year") ?? "").trim();
    const program = String(data.get("program") ?? "").trim();
    const msg = String(data.get("message") ?? "").trim();

    if (full_name.length < 2) next.full_name = "Enter your full name.";
    if (!emailRe.test(email)) next.email = "Enter a valid email.";
    if (!phoneRe.test(phone)) next.phone = "Enter a valid phone number.";
    if (college.length < 2) next.college = "Enter your college.";
    if (degree.length < 2) next.degree = "Enter your degree.";
    if (branch.length < 2) next.branch = "Enter your branch.";
    if (!year) next.year = "Select year of study.";
    if (!program) next.program = "Select a program.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const profileId = authData?.user?.id ?? null;
      const m = program.match(/^([a-z]+):(.+)$/i);
      let res;
      if (m && m[1].toLowerCase() === "course") {
        const courseSlug = m[2];
        res = await postJson("/api/course-enrollments", { full_name, email, phone, college, degree, branch, year, course: courseSlug, message: msg, profile_id: profileId });
      } else if (m && m[1].toLowerCase() === "project") {
        const projectSlug = m[2];
        res = await postJson("/api/project-inquiries", { full_name, email, phone, college, degree, branch, year, project: projectSlug, message: msg, profile_id: profileId });
      } else if (m && m[1].toLowerCase() === "internship") {
        const internshipSlug = m[2];
        res = await postJson("/api/internship-applications", { full_name, email, phone, college, degree, branch, year, internship: internshipSlug, message: msg, profile_id: profileId });
      } else {
        res = await postJson("/api/student-applications", { full_name, email, phone, college, degree, branch, year, program, message: msg, profile_id: profileId });
      }

      if (res && res.ok) {
        const targetKey = (() => {
          if (m && m[1].toLowerCase() === "course") return `applied:course:${m[2]}`;
          if (m && m[1].toLowerCase() === "project") return `applied:project:${m[2]}`;
          if (m && m[1].toLowerCase() === "internship") return `applied:internship:${m[2]}`;
          return `applied:program:${program}`;
        })();

        if (typeof window !== "undefined") {
          window.localStorage.setItem(targetKey, "1");
        }

        setMessage("Thanks — your application was submitted.");
        setSuccessOpen(true);
        (event.target as HTMLFormElement).reset();
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setMessage("Sorry — an error occurred. Please try again later.");
      }
    } catch (e) {
      console.error(e);
      setMessage("Server error — try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SuccessPopup
        open={successOpen}
        title="Application submitted"
        description="Thanks — your request was recorded successfully. We will get back to you soon with the next steps."
        onClose={() => setSuccessOpen(false)}
      />
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <PersistenceNotice />
        <FormInput id="s-name" name="full_name" label="Full Name" required error={errors.full_name} />
        <FormInput id="s-email" name="email" type="email" label="Email" required error={errors.email} />
        <FormInput id="s-phone" name="phone" type="tel" label="Phone" required error={errors.phone} />
        <FormInput id="s-college" name="college" label="College" required error={errors.college} />
        <FormInput id="s-degree" name="degree" label="Degree" required error={errors.degree} />
        <FormInput id="s-branch" name="branch" label="Branch" required error={errors.branch} />
        <FormSelect id="s-year" name="year" label="Year of Study" required defaultValue="" error={errors.year}>
          <option value="" disabled>
            Select
          </option>
          <option>1st year</option>
          <option>2nd year</option>
          <option>3rd year</option>
          <option>4th year</option>
          <option>Postgraduate</option>
          <option>Other</option>
        </FormSelect>
        <FormSelect id="s-program" name="program" label="Program" required defaultValue={defaultProgram ?? ""} error={errors.program}>
          <option value="" disabled>
            Select
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
        <FormTextarea id="s-message" name="message" label="Message" />
        {message ? <p className="text-sm text-teal-dark">{message}</p> : null}
        <Button type="submit" disabled={loading}>{loading ? "Sending…" : "Apply Now"}</Button>
      </form>
    </>
  );
}

export function CourseEnrollmentForm({ defaultCourse }: { defaultCourse?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();
  const options = useMemo(
    () =>
      courses.map((course) => ({
        value: course.slug,
        label: course.title,
      })),
    [],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const full_name = String(data.get("full_name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const college = String(data.get("college") ?? "").trim();
    const degree = String(data.get("degree") ?? "").trim();
    const branch = String(data.get("branch") ?? "").trim();
    const year = String(data.get("year") ?? "").trim();
    const course = String(data.get("course") ?? "").trim();
    const msg = String(data.get("message") ?? "").trim();

    if (full_name.length < 2) next.full_name = "Enter your full name.";
    if (!emailRe.test(email)) next.email = "Enter a valid email.";
    if (!phoneRe.test(phone)) next.phone = "Enter a valid phone number.";
    if (college.length < 2) next.college = "Enter your college.";
    if (degree.length < 2) next.degree = "Enter your degree.";
    if (branch.length < 2) next.branch = "Enter your branch.";
    if (!year) next.year = "Select year of study.";
    if (!course) next.course = "Select a course.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const profileId = authData?.user?.id ?? null;

      const res = await postJson("/api/course-enrollments", {
        full_name,
        email,
        phone,
        college,
        degree,
        branch,
        year,
        course,
        message: msg,
        profile_id: profileId,
      });

      if (res.ok) {
        setMessage("Thanks — you are enrolled! Check your email for confirmation.");
        setSuccessOpen(true);
        (event.target as HTMLFormElement).reset();
        if (profileId) {
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      } else {
        setMessage("Sorry — an error occurred. Please try again later.");
      }
    } catch {
      setMessage("Server error — try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SuccessPopup
        open={successOpen}
        title="Enrollment submitted"
        description="Thanks — your course request was recorded successfully. We will get back to you soon with the details."
        onClose={() => setSuccessOpen(false)}
      />
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <PersistenceNotice />
        <FormInput id="c-name" name="full_name" label="Full Name" required error={errors.full_name} />
        <FormInput id="c-email" name="email" type="email" label="Email" required error={errors.email} />
        <FormInput id="c-phone" name="phone" type="tel" label="Phone" required error={errors.phone} />
        <FormInput id="c-college" name="college" label="College" required error={errors.college} />
        <FormInput id="c-degree" name="degree" label="Degree" required error={errors.degree} />
        <FormInput id="c-branch" name="branch" label="Branch" required error={errors.branch} />
        <FormSelect id="c-year" name="year" label="Year of Study" required defaultValue="" error={errors.year}>
          <option value="" disabled>
            Select
          </option>
          <option>1st year</option>
          <option>2nd year</option>
          <option>3rd year</option>
          <option>4th year</option>
          <option>Postgraduate</option>
          <option>Other</option>
        </FormSelect>
        <FormSelect id="c-course" name="course" label="Course" required defaultValue={defaultCourse ?? ""} error={errors.course}>
          <option value="" disabled>
            Select
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
        <FormTextarea id="c-message" name="message" label="Message (optional)" />
        {message ? <p className="text-sm text-teal-dark">{message}</p> : null}
        <Button type="submit" disabled={loading}>{loading ? "Enrolling…" : "Enroll Now"}</Button>
      </form>
    </>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams?.get("next") ?? null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    if (mode === "register" && name.length < 2) next.name = "Enter your name.";
    if (!emailRe.test(email)) next.email = "Enter a valid email.";
    if (mode !== "forgot") {
      if (password.length < 8) next.password = "Use at least 8 characters.";
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        next.password = "Include at least one uppercase letter and one number.";
      }
    }
    if (mode === "register" && password !== confirm) {
      next.confirm = "Passwords do not match.";
    }

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      if (mode === "register") {
        const { data: signUpData, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setMessage(error.message || "Registration failed.");
        } else {
          const user = signUpData?.user;
          if (user?.id) {
            await supabase.from("profiles").upsert([{ id: user.id, full_name: name, email }]);
          }

          setMessage("Check your email for confirmation (if required). You can now log in.");
          router.push("/login");
        }
      } else if (mode === "login") {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          const errMsg = (error.message || "").toString();
          const looksLikeUnconfirmed = /confirm|confirmed|verify|verification|required.*confirmation|not verified|email.*confirm/i.test(errMsg);

          if (looksLikeUnconfirmed) {
            setMessage("Please verify your email before logging in, or use the reset flow if needed.");
          } else {
            setMessage(error.message || "Login failed.");
          }
        } else {
          setMessage("Logged in — redirecting…");
          const dest = nextParam ? decodeURIComponent(nextParam) : "/dashboard";
          router.push(dest);
          router.refresh();
          if (signInData?.user) {
            console.info("Signed in user", signInData.user.email);
          }
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`,
        });
        if (error) {
          setMessage(error.message || "Unable to send reset email.");
        } else {
          setMessage("If an account exists, a password reset link was sent to your email.");
        }
      }
    } catch {
      setMessage("Server error — try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {mode === "register" ? <FormInput id="a-name" name="name" label="Name" required error={errors.name} /> : null}
      <FormInput id="a-email" name="email" type="email" label="Email" required error={errors.email} />
      {mode !== "forgot" ? (
        <FormInput id="a-password" name="password" type="password" label="Password" required autoComplete={mode === "login" ? "current-password" : "new-password"} error={errors.password} />
      ) : null}
      {mode === "register" ? <FormInput id="a-confirm" name="confirm" type="password" label="Confirm Password" required autoComplete="new-password" error={errors.confirm} /> : null}
      {message ? <p className="text-sm text-teal-dark">{message}</p> : null}
      <Button type="submit" disabled={loading}>{loading ? (mode === "login" ? "Logging in…" : mode === "register" ? "Creating…" : "Sending…") : (mode === "login" ? "Log in" : mode === "register" ? "Create account" : "Send reset link")}</Button>
    </form>
  );
}

