"use client";
import { useQuery } from "react-query";
import { Input, Spinner } from "@nextui-org/react";
import { debounce } from "@/lib/utils";
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useCallback,
} from "react";

interface LocationSuggestion {
  place_id: string;
  display_name: string;
}

interface LocationSearchInputProps {
  onLocationSelected: (location: string) => void;
  defaultValue?: string;
}

const fetchLocationSuggestions = async (
  query: string
): Promise<LocationSuggestion[]> => {
  if (query.length < 3) return [];
  const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const response = await fetch(
    `https://api.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&limit=5`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const CustomFormLocationInput: React.FC<LocationSearchInputProps> = ({
  onLocationSelected,
  defaultValue,
}) => {
  const [query, setQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>(defaultValue ?? ""); // Initialize inputValue with defaultValue
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions based on the debounced query value, not the immediate input value
  const { data: suggestions, isFetching } = useQuery(
    ["locationSuggestions", query],
    () => fetchLocationSuggestions(query),
    {
      enabled: query.length > 2,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    setShowSuggestions(!!suggestions && suggestions.length > 0);
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelection = (suggestion: LocationSuggestion) => {
    onLocationSelected(suggestion.display_name);
    setInputValue(suggestion.display_name); // Use setInputValue here
    setShowSuggestions(false);
  };

  // Use the useCallback hook with an empty dependency array to ensure the debounced function doesn't get recreated on every render
  const debouncedFetchSuggestions = useCallback(
    debounce((nextValue) => setQuery(nextValue), 600),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setInputValue(nextValue); // Update the raw input value instantly
    debouncedFetchSuggestions(nextValue); // Debounce the fetch operation
  };

  useEffect(() => {
    setInputValue(defaultValue ?? ""); // Set inputValue to defaultValue when defaultValue changes
  }, [defaultValue]);

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        fullWidth
        label="Location"
        placeholder="Enter your City"
        type="text"
        value={inputValue}
        defaultValue={defaultValue}
        onChange={handleChange}
        className="w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onFocus={() => setShowSuggestions(true)}
        endContent={isFetching ? <Spinner /> : null}
      />
      {showSuggestions && (
        <ul className="absolute z-20 w-full mt-1 overflow-y-auto bg-white shadow-md dark:bg-black max-h-60">
          {suggestions?.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
              onClick={() => handleLocationSelection(suggestion)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomFormLocationInput;
