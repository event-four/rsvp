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

import * as yup from "yup";
import { userService, dataService } from "/services";
import {
  usePostGalleryPhoto,
  useFetchVendorGallery,
  useDeleteGalleryPhoto,
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
  const [vendorProfile, setVendorProfile] = useState();
  const [gallery, setGallery] = useState([]);
  const [toDelete, setToDelete] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useFetchVendorGallery(vendor.id);

  useEffect(() => {
    if (data) {
      setGallery(data);
    }
  }, [data]);

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
      setGallery(res.data);
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
      const gs = gallery.filter((g) => g.id !== galleryItem.id);
      setGallery([...gs]);
    } catch (error) {
      console.log(error);
    }
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
          <div className="container py-2 mx-auto">
            <div className="grid grid-cols-3 gap-2 gap-y-2">
              {gallery &&
                gallery.map((g, index) => (
                  <div key={index} className="flex flex-wrap  ">
                    <div className="w-full h-40 relative">
                      <img
                        alt="gallery"
                        className="block object-cover object-center w-full h-full rounded-md"
                        src={g.photo.thumbnail}
                      />

                      <div className="absolute top-4 right-4 p-1  flex items-center justify-center h-8 w-8">
                        {g == toDelete ? (
                          <div className="loader"></div>
                        ) : (
                          <div className="bg-white bg-opacity-60 rounded-full ">
                            <IconButton
                              onClick={() => deletePhoto(g)}
                              aria-label="delete"
                              size="small"
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
                    <div>
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
        <section className="overflow-hidden text-gray-700 mt-6">
          <p>Videos</p>
          <small className="text-xs text-gray-400">
            Add YouTube videos of your past work.
          </small>
        </section>
      </div>
    </Section>
  );
};

export default memo(DshVendorGallery);
