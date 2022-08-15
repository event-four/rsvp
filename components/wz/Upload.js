import { Spinner } from "./Spinner";
import { Video } from "./Video";

import { useState, useRef, Fragment } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { useDebounceEffect } from "../useDebounceEffect";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CropRotateIcon from "@mui/icons-material/CropRotate";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import CropLandscapeIcon from "@mui/icons-material/CropLandscape";
import CropFreeIcon from "@mui/icons-material/CropFree";
import CropSquareIcon from "@mui/icons-material/CropSquare";
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "px",
        width: 900,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

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
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInput = useRef();
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);
  const [open, setOpen] = useState(false);

  function getExtension(filename) {
    var parts = filename.split(".");
    return parts[parts.length - 1];
  }

  async function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type.includes("image")) {
        setOpen(true);
        setCrop(undefined); // Makes crop preview update between images.
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          setImgSrc(reader.result.toString() || "")
        );
        reader.readAsDataURL(e.target.files[0]);
      } else {
        startUpload(null, await getBase64FromFile(file));
      }
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick(ratio) {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(ratio);
      let crop;
      if (!ratio) {
        crop = centerAspectCrop(width, height, 1);
      } else {
        crop = centerAspectCrop(width, height, ratio);
      }
      setCrop(crop);
    }
  }

  const startUpload = async (file, base64data) => {
    setOpen(false);
    setShowSpinner(true);
    const formData = new FormData();
    formData.set("public_id", saveAs);
    formData.append("inputFile", base64data);
    formData.append("base64data", base64data);

    if (!file && !base64data) return;

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

  const uploadImage = async () => {
    const blobImg = await getCroppedImg(
      imgRef.current,
      completedCrop,
      "avatar"
    );
    const b64 = await getBase64FromBlob(blobImg);
    // upload to supabase
    startUpload(null, b64);
  };

  const getBase64FromBlob = async (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const getBase64FromFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  function getCroppedImg(image, crop, fileName, quality = 0.8) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;

          resolve(blob);
        },
        "image/jpeg",
        quality
      );
    });
  }

  return (
    <div>
      {/* <Spinner displayed={showSpinner} /> */}
      {/* <Video publicId={publicId} /> */}

      <label className={`${"flex flex-col"}`}>
        <input
          ref={props.id}
          type="file"
          onChange={onSelectFile}
          className="hidden"
        />
        {children}
      </label>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-50 inset-0 overflow-y-auto"
          // initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <div className="w-full flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3x text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    ></Dialog.Title>
                    <div className="mt-4x flex flex-col space-y-6">
                      <div className="flex flex-row space-x-4 items-end justify-end">
                        <div>
                          <div className="uppercase text-xs">Rotate</div>
                          <IconButton
                            onClick={() => {
                              setRotate(rotate - 90);
                            }}
                          >
                            <RotateLeftIcon
                              sx={{ fontSize: { xs: 24, sm: 40 } }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setRotate(rotate + 90);
                            }}
                          >
                            <RotateRightIcon
                              sx={{ fontSize: { xs: 24, sm: 40 } }}
                            />
                          </IconButton>
                        </div>
                        <div>
                          <div className="uppercase text-xs">Crop</div>
                          <IconButton
                            sx={{}}
                            onClick={() => handleToggleAspectClick(16 / 9)}
                          >
                            <CropLandscapeIcon
                              color={aspect === 16 / 9 ? "primary" : ""}
                              sx={{ fontSize: { xs: 24, sm: 40 } }}
                            />
                          </IconButton>
                          <IconButton
                            sx={{}}
                            onClick={() => handleToggleAspectClick(9 / 16)}
                          >
                            <CropPortraitIcon
                              color={aspect === 9 / 16 ? "primary" : ""}
                              sx={{ fontSize: { xs: 24, sm: 40 } }}
                            />
                          </IconButton>
                          <IconButton
                            sx={{}}
                            onClick={() => handleToggleAspectClick(1)}
                          >
                            <CropSquareIcon
                              color={aspect === 1 ? "primary" : ""}
                              sx={{ fontSize: { xs: 24, sm: 40 } }}
                            />
                          </IconButton>
                          <IconButton
                            sx={{}}
                            onClick={() => {
                              handleToggleAspectClick(null);
                            }}
                          >
                            <CropFreeIcon
                              color={aspect === 0 ? "primary" : ""}
                              sx={{ fontSize: { xs: 24, sm: 40 } }}
                            />
                          </IconButton>
                        </div>
                      </div>
                      <ReactCrop
                        crop={crop}
                        onChange={(percentCrop) => setCrop(percentCrop)}
                        onComplete={(percentCrop) =>
                          setCompletedCrop(percentCrop)
                        }
                        aspect={aspect}
                      >
                        <img
                          ref={imgRef}
                          alt=""
                          src={imgSrc}
                          style={{
                            transform: `scale(${scale}) rotate(${rotate}deg)`,
                          }}
                          onLoad={onImageLoad}
                        />
                      </ReactCrop>
                    </div>
                  </div>
                </div>
                <div className="mt-5 w-full flex flex-row  justify-center space-x-4">
                  <Button
                    variant="outlined"
                    onClick={() => setOpen(false)}
                    // ref={cancelButtonRef}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!completedCrop?.width || !completedCrop?.height}
                    onClick={uploadImage}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
