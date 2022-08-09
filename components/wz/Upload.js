import { Spinner } from "./Spinner";
import { Video } from "./Video";

import { useState } from "react";

export function Upload({
  children,
  onUploaded,
  setShowSpinner,
  saveAs,
  ...props
}) {
  // const [showSpinner, setShowSpinner] = useState(true);
  const [showMedia, setShowMedia] = useState(false);
  const [publicId, setPublicId] = useState("");
  const [mediaType, setMediaType] = useState();

  const onChange = async (event) => {
    setShowSpinner(true);
    event.preventDefault();
    const formData = new FormData();
    formData.set("public_id", saveAs);
    const file = event.target.files[0];
    formData.append("inputFile", file);

    if (!file) return;

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      // console.log(data);
      onUploaded(data);
      setPublicId(data.public_id);
      setMediaType(data.resource_type);
    } catch (error) {
      setShowSpinner(false);
    } finally {
      setShowSpinner(false);
      setShowMedia(true);
    }
  };

  return (
    <div>
      {/* <Spinner displayed={showSpinner} /> */}
      {/* <Video publicId={publicId} /> */}
      <label ref={props.id} className={`${"flex flex-col"}`}>
        <input type="file" onChange={onChange} className="hidden" />
        {children}
      </label>
    </div>
  );
}
