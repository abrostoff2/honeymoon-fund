"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const params = useSearchParams();
  const reason = params.get("reason");
  const email = params.get("email");

  const isNotAuthorized = reason === "not-authorized";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Not Authorized
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {isNotAuthorized && email
                ? `${email} is not on the authorized admin list.`
                : "This account is not authorized to access the admin dashboard."}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={async () => {
                const res = await fetch("/api/auth/csrf");
                const { csrfToken } = await res.json();
                const form = document.createElement("form");
                form.method = "POST";
                form.action = "/api/auth/signout";
                const csrf = document.createElement("input");
                csrf.type = "hidden";
                csrf.name = "csrfToken";
                csrf.value = csrfToken;
                form.appendChild(csrf);
                const cb = document.createElement("input");
                cb.type = "hidden";
                cb.name = "callbackUrl";
                cb.value = "/admin";
                form.appendChild(cb);
                document.body.appendChild(form);
                form.submit();
              }}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Try a different account
            </button>
            <a
              href="/"
              className="block w-full rounded-lg px-6 py-3 text-center text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
            >
              Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
