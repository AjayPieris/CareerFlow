"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleIcon from "../../../../public/google.png";
import Icon from "../../../../public/careerflow-mark.svg";

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(
        clerkErr.errors?.[0]?.message ?? "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef1f5] p-4">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* ── LEFT PANEL ── */}
        <div className="w-full md:w-1/2 p-10 flex flex-col">
          {/* Heading */}
          <div className="flex-1 flex flex-col justify-center ali max-w-sm mx-auto w-full">
            <h1 className="text-3xl text-gray-800 mb-6 text-center font-extrabold ">
              Career Flow
            </h1>

            {/* Error */}
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
                placeholder="Enter email or username"
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

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-teal-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="#"
                  className="text-sm text-teal-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full py-3.5 rounded-xl bg-teal-400 hover:bg-teal-500 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={!isLoaded}
              className="mt-3 w-full py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-medium text-sm flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
            >
              <Image src={GoogleIcon} alt="Google" width={18} height={18} />
              Sign in with Google
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-teal-500 font-semibold hover:underline"
            >
              Register Now
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
function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("data breach") || m.includes("online data"))
    return "This password has appeared in a known security leak. Try something more unique — mix letters, numbers and a symbol. 🔒";
  if (
    m.includes("password is incorrect") ||
    m.includes("invalid credentials") ||
    m.includes("identifier")
  )
    return "Hmm, that doesn't match our records. Double-check your email and password.";
  if (m.includes("too many") || m.includes("rate limit"))
    return "Too many attempts — please wait a moment and try again.";
  if (m.includes("not found") || m.includes("no account"))
    return "We couldn't find an account with that email. Want to register instead?";
  if (m.includes("locked"))
    return "Your account has been temporarily locked. Please try again later.";
  return msg;
}
