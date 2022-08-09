import React from "react";
import Script from "next/script";

const GOOGLE_MAPS_API_KEY = `AIzaSyAzeZKETQGkyXLvLkUGYvjxtKYvBjkOAKo`;

const GooglePlacesScript = () => {
  const source = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  return (
    <Script type="text/javascript" src={source} strategy="beforeInteractive" />
  );
};

export default GooglePlacesScript;
