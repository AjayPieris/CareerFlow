"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleIcon from "../../../../public/google.png";

export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(
        clerkErr.errors?.[0]?.message ?? "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message ?? "Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    await signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef1f5] p-4">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* â”€â”€ LEFT PANEL â”€â”€ */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col">
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            {!pendingVerification ? (
              <>
                <h1 className="text-3xl text-gray-800 mb-6 text-center font-extrabold ">
                  Career Flow
                </h1>

                {error && (
                  <div className="mb-4 px-4 py-3.5 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                    <span className="text-lg leading-none mt-0.5">💡</span>
                    <p className="text-orange-700 text-sm leading-relaxed">
                      {friendlyError(error)}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Email */}
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-[#f3f4f6] border border-transparent focus:border-teal-400 focus:bg-white focus:outline-none text-gray-700 text-sm transition-all"
                  />

                  {/* Password */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                  {/* Sign up button */}
                  <button
                    type="submit"
                    disabled={loading || !isLoaded}
                    className="w-full py-3.5 rounded-xl bg-teal-400 hover:bg-teal-500 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>

                {/* Google Sign Up */}
                <button
                  onClick={handleGoogleSignUp}
                  disabled={!isLoaded}
                  className="mt-3 w-full py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-medium text-sm flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
                >
                  <Image src={GoogleIcon} alt="Google" width={18} height={18} />
                  Sign up with Google
                </button>
              </>
            ) : (
              /*  Email Verification  */
              <>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                  Check your email
                </h1>
                <p className="text-gray-400 text-sm mb-8">
                  We sent a verification code to{" "}
                  <span className="text-teal-500">{email}</span>
                </p>

                {error && (
                  <div className="mb-4 px-4 py-3.5 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                    <span className="text-lg leading-none mt-0.5">💡</span>
                    <p className="text-orange-700 text-sm leading-relaxed">
                      {friendlyError(error)}
                    </p>
                  </div>
                )}

                <form onSubmit={handleVerify} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-[#f3f4f6] border border-transparent focus:border-teal-400 focus:bg-white focus:outline-none text-gray-700 text-sm transition-all tracking-[0.3em] text-center font-mono text-lg"
                  />
                  <button
                    type="submit"
                    disabled={loading || !isLoaded}
                    className="w-full py-3.5 rounded-xl bg-teal-400 hover:bg-teal-500 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>
                </form>

                <button
                  onClick={() => {
                    setPendingVerification(false);
                    setError("");
                  }}
                  className="mt-3 text-sm text-gray-400 hover:text-gray-600 text-center w-full"
                >
                  Back
                </button>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-teal-500 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/*  RIGHT PANEL  */}
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

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("data breach") || m.includes("online data"))
    return "This password has appeared in a known security leak. Try something more unique — mix letters, numbers and a symbol. 🔒";
  if (
    m.includes("already exists") ||
    m.includes("already taken") ||
    m.includes("email address is taken")
  )
    return "Looks like this email is already registered. Try signing in instead!";
  if (m.includes("too short") || m.includes("at least"))
    return "Your password needs to be a bit longer. Try at least 8 characters.";
  if (m.includes("too many") || m.includes("rate limit"))
    return "Too many attempts — please wait a moment and try again.";
  if (m.includes("invalid") && m.includes("code"))
    return "That code doesn’t look right. Double-check your email and try again.";
  if (m.includes("expired"))
    return "That code has expired. Request a new one and try again.";
  return msg;
}
