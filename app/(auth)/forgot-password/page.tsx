"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── STEP 1: send reset code ── */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStep("reset");
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(
        clerkErr.errors?.[0]?.message ?? "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 2: verify code + set new password ── */
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(
        clerkErr.errors?.[0]?.message ?? "Invalid code or password. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef1f5] p-4">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* ── LEFT PANEL ── */}
        <div className="w-full md:w-1/2 p-10 flex flex-col">
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <h1 className="text-3xl text-gray-800 mb-2 text-center font-extrabold">
              Career Flow
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              {step === "email"
                ? "Enter your email and we'll send you a reset code."
                : "Enter the code we sent to your email and choose a new password."}
            </p>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3.5 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">💡</span>
                <p className="text-orange-700 text-sm leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            {/* ── Email step ── */}
            {step === "email" && (
              <form onSubmit={handleSendCode} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f3f4f6] border border-transparent focus:border-teal-400 focus:bg-white focus:outline-none text-gray-700 text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className="w-full py-3.5 rounded-xl bg-teal-400 hover:bg-teal-500 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send Reset Code"}
                </button>
              </form>
            )}

            {/* ── Reset step ── */}
            {step === "reset" && (
              <form onSubmit={handleReset} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="6-digit code from your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f3f4f6] border border-transparent focus:border-teal-400 focus:bg-white focus:outline-none text-gray-700 text-sm transition-all tracking-widest text-center"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-[#f3f4f6] border border-transparent focus:border-teal-400 focus:bg-white focus:outline-none text-gray-700 text-sm transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className="w-full py-3.5 rounded-xl bg-teal-400 hover:bg-teal-500 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError("");
                  }}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
                >
                  ← Use a different email
                </button>
              </form>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            Remembered it?{" "}
            <Link
              href="/sign-in"
              className="text-teal-500 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-[#d4f0ed] to-[#a8ddd8] rounded-r-3xl relative overflow-hidden">
          <Image
            src="/RightSide.png"
            alt="Working illustration"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </div>
  );
}
