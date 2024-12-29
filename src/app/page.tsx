"use client";
import { useAuth } from "@clerk/nextjs";
import Cta from "./_components/Cta";
import FeatureSection from "./_components/Features";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import Navbar from "./_components/Navbar";
import Pricing from "./_components/Pricing";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard"); // Redirect after successful sign-in
    }
  }, [isSignedIn, router]);
  return (
    <div>
      <Navbar />
      <Hero />
      <FeatureSection />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  );
}
