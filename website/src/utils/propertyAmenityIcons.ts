import { Bathtub01Icon, BedDoubleIcon, Car01Icon, House01Icon } from "@hugeicons/core-free-icons";

export const getPropertyAmenityIcon = (slug = "") => {
  if (/bed|bedroom/.test(slug)) return BedDoubleIcon;
  if (/car|parking|garage/.test(slug)) return Car01Icon;
  if (/living|area|room|study|lounge/.test(slug)) return House01Icon;
  return Bathtub01Icon;
};
