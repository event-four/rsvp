import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "@/components/common/Upload";
import { createRef, useState, useRef, memo, useEffect } from "react";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Section from "@/components/common/Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import { Form } from "@unform/web";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../SnackBar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import ReactPlayer from "react-player/youtube";

import * as yup from "yup";
import { userService, dataService } from "/services";
import {
  usePostGalleryPhoto,
  useFetchVendorGallery,
  useDeleteGalleryPhoto,
  usePostGalleryVideo,
} from "@/services/vendor-service";
import FormCard from "@/components/FormCard";
import FormProvider from "@/components/providers/HostStartFormProvider";
import {
  TextInput,
  SelectInput,
  // Button,
  OutlineButton,
  TextArea,
  ToggleSwitch,
} from "@/components/form";

const schema = yup.object().shape(
  {
    service: yup.string().required("Service category is required."),
    businessName: yup.string().required("Business name is required."),
    state: yup.string().required("Business location is required."),
    whyUnique: yup.string().required("Business value proposal is required."),
  },
  []
);

const DshVendorGallery = ({ pageTitle }) => {
  const user = userService.getUser();
  const vendor = user.vendor_profile;
  const snackbar = useSnackbar();
  const [showSpinner, setShowSpinner] = useState(false);
  const fileChooserRef = useRef();

  const formRef = useRef();
  const videoRef = useRef();
  const [vendorProfile, setVendorProfile] = useState();
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState();
  const [toDelete, setToDelete] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useFetchVendorGallery(vendor.id);

  useEffect(() => {
    if (data) {
      console.log(data);
      const { photos, videos } = filterGallery(data);
      setGallery(photos);
      setVideos(videos);
    }
  }, [data]);

  const filterGallery = (data) => {
    const photos = data.filter((g) => g.type === "photo");
    const videos = data.filter((g) => g.type === "video");

    return { photos, videos };
  };

  const onReady = async (e) => {
    const { files } = e.target;
    if (!files) return;
    const formData = new FormData();
    const data = {
      // title: "abc",
      type: "photo",
      vendor: vendor.id,
    };
    Array.from(files).forEach((file) => {
      formData.append(`files.photo`, file, "bz_gallery_" + vendor.id);
    });

    formData.append("data", JSON.stringify(data));
    setShowSpinner(true);
    try {
      const res = await usePostGalleryPhoto(formData, vendor.id);
      const { photos } = filterGallery(res.data);
      setGallery([...photos]);
    } catch (error) {
      snackbar.error(error.message);
      setShowSpinner(false);
    }
    setShowSpinner(false);
  };

  const deletePhoto = async (galleryItem) => {
    setToDelete(galleryItem);
    try {
      await useDeleteGalleryPhoto({
        mediaId: galleryItem.id,
        vendorId: vendor.id,
        type: galleryItem.type,
      });

      if (galleryItem.type === "photo") {
        const gs = gallery.filter((g) => g.id !== galleryItem.id);
        setGallery([...gs]);
      } else {
        const gs = videos.filter((g) => g.id !== galleryItem.id);
        setVideos([...gs]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addVideo = async () => {
    if (!videoUrl) return;
    setIsLoading(true);
    try {
      const res = await usePostGalleryVideo(
        {
          vendor: vendor.id,
          type: "video",
          video: videoUrl,
        },
        vendor.id
      );

      setVideos([...videos, res.data]);
      setVideoUrl();
      videoRef.current.value = "";
    } catch (error) {
      snackbar.error(error.message);
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  if (!gallery) {
    return <div>Loading...</div>;
  }

  return (
    <Section title={pageTitle}>
      <input
        ref={fileChooserRef}
        className="hidden"
        type="file"
        multiple
        onChange={onReady}
      />
      <div
        ref={formRef}
        className={`flex flex-col justify-between md:mx-auto`}
        autoComplete="off"
      >
        <section className="overflow-hidden text-gray-700 ">
          <p>Photos</p>
          <small className="text-xs text-gray-400">
            Show off your business! Add photos of your past work.
          </small>
          <div className="container pt-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 gap-y-2">
              {gallery &&
                gallery.map((g, index) => (
                  <div key={index} className="flex flex-wrap  ">
                    <div className="w-full h-40 relative">
                      <img
                        alt="gallery"
                        className="block object-cover object-center w-full h-full rounded-md"
                        src={g.photo.small}
                      />

                      <div className="absolute top-4 right-4 p-1  flex items-center justify-center h-8 w-8">
                        {g == toDelete ? (
                          <div className="loader"></div>
                        ) : (
                          <div className="bg-white bg-opacity-80 rounded-full ">
                            <IconButton
                              onClick={() => deletePhoto(g)}
                              aria-label="delete"
                              size="small"
                              color="primary"
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              <div
                className="flex flex-wrap border border-dashed hover:border-default hover:text-default hover:cursor-pointer rounded-md"
                onClick={() => {
                  if (showSpinner) return;
                  fileChooserRef.current.click();
                }}
              >
                <div className="w-full h-40 ">
                  {showSpinner ? (
                    <div className="w-full h-full relative items-center justify-center flex">
                      <div className="loader"></div>
                    </div>
                  ) : (
                    <div className="flex flex-col  items-center justify-center h-full w-full text-gray-400 hover:text-default ">
                      <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                      <span className="text-sm">Add Photo</span>
                      <span className="text-xs">Max. 4MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="border-t my-12 border-gray-100"></div>
        <section className="overflow-hidden text-gray-700 ">
          <div className="flex flex-col md:flex-row md:justify-between md:space-x-8 ">
            <div>
              <p>Videos</p>
              <small className="text-xs text-gray-400">
                Add YouTube videos of your past work.
              </small>
            </div>

            <Form
              ref={formRef}
              onSubmit={addVideo}
              className={`flex flex-row flex-grow space-x-2 items-center justify-start md:justify-end mt-3 md:nt-0`}
              autoComplete="off"
            >
              <input
                ref={videoRef}
                className="w-full md:max-w-xs border rounded px-3 py-3 text-sm focus:outline-none focus:ring-0 focus:border-default"
                placeholder="Enter YouTube Video Url *"
                // value={videoUrl}
                onBlur={(e) => {
                  setVideoUrl(e.target.value);
                }}
              />

              <LoadingButton
                variant="contained"
                loading={isLoading}
                type="submit"
              >
                Add
              </LoadingButton>
            </Form>
          </div>
          <div className="container py-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 gap-y-2">
              {videos &&
                videos.map((g, index) => (
                  <div key={index} className="flex flex-wrap  ">
                    <div className="w-full h-40 relative">
                      <div className="absolute text-center text-2xs text-gray-400 top-[45%] left-0 right-0 items-center justify-center ">
                        Loading video...
                      </div>
                      <div className="block object-cover object-center w-full h-full absolute border ">
                        <ReactPlayer
                          url={g.video}
                          height={"160px"}
                          width={"auto"}
                        />
                      </div>

                      <div className="absolute top-4 right-4 p-1  flex items-center justify-center h-8 w-8">
                        {g == toDelete ? (
                          <div className="loader"></div>
                        ) : (
                          <div className="bg-white bg-opacity-90 rounded-full ">
                            <IconButton
                              onClick={() => deletePhoto(g)}
                              aria-label="delete"
                              size="small"
                              color="primary"
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </Section>
  );
};

export default memo(DshVendorGallery);
