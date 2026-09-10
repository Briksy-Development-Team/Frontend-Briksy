type Props = {
  features: string[];
};

const PlanFeatures = ({ features }: Props) => {
  return (
    <div className="mt-5 space-y-2.5">
      {features.map((feature) => (
        <div
          key={feature}
          className="flex items-start gap-2 text-xs leading-5"
        >
          <span className="mt-[1px] shrink-0">
            ✓
          </span>

          <span>{feature}</span>
        </div>
      ))}
    </div>
  );
};

export default PlanFeatures;