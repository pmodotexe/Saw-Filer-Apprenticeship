
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

function PricingSection({ 
  tiers, 
  className,
  title = "Simple, transparent pricing",
  description,
  billingPeriodLabels = { monthly: "Monthly", yearly: "Yearly" },
  billingFrequencyLabels = { monthly: "/month", yearly: "/year" }
}) {
  const [isYearly, setIsYearly] = useState(false)

  const buttonStyles = {
    default: cn(
      "h-12 bg-white dark:bg-zinc-900",
      "hover:bg-zinc-50 dark:hover:bg-zinc-800",
      "text-zinc-900 dark:text-zinc-100",
      "border border-zinc-200 dark:border-zinc-800",
      "hover:border-zinc-300 dark:hover:border-zinc-700",
      "shadow-sm hover:shadow-md",
      "text-sm font-medium",
    ),
    highlight: cn(
      "h-12 bg-zinc-900 dark:bg-zinc-100",
      "hover:bg-zinc-800 dark:hover:bg-zinc-300",
      "text-white dark:text-zinc-900",
      "shadow-[0_1px_15px_rgba(0,0,0,0.1)]",
      "hover:shadow-[0_1px_20px_rgba(0,0,0,0.15)]",
      "font-semibold text-base",
    ),
  }

  const badgeStyles = cn(
    "px-4 py-1.5 text-sm font-medium",
    "bg-zinc-900 dark:bg-zinc-100",
    "text-white dark:text-zinc-900",
    "border-none shadow-lg",
  )
  
  const handleRegisterClick = () => {
    window.open('https://app.smartsheet.com/b/form/8316a4445300487cbf556d013b0e6fc1', '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      className={cn(
        "relative bg-transparent text-foreground",
        "py-12 px-4 md:py-16 lg:py-20",
        "overflow-hidden",
        className,
      )}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-4xl font-bold text-slate-900 text-center">
            {title}
          </h2>
          {description && <p className="text-lg text-slate-600 max-w-2xl text-center">{description}</p>}
          <div className="inline-flex items-center p-1.5 bg-white dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm mt-4">
            {Object.entries(billingPeriodLabels).map(([key, label]) => (
              <div key={key} className="relative">
                <button
                  onClick={() => setIsYearly(key === "yearly")}
                  className={cn(
                    "px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 relative overflow-hidden",
                    (key === "yearly") === isYearly
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100"
                  )}
                >
                  {/* Subtle shimmer effect for One-Time Payment when not selected */}
                  {key === "yearly" && !isYearly && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent opacity-60" 
                      style={{
                        animation: "shimmer-slide 4s ease-in-out infinite"
                      }}
                    />
                  )}
                  
                  <span className="relative z-10 font-semibold">{label}</span>
                </button>
                
                {/* Only show savings badge when yearly is NOT selected */}
                {key === 'yearly' && !isYearly && (
                  <Badge className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-semibold bg-green-500 text-white border-none shadow-lg whitespace-nowrap animate-bounce">
                    Save $1,500!
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative group backdrop-blur-sm",
                "rounded-3xl transition-all duration-300",
                "flex flex-col",
                tier.highlight
                  ? "bg-gradient-to-b from-blue-50/80 to-transparent"
                  : "bg-white/60",
                "border",
                tier.highlight
                  ? "border-blue-400/50 shadow-xl"
                  : "border-zinc-200/80 shadow-md",
                "hover:-translate-y-2 hover:shadow-2xl",
              )}
            >
              {tier.badge && isYearly && (
                <div className="absolute -top-4 left-6">
                  <Badge className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white border-none shadow-lg">{tier.badge}</Badge>
                </div>
              )}

              <div className="p-8 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      tier.highlight
                        ? "bg-blue-100 text-blue-600"
                        : "bg-zinc-100 text-zinc-600",
                    )}
                  >
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 text-right">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">
                      ${isYearly ? tier.price.yearly.toLocaleString() : tier.price.monthly.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-500">
                      {isYearly ? billingFrequencyLabels.yearly : billingFrequencyLabels.monthly}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                      <div
                        className={cn(
                          "mt-1 p-0.5 rounded-full transition-colors duration-200",
                          feature.included
                            ? "text-blue-600"
                            : "text-zinc-400",
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {feature.name}
                        </div>
                        {feature.description && (
                          <div className="text-sm text-slate-500">
                            {feature.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Button
                  onClick={handleRegisterClick}
                  className={cn(
                    "w-full relative transition-all duration-300",
                    tier.highlight
                      ? "h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_1px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_1px_20px_rgba(59,130,246,0.5)] font-semibold text-base"
                      : "h-12 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md text-sm font-medium"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { PricingSection }
