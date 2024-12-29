import { CheckIcon, DollarSign, Tag, Zap } from "lucide-react";

const tiers = [
  {
    name: "Hobby",
    id: "tier-hobby",
    href: "#",
    priceMonthly: "$0",
    description:
      "Perfect for individual developers looking to explore our AI capabilities.",
    features: [
      "5 repositories",
      "500 AI analysis credits/month",
      "Basic code analytics",
      "Community support",
      "GitHub integration",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: "$29",
    description:
      "Ideal for professional developers and small teams seeking advanced features.",
    features: [
      "25 repositories",
      "1200 AI analysis credits/month",
      "Advanced code analytics",
      "24-hour support response time",
      "Priority queue processing",
      "Custom AI model training",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "$99",
    description: "Dedicated support and infrastructure for your organization.",
    features: [
      "Unlimited repositories",
      "Unlimited AI analysis credits",
      "Custom analytics dashboard",
      "Dedicated support representative",
      "Advanced security features",
      "Custom integrations",
      "On-premise deployment option",
      "SLA guarantees",
    ],
    featured: false,
  },
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingSection() {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center rounded-full bg-violet-100 px-4 py-1 text-violet-700">
          <Tag className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">Pricing Plan</span>
        </div>
        {/* <h2 className="text-base/7 font-semibold text-violet-600">
          Pricing Plans
        </h2> */}
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Choose the perfect plan for your needs
        </h2>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8">
        From individual developers to enterprise teams, we have a plan that
        matches your AI-powered development needs. Start free and scale as you
        grow.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-7xl lg:grid-cols-3">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? "relative bg-gray-900 shadow-2xl"
                : "bg-white/60 sm:mx-4 lg:mx-0",
              tier.featured
                ? "lg:z-10"
                : tierIdx === 0
                  ? "lg:rounded-r-none"
                  : tierIdx === 2
                    ? "lg:rounded-l-none"
                    : "",
              "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10",
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? "text-violet-400" : "text-violet-600",
                "text-base/7 font-semibold",
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? "text-white" : "text-gray-900",
                  "text-5xl font-semibold tracking-tight",
                )}
              >
                {tier.priceMonthly}
              </span>
              <span
                className={classNames(
                  tier.featured ? "text-gray-400" : "text-gray-500",
                  "text-base",
                )}
              >
                /month
              </span>
            </p>
            <p
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-6 text-base/7",
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-8 space-y-3 text-sm/6 sm:mt-10",
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(
                      tier.featured ? "text-violet-400" : "text-violet-600",
                      "h-6 w-5 flex-none",
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? "bg-violet-500 text-white shadow-sm hover:bg-violet-400 focus-visible:outline-violet-500"
                  : "text-violet-600 ring-1 ring-inset ring-violet-200 hover:ring-violet-300 focus-visible:outline-violet-600",
                "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10",
              )}
            >
              {tier.name === "Hobby" ? "Get started for free" : "Get started"}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
