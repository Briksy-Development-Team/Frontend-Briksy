import CustomSelect from "../../custom/DropDown/DropDown";

type Option = {
  value: number;
  label: string;
};

type MinMaxRangeProps = {
  options: Option[];
  value: [number, number];
  onChange: (v: [number, number]) => void;
  idPrefix: string;
};

export default function MinMaxRange({
  options,
  value: [min, max],
  onChange,
}: MinMaxRangeProps) {
  const handleMinChange = (value: number) => {
    if (max !== 0 && value > max) {
      onChange([value, value]);
    } else {
      onChange([value, max]);
    }
  };

  const handleMaxChange = (value: number) => {
    if (value !== 0 && value < min) {
      onChange([value, value]);
    } else {
      onChange([min, value]);
    }
  };

  return (
    <div className="flex gap-3">
      
      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          Min
        </label>

        <CustomSelect
          options={options}
          value={min}
          onChange={handleMinChange}
          placeholder="Any"
        />
      </div>

      
      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          Max
        </label>

        <CustomSelect
          options={options}
          value={max}
          onChange={handleMaxChange}
          placeholder="No limit"
        />
      </div>
    </div>
  );
}