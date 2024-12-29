import React from "react";
import { Github, Bot, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white">
      {/* Background Decorative Elements */}
      <div className="bg-grid-slate-100 absolute inset-0 bg-top opacity-50 [mask-image:linear-gradient(180deg,white,transparent)]" />
      <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 opacity-30 blur-3xl">
        <div className="aspect-square h-96 animate-pulse rounded-full bg-gradient-to-br from-violet-500 to-purple-400" />
      </div>
      <div className="absolute bottom-0 left-0 -translate-x-16 translate-y-16 opacity-30 blur-3xl">
        <div className="aspect-square h-80 rounded-full bg-gradient-to-br from-purple-400 to-violet-500" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8">
        {/* Centered Content */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          {/* Badge/Label */}
          <div className="mb-8 inline-flex items-center rounded-full bg-violet-100 px-4 py-1 text-violet-700 shadow-sm">
            <Bot className="mr-2 h-4 w-4 animate-bounce" />
            <span className="text-sm font-medium">
              AI-Powered GitHub Analysis
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 lg:text-6xl">
            Transform Your
            <span className="relative mx-2 whitespace-nowrap bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              GitHub Workflow
            </span>
            with AI
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            Leverage cutting-edge AI to analyze repositories, optimize code
            quality, and accelerate development with real-time insights and
            recommendations.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={"/sign-up"}>
              <button className="flex items-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:from-violet-500 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            <button className="flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {[
            {
              icon: <Bot className="h-8 w-8 text-violet-600" />,
              title: "AI Code Analysis",
              description:
                "Get instant insights on code quality, security vulnerabilities, and performance optimizations.",
            },
            {
              icon: <Sparkles className="h-8 w-8 text-violet-600" />,
              title: "Smart Recommendations",
              description:
                "Receive personalized suggestions to improve your codebase and development practices.",
            },
            {
              icon: <Github className="h-8 w-8 text-violet-600" />,
              title: "GitHub Integration",
              description:
                "Seamlessly connects with your repositories for real-time analysis and monitoring.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-100 to-violet-200">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-violet-600">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
