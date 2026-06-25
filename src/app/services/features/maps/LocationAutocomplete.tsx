import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "./googleMapsLoader";

export type LocationSelection = {
  address_line_1?: string;
  address_line_2?: string;
  address?: string;
  full_address?: string;
  formatted_address?: string;
  place_id?: string;
  latitude?: number | null;
  longitude?: number | null;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  location_verified?: boolean;
};

type Props = {
  value?: string;
  onChange: (value: string) => void;
  onSelect: (selection: LocationSelection) => void;
  label?: string;
  placeholder?: string;
  error?: string;
};

const getComponent = (components: any[] | undefined, type: string) =>
  components?.find((component) => component.types.includes(type))?.long_name ?? "";

const LocationAutocomplete = ({
  value,
  onChange,
  onSelect,
  label = "Address",
  placeholder = "Search for an address",
  error,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);

  useEffect(() => {
    let autocomplete: any = null;
    let active = true;

    loadGoogleMapsScript()
      .then(() => {
        if (!active || !inputRef.current || !window.google?.maps?.places) {
          return;
        }

        autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ["address_components", "formatted_address", "geometry", "place_id", "name"],
          types: ["address"],
          componentRestrictions: { country: "au" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();

          if (!place) {
            return;
          }

          const components = place.address_components ?? [];
          const streetNumber = getComponent(components, "street_number");
          const route = getComponent(components, "route");
          const locality = getComponent(components, "locality") || getComponent(components, "sublocality");
          const state = getComponent(components, "administrative_area_level_1");
          const postcode = getComponent(components, "postal_code");
          const country = getComponent(components, "country") || "Australia";
          const latitude = place.geometry?.location?.lat?.() ?? null;
          const longitude = place.geometry?.location?.lng?.() ?? null;
          const formattedAddress = place.formatted_address ?? place.name ?? value ?? "";
          const addressLine1 = [streetNumber, route].filter(Boolean).join(" ").trim() || formattedAddress;

          onChange(formattedAddress);
          onSelect({
            address_line_1: addressLine1,
            address: addressLine1,
            full_address: formattedAddress,
            formatted_address: formattedAddress,
            place_id: place.place_id,
            latitude,
            longitude,
            suburb: locality,
            state,
            postcode,
            country,
            location_verified: latitude !== null && longitude !== null,
          });
        });
      })
      .catch((error: unknown) => {
        setScriptError(error instanceof Error ? error.message : "Google Maps could not be loaded.");
      });

    return () => {
      active = false;
      if (autocomplete) {
        window.google?.maps?.event?.clearInstanceListeners(autocomplete);
      }
    };
  }, [onChange, onSelect, value]);

  return (
    <div className="fv-row mb-7">
      <label className="form-label">{label}</label>
      <input
        ref={inputRef}
        className="form-control form-control-solid"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {(error || scriptError) && <div className="text-danger fs-7 mt-2">{error ?? scriptError}</div>}
      <div className="text-muted fs-7 mt-2">Manual entry is supported if autocomplete is unavailable.</div>
    </div>
  );
};

export { LocationAutocomplete };
