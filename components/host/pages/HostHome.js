import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import { createRef, useState, useRef, memo } from "react";
import { eventService } from "/services";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Section from "../Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import { Form } from "@unform/web";
import { LoadingButton } from "@mui/lab";
import { TextInput, TextArea } from "@/components/form";
import { useSnackbar } from "../../SnackBar";
import WZEditEvent from "@/components/host/pages/HostEditEvent";

const WZHome = ({ event, pageTitle }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [coverMedia, setCoverMedia] = useState(event.coverMedia);
  const uploaderRef = createRef();
  const formRef = useRef();

  const startUpload = () => {
    uploaderRef.current.value = null;
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

  const onDeleteCoverMedia = async () => {
    const cm = coverMedia;
    setShowSpinner(true);

    const response = await fetch("/api/upload?id=" + cm.public_id, {
      method: "DELETE",
    });
    console.log(response);
    if (response.ok) {
      eventService.updateEventData({
        eventId: event.id,
        coverMedia: null,
      });
      setCoverMedia(null);
    }
    setShowSpinner(false);
  };

  async function handleSubmit(data) {
    const { accountName, accountNumber, bank, routingCode, otherInfo } = data;
    console.log(data);

    try {
      if (accountName === "" || accountNumber === "" || bank === "") {
        snackbar.error("The fields marked * are required.");
        return;
      }
      setShowSpinner(true);
      let res;

      if (cashRegistry) {
        res = await updateData({ data, active: true });
      } else {
        res = await createData({ data, type: "cash", eventId: event.id });
      }

      const record = res;
      setCashRegistry(record);
      setShowCashRegistryForm(false);
      snackbar.show("Registry details updated successfully.");
      // Validation passed - do something with data
    } catch (err) {
      const errors = {};
      // Validation failed - do show error
      console.log(err);
      snackbar.error(err.message, "Oops! an error occurred.");
    }

    setShowSpinner(false);
  }

  return (
    <>
      <h1 className="text-lg font-semibold">{pageTitle}</h1>
      <Section title="Cover Media">
        <div
          className={`relative block w-full border-1 border-gray-100 rounded-lg text-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center overflow-clip ${
            coverMedia ? "sm:pt-4x" : "py-16x"
          } ${coverMedia ? "border h-80x" : "border border-dashed h-auto"}`}
        >
          <Upload
            id={uploaderRef}
            onUploaded={onUploaded}
            setShowSpinner={setShowSpinner}
            saveAs={event.slug}
            typeVideo={true}
          />
          {showSpinner && (
            <div className="flex mx-auto justify-center items-center py-16 left-0 right-0 top-0 bottom-0 border border-transparent font-medium rounded-md transition ease-in-out duration-150 cursor-not-allowed flex-col h-full bg-white bg-opacity-80">
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
              className="h-full w-full py-16"
            >
              <div>
                <PermMediaIcon
                  sx={{ fontSize: { xs: 60, sm: 80 } }}
                  className="text-gray-400"
                />
                <span className="mt-2 mx-6 block text-xs font-medium text-gray-500">
                  Add your couple photo or cover video <small>(50mb max)</small>
                  .
                </span>
              </div>
            </button>
          )}

          {coverMedia && !showSpinner && (
            <div className="relativex flex flex-col h-full w-full items-center justify-center">
              {coverMedia.resource_type === "image" && (
                <div className="z-10x rounded-lg">
                  <img
                    className={`${
                      coverMedia.public_id.length === 0
                        ? "hidden"
                        : " h-full w-auto"
                    }`}
                    src={`${coverMedia.secure_url}`}
                  ></img>
                </div>
              )}

              {coverMedia.resource_type === "video" && (
                <div className="">
                  <video
                    className={`${
                      coverMedia.public_id.length === 0 ? "hidden" : "block"
                    } h-full w-auto`}
                    autoPlay
                    controls
                    muted
                    src={`${coverMedia.secure_url}`}
                  ></video>
                </div>
              )}
              <div className="flex flex-row md:hidden space-x-4 my-4">
                <Button
                  size="small"
                  sx={{ p: 1 }}
                  variant="contained"
                  onClick={startUpload}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  sx={{ p: 1 }}
                  variant="outlined"
                  onClick={onDeleteCoverMedia}
                >
                  Delete
                </Button>
              </div>
              <div
                className={`hidden md:opacity-0 md:flex hover:opacity-100 duration-300 md:absolute inset-0 z-10x justify-center items-center text-white font-semibold md:bg-black md:bg-opacity-60 space-x-6 w-full ${
                  coverMedia.resource_type === "video" ? "mb-20 p-6 " : ""
                }`}
              >
                <div className="flex flex-col space-y-2">
                  <Fab color="primary" aria-label="add" onClick={startUpload}>
                    <EditIcon sx={{ fontSize: { xs: 24, md: 40 } }} />
                  </Fab>
                  <span className="font-normal text-sm">Edit</span>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="border border-5 rounded-full p-2 opacity-90 hover:opacity-100 cursor-pointer">
                    <ClearIcon
                      onClick={onDeleteCoverMedia}
                      sx={{ fontSize: { xs: 24, md: 40 } }}
                    />
                  </div>
                  <span className="font-normal text-sm">Delete</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      <WZEditEvent event={event} />
    </>
  );
};

export default memo(WZHome);
