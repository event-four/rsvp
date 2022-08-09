import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import TextInput from "../form/TextInput";
import { useEffect, useState } from "react";
const PlacesAutocomplete = ({ ...props }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  // useEffect(() => {
  //   if (props.defaultValue) {
  //     setValue(props.defaultValue, false);
  //   }
  // }, [value]);
  const [place, setPlace] = useState(props.defaultValue);

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setPlace(e.target.value);
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      console.log(description);
      setPlace(description);
      setValue(description, false);

      clearSuggestions();

      // Get latitude and longitude via utility functions
      // getGeocode({ address: description }).then((results) => {
      //   const { lat, lng } = getLatLng(results[0]);
      //   console.log("📍 Coordinates: ", { lat, lng });
      // });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          className="p-3 border-b"
          key={place_id}
          onClick={handleSelect(suggestion)}
        >
          <strong className="text-sm">{main_text}</strong>{" "}
          <small className="text-gray-500">{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref} className="relative">
      <TextInput
        name={props.name}
        label={props.label}
        value={place}
        onChange={handleInput}
        disabled={!ready}
        placeholder={props.placeholder}
      />

      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <ul className="absolute bg-white z-[100] border  border-gray-300 rounded-md mt-1">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
