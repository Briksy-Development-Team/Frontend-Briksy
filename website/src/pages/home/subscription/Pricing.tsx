import  {  useState } from "react";

const plans = [
  {
    id: 1,
    badge: "Seekers",
    title: "Bronze",
    price: "$0",
    description: "Free forever",
    features: [
      "Full property search access",
      "Contact up to 5 agents/month",
      "Save up to 10 listings",
      "Email OTP verification",
      "Basic support",
    ],
  },
  {
    id: 2,
    badge: "Most Popular",
    title: "Silver",
    price: "$149",
    description: "per month",
    features: [
      "Everything in Bronze",
      "Up to 5 staff seats",
      "ABN-verified agency profile",
      "Unlimited listing management",
      "Visitor analytics",
      "Priority support",
    ],
  },
  {
    id: 3,
    badge: "Agencies & Builders",
    title: "Gold",
    price: "$399",
    description: "per month",
    features: [
      "Everything in Silver",
      "Unlimited staff seats",
      "Premium directory placement",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "Custom onboarding",
    ],
  },
];

const Pricing = () => {
  const [planType, setPlanType] = useState("agency");
  const [activeCard, setActiveCard] = useState(2);

  return (
    <section className="w-full  px-[5%] py-28 lg:py-[15rem]">
      <div className="flex flex-col items-center text-center">
        <p className="text-[0.875rem] uppercase tracking-widest text-[#8A8A84]">Subscription Plans</p>
        <h1 className=" lg:mt-[2rem] text-primary">
          <span className="block font-inter text-[2.25rem] lg:text-[8rem] font-medium lg:leading-[7.5rem]">Simple, transparent</span>
          <span className="block font-instrument text-[2.25rem] lg:text-[7rem] italic lg:leading-[7rem]">pricing.</span>
        </h1>
        <p className="mt-[2.5rem] lg:w-[70%] text-[1.125rem] lg:text-[1.5rem] text-[#8A8A84]">
          No hidden fees. No surprises. Choose a plan that fits your workflow — upgrade or downgrade any time.
          All plans include ABN verification, Stripe-managed billing, and access to our full marketplace.
        </p>
      </div>

      <div className=" mt-[2rem] lg:mt-[3rem] flex justify-center">
        <div className="inline-flex rounded-full border border-[#E5E5DE] bg-[#F7F7F4] p-[0.35rem]">
          {["agency", "agent"].map((type) => (
            <button
              key={type}
              onClick={() => setPlanType(type)}
              className={`rounded-full px-[2rem] py-[0.8rem] text-[1rem] capitalize transition-all duration-300 ${planType === type ? "bg-primary text-white" : "text-[#8A8A84]"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[3rem] lg:mt-[5rem] grid grid-cols-1 gap-[2rem] lg:grid-cols-3">
        {plans.map((plan) => {
          const on = activeCard === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setActiveCard(plan.id)}
              className={`flex min-h-[620px] cursor-pointer flex-col justify-between rounded-[1.8rem] border border-[#E5E5DE] p-[2rem] transition-all duration-500 ease-out will-change-transform
                ${on ? "scale-105 bg-primary" : "scale-95 bg-white"}`}
            >
              <div>
                <span className={`inline-block rounded-full px-[1rem] py-[0.4rem] text-[0.9rem] font-medium transition-colors duration-500
                  ${on ? "bg-white text-primary" : "bg-[#F3F3EE] text-[#6B6B6B]"}`}>
                  {plan.badge}
                </span>

                <h2 className={`mt-[1.5rem] text-[2.5rem] transition-colors duration-500 ${on ? "text-white" : "text-primary"}`}>
                  {plan.title}
                </h2>

                <h3 className={`mt-[1rem] text-[4rem] font-semibold leading-none transition-colors duration-500 ${on ? "text-white" : "text-primary"}`}>
                  {plan.price}
                </h3>

                <p className={`mt-[0.5rem] transition-colors duration-500 ${on ? "text-[#D8E2D3]" : "text-[#777777]"}`}>
                  {plan.description}
                </p>

                <div className={`mt-[2rem] h-[1px] w-full transition-colors duration-500 ${on ? "bg-[#4B6145]" : "bg-[#E5E5DE]"}`} />

                <ul className="mt-[2rem] flex flex-col gap-[1rem]">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-[0.7rem] text-[1rem] transition-colors duration-500 ${on ? "text-[#F2F2F2]" : "text-[#4B4B4B]"}`}>
                      <span>✓</span><span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`mt-[3rem] w-full rounded-[1rem] py-[1rem] text-[1rem] font-medium transition-colors duration-500
                ${on ? "bg-white text-primary" : "bg-primary text-white"}`}>
                Get Started
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
