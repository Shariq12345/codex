"use client";
import React, { useState } from "react";
import {
  Bot,
  Code2,
  Shield,
  LineChart,
  GitBranch,
  Zap,
  ChevronRight,
  Terminal,
} from "lucide-react";

const FeatureSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Smart Code Analysis",
      description:
        "Advanced AI algorithms analyze your code in real-time, identifying patterns, potential bugs, and optimization opportunities.",
      demo: (
        <div className="rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-300">
          <div className="mb-2 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-violet-400" />
            <span className="text-violet-400">AI Analysis Result</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Code quality score: 94/100</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">!</span>
              <span>Potential memory leak detected in line 42</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">i</span>
              <span>Suggested optimization: Use memoization</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Scanning",
      description:
        "Continuous security monitoring of your repositories to identify vulnerabilities and suggest security improvements.",
      demo: (
        <div className="space-y-3 rounded-lg bg-gray-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-green-400">Dependencies: Secure</span>
            <Shield className="h-4 w-4 text-green-400" />
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-700">
            <div className="h-full w-[95%] bg-gradient-to-r from-green-400 to-green-500" />
          </div>
          <div className="text-sm text-gray-400">Last scan: 2 minutes ago</div>
        </div>
      ),
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Performance Metrics",
      description:
        "Track and visualize your codebase performance with detailed analytics and actionable insights.",
      demo: (
        <div className="rounded-lg bg-gray-900 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-2 w-24 rounded bg-violet-400" />
              <div className="h-2 w-16 rounded bg-violet-300" />
              <div className="h-2 w-20 rounded bg-violet-200" />
            </div>
            <LineChart className="h-16 w-16 text-violet-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded bg-gray-800 p-2">
              <div className="text-violet-400">Response Time</div>
              <div className="text-white">124ms</div>
            </div>
            <div className="rounded bg-gray-800 p-2">
              <div className="text-violet-400">Memory Usage</div>
              <div className="text-white">45MB</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "Branch Management",
      description:
        "Intelligent branch management suggestions and automated code review process.",
      demo: (
        <div className="rounded-lg bg-gray-900 p-4">
          <div className="mb-4 flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-violet-400" />
            <span className="text-violet-400">main</span>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span className="text-gray-300">feature/ai-integration</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded bg-gray-800 p-2">
              <span className="text-white">Conflict Risk</span>
              <span className="text-green-400">Low</span>
            </div>
            <div className="flex items-center justify-between rounded bg-gray-800 p-2">
              <span className="text-white">Auto-merge Ready</span>
              <span className="text-violet-400">Yes</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-violet-100 px-4 py-1 text-violet-700">
            <Zap className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Powerful Features</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to optimize your workflow
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered tools help you write better code, maintain security,
            and ship faster.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Feature Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full rounded-xl p-4 text-left transition-all ${
                    activeFeature === index
                      ? "border-violet-100 bg-violet-50 shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex items-center gap-4 ${
                      activeFeature === index
                        ? "text-violet-600"
                        : "text-gray-600"
                    }`}
                  >
                    {feature.icon}
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p
                        className={`mt-1 text-sm ${
                          activeFeature === index
                            ? "text-violet-600"
                            : "text-gray-500"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feature Demo */}
          <div className="flex flex-col lg:col-span-2">
            <div className="aspect-video rounded-2xl bg-gradient-to-b from-violet-50 to-white p-8 shadow-lg ring-1 ring-gray-200">
              <div className="h-full w-full transform transition-all duration-500">
                {features[activeFeature]?.demo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
