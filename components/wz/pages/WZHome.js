import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import { createRef, useState } from "react";
import { eventService } from "/services";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Section from "../Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";

export default function WZHome({ event, pageTitle }) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [coverMedia, setCoverMedia] = useState(event.coverMedia);
  const uploaderRef = createRef();

  const startUpload = () => {
    uploaderRef.current.click();
  };

  const onUploaded = (res) => {
    // console.log(res);
    setCoverMedia(res);

    eventService.updateEventData({
      eventId: event.id,
      coverMedia: {
        url: res.url,
        secure_url: res.secure_url,
        resource_type: res.resource_type,
        public_id: res.public_id,
        format: res.format,
        bytes: res.bytes,
        asset_id: res.asset_id,
      },
    });
  };

  const onDeleteCoverMedia = () => {
    setCoverMedia(null);
    eventService.updateEventData({
      eventId: event.id,
      coverMedia: null,
    });
  };

  return (
    <>
      <h1 className="text-lg font-semibold">{pageTitle}</h1>
      <Section title="Cover Media">
        <div
          className={`relative block w-full border-1 border-gray-100 rounded-lg text-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center h-80 overflow-clip ${
            coverMedia ? "sm:pt-4x" : "py-16x"
          } ${coverMedia ? "border" : "border border-dashed"}`}
        >
          <Upload
            id={uploaderRef}
            onUploaded={onUploaded}
            setShowSpinner={setShowSpinner}
            saveAs={event.slug}
          />
          {showSpinner && (
            <div className="flex mx-auto justify-center items-center absolute left-0 right-0 top-0 bottom-0 border border-transparent font-medium rounded-md transition ease-in-out duration-150 cursor-not-allowed flex-col h-full bg-white bg-opacity-80">
              <svg
                className="animate-spin h-8 w-8  text-gray-700"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-10"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-100"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-xs text-gray-500 mt-4">Please wait...</p>
            </div>
          )}
          {!coverMedia && !showSpinner && (
            <button
              onClick={startUpload}
              type="button"
              className="h-full w-full"
            >
              <div>
                <PermMediaIcon
                  sx={{ fontSize: { xs: 60, sm: 80 } }}
                  className="text-gray-400"
                />
                <span className="mt-2 block text-xs font-medium text-gray-500">
                  Add your cover video (1 min) or photo.
                </span>
              </div>
            </button>
          )}

          {coverMedia && (
            <div className="relative h-full w-full">
              {coverMedia.resource_type === "image" && (
                <div className="absolute inset-0 z-0 max-h-80 overflow-clip rounded-lg">
                  <img
                    className={`${
                      coverMedia.public_id.length === 0
                        ? "hidden"
                        : "block h-auto w-full mx-auto"
                    }`}
                    src={`${coverMedia.secure_url}`}
                  ></img>
                </div>
              )}

              {coverMedia.resource_type === "video" && (
                <div className="absolute inset-0">
                  <video
                    className={`${
                      coverMedia.public_id.length === 0 ? "hidden" : "block"
                    } h-full w-auto mx-auto`}
                    autoPlay
                    controls
                    muted
                    src={`${coverMedia.secure_url}`}
                  ></video>
                </div>
              )}
              <div className="opacity-0 hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-white font-semibold bg-black bg-opacity-60 space-x-6">
                <div className="flex flex-col space-y-2">
                  <Fab color="primary" aria-label="add" onClick={startUpload}>
                    <EditIcon sx={{ fontSize: 40 }} />
                  </Fab>
                  <span className="font-normal text-sm">Edit</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <div
                    className="border border-5 rounded-full p-2 opacity-90 hover:opacity-100 cursor-pointer"
                    onClick={onDeleteCoverMedia}
                  >
                    <ClearIcon sx={{ fontSize: 40 }} />
                  </div>
                  <span className="font-normal text-sm">Delete</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
