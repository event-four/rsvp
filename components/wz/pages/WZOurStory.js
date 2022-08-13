import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import { useRef, createRef, useState, useEffect } from "react";
import { eventService, useFetchEventStory } from "/services";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Section from "../Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import { TextInput } from "@/components/form";
import { Form } from "@unform/web";
import RichText from "@/components/form/RichText";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../SnackBar";
import { QuillNoSSRWrapper } from "@/components/form/RichText";

export default function WZOurStory({ event, pageTitle }) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [coverMedia, setCoverMedia] = useState(event.coverMedia);
  const [story, setStory] = useState("");
  const uploaderRef = createRef();
  const formRef = useRef();
  const storyRef = createRef();
  const snackbar = useSnackbar();
  const { data: dbStory, loading, error } = useFetchEventStory(event.slug);

  useEffect(() => {
    if (dbStory) {
      setCoverMedia(dbStory.photo);
    }
  });

  const startUpload = () => {
    uploaderRef.current.click();
  };

  const onUploaded = (res) => {
    // console.log(res);
    setCoverMedia(res);

    eventService.updateEventStory({
      eventId: event.id,
      photo: {
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
    eventService.updateEventStory({
      eventId: event.id,
      photo: null,
    });
  };

  async function handleSubmit(data) {
    setShowSpinner(true);
    try {
      const title = data.title;
      console.log(title);
      if (title === "" || story === "") {
        snackbar.error("Please enter a title and your story.");
        setShowSpinner(false);
        return;
      }
      await eventService.updateEventStory({
        eventId: event.id,
        story: story,
        title: title,
      });

      snackbar.show("Story updated successfully");
      // Validation passed - do something with data
    } catch (err) {
      const errors = {};
      // Validation failed - do show error
      console.log(err);
    }
    setShowSpinner(false);
  }

  return (
    <>
      <h1 className="text-lg font-semibold">{pageTitle}</h1>
      <Section title="">
        <div
          className={`relative block w-full border-1 border-gray-100 rounded-lg text-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center h-48 overflow-clip mb-4 ${
            coverMedia ? "sm:pt-4x" : "py-16x"
          } ${coverMedia ? "border" : "border border-dashed"}`}
        >
          <Upload
            id={uploaderRef}
            onUploaded={onUploaded}
            setShowSpinner={setShowSpinner}
            saveAs={`${event.slug}-our-story`}
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
                <span className="mt-2 mx-6 block text-xs font-medium text-gray-500">
                  Add a photo <small>(10mb max)</small>
                </span>
              </div>
            </button>
          )}

          {coverMedia && (
            <div className="relative h-full w-full">
              {coverMedia.resource_type === "image" && (
                <div className="absolute inset-0 z-0 max-h-48 overflow-clip rounded-lg">
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
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`flex flex-col justify-between w-full`}
          autoComplete="off"
        >
          <div className="flex flex-col mb-4">
            <TextInput
              label="Story Title"
              type="text"
              name="title"
              classes="rounded-l-none "
              placeholder=" "
              defaultValue={dbStory ? dbStory.title : ""}
            />
          </div>

          {/* <div className="flex h-auto"> */}
          {!loading && (
            // <QuillNoSSRWrapper defaultValue={dbStory ? dbStory.story : ""} />
            <RichText
              defaultValue={dbStory ? dbStory.story : ""}
              onChange={(content) => setStory(content)}
              style={{ width: "100%" }}
              placeholder="Tell your beautiful story here..."
              toolbar={[
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
              ]}
            />
          )}

          <div className="mt-4 flex justify-center">
            <LoadingButton loading={showSpinner} type="submit">
              Save Story
            </LoadingButton>
            {/* <Button loading={showSpinner} type="submit">
              Save my Story
            </Button> */}
          </div>
        </Form>
      </Section>
    </>
  );
}
