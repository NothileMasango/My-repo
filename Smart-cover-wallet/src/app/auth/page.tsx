"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(() => router.replace("/dashboard"))
      .catch(() => {});
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-amber-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl gradient-green flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">SC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Cover Wallet</h1>
          <p className="text-gray-500 mt-2">by OM Bank</p>
          <p className="text-sm text-gray-600 mt-3">
            Earn cashback on groceries. Protect your insurance premiums.
          </p>
        </div>

        {/* Amplify Authenticator - Real Cognito auth */}
        <Authenticator
          signUpAttributes={["email"]}
          components={{
            Header() {
              return <div className="text-center pb-4"><h2 className="text-xl font-bold text-gray-800">Sign In</h2></div>;
            },
          }}
        >
          {({ user }) => {
            if (user) router.replace("/dashboard");
            return <div className="text-center p-4"><p>Redirecting to dashboard...</p></div>;
          }}
        </Authenticator>

        <p className="text-xs text-gray-400 text-center mt-6">
          Available exclusively to OM Bank customers with active Old Mutual policies
        </p>
      </div>
    </div>
  );
}
