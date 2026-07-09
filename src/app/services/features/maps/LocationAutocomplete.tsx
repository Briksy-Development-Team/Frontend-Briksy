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

const getFriendlyGoogleMapsError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Google Maps could not be loaded.";
  if (/apikey|key/i.test(message)) {
    return "Google Maps API key is missing or invalid.";
  }
  if (/quota|billing|over/i.test(message)) {
    return "Google Maps quota or billing limits were reached. Please try again later.";
  }
  return message;
};

const LocationAutocomplete = ({
  value,
  onChange,
  onSelect,
  label = "Address",
  placeholder = "Search for an address",
  error,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const onSelectRef = useRef(onSelect);
  const sessionTokenRef = useRef<any>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let autocomplete: any = null;
    let active = true;

    loadGoogleMapsScript()
      .then(() => {
        if (!active || !inputRef.current || !window.google?.maps?.places) {
          return;
        }

        sessionTokenRef.current = sessionTokenRef.current ?? new window.google.maps.places.AutocompleteSessionToken();

        autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ["address_components", "formatted_address", "geometry", "place_id", "name"],
          types: ["address"],
          componentRestrictions: { country: "au" },
          sessionToken: sessionTokenRef.current,
        } as any);

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
          const formattedAddress = place.formatted_address ?? place.name ?? valueRef.current ?? "";
          const addressLine1 = [streetNumber, route].filter(Boolean).join(" ").trim() || formattedAddress;

          onChangeRef.current(formattedAddress);
          onSelectRef.current({
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

          sessionTokenRef.current = null;
        });
      })
      .catch((error: unknown) => {
        console.error("Google Maps autocomplete initialization failed.", error);
        setScriptError(getFriendlyGoogleMapsError(error));
      });

    return () => {
      active = false;
      if (autocomplete) {
        window.google?.maps?.event?.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

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
