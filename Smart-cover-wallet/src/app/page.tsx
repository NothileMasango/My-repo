"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(() => router.replace("/dashboard"))
      .catch(() => router.replace("/auth"));
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">SC</span>
        </div>
        <p className="text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
