"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Input } from "./components/input";
import { Button } from "./components/button";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Basic client-side validation before hitting the API
    if (!trimmedUsername || !trimmedPassword) {
      setErrorMessage("Username and password are required.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        // eslint-disable-next-line no-console
        console.error("Login API error:", body?.error || response.statusText);
        setErrorMessage("Something went wrong. Please try again.");
        return;
      }

      const result = (await response.json()) as { isAdmin?: boolean; role?: string | null };

      if (result.role === "admin" || result.isAdmin) {
        setErrorMessage(null);
        router.push("/pages/admin");
      } else if (result.role === "user") {
        setErrorMessage(null);
        router.push("/pages/user");
      } else {
        setErrorMessage("Invalid username or password.");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Unexpected login error:", err);
      setErrorMessage("Unable to log in right now. Please try again later.");
      router.push("/user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-linear-to-br from-slate-50 via-white to-sky-50 px-4 min-h-screen">
      {/* Ambient background accent */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="-z-10 fixed inset-0 flex justify-center items-center pointer-events-none"
      >
        <div className="bg-sky-100/70 blur-3xl rounded-full w-72 h-72" />
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-md p-8 border border-slate-100 rounded-3xl w-full max-w-md"
      >
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
          className="flex justify-center items-center bg-sky-50 shadow-sm mx-auto mb-6 rounded-2xl w-12 h-12 text-sky-500"
        >
          <BadgeCheck className="w-6 h-6" />
        </motion.div>

        {/* Heading */}
        <div className="space-y-1 mb-8">
          <h1 className="font-semibold text-slate-900 text-xl text-center tracking-tight">
            Attendance System
          </h1>
          <p className="text-slate-500 text-sm text-center">
            Sign in to access your dashboard and manage attendance.
          </p>
        </div>

        {/* Login form */}
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08, delayChildren: 0.12 },
            },
          }}
          className="space-y-6"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="space-y-1.5"
          >
            <label htmlFor="username" className="font-medium text-slate-700 text-xs">
              Username
            </label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="password" className="font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                className="font-medium text-[0.7rem] text-slate-500 hover:text-slate-900 transition"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>

          {errorMessage && (
            <motion.p
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              className="text-red-500 text-xs text-center"
            >
              {errorMessage}
            </motion.p>
          )}

          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </motion.div>
        </motion.form>
      </motion.main>
    </div>
  );
}
