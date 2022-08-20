import ShareIcon from "@mui/icons-material/Share";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from "@mui/icons-material/Home";
import TabletAndroidIcon from "@mui/icons-material/TabletAndroid";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import StayCurrentLandscapeIcon from "@mui/icons-material/StayCurrentLandscape";
import LinkIcon from "@mui/icons-material/Link";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useSnackbar } from "/components/SnackBar";
import { Dialog, Transition } from "@headlessui/react";

import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";
import { useState, Fragment, useRef } from "react";

export default function MainToolbar({ event, baseUrl }) {
  const snackbar = useSnackbar();
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const url = `${baseUrl}/${event.slug}`;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(url);
    snackbar.info(`Copied ${url}`);
  };

  const [shareMessage, setShareMessage] = useState();

  return (
    <div className="w-full shadow-sm border-b bg-white sticky top-0 z-50 h-auto md:h-16">
      <div classes="sm:px-0">
        <div className="flex flex-col md:flex-row justify-between divide-x h-auto md:h-16 ">
          <div className="flex flex-col md:flex-row flex-grow sm:flex-row text-center sm:text-left items-center sm:space-x-4 px-4 md:px-6 space-y-3 md:space-y-0 py-4 md:py-0">
            <div className="flex flex-row flex-grow w-full md:w-auto">
              <div className="hidden md:flex flex-row space-x-4">
                <IconButton>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton color="primary">
                  <HomeIcon />
                </IconButton>
              </div>
              <div className="flex flex-row bg-gray-100 py-2 md:pl-8 pr-4 rounded-md h-12 md:h-10 space-x-4 items-center justify-start md:justify-center w-full">
                <div className="flex flex-col flex-grow md:mr-6  text-center md:text-left">
                  <span className="font-semibold text-[11px] mb-[1px]">
                    Your {event.type.name} Website
                  </span>
                  <a
                    className="text-[10px] whitespace-nowrap overflow-ellipsis"
                    href={url}
                  >
                    {url}
                  </a>
                </div>
                {/* <KeyboardArrowDownIcon /> */}
              </div>
            </div>

            <div className="flex flex-row space-x-2">
              <Button
                variant="outlined"
                sx={{ p: 1, px: 2, fontSize: 12 }}
                fullWidth={false}
                size="small"
                startIcon={<LinkIcon />}
                onClick={copyUrlToClipboard}
              >
                <span>Copy Link</span>
              </Button>
              <Button
                variant="contained"
                sx={{ p: 1, px: 2, fontSize: 12 }}
                fullWidth={false}
                size="small"
                href={url}
                target="_blank"
              >
                <span className="hidden sm:block">Preview Website</span>
                <span className="sm:hidden">Preview</span>
              </Button>

              <Button
                variant="contained"
                sx={{ p: 1, px: 2, fontSize: 12, display: { md: "none" } }}
                fullWidth={false}
                size="small"
                startIcon={<ShareIcon />}
                onClick={() => setOpen(true)}
              >
                Share
              </Button>
            </div>
            {/* <div className="md:hidden flex flex-row space-x-2">
              <Button
                variant="outlined"
                sx={{ p: 1, px: 2, fontSize: 12 }}
                fullWidth={false}
                size="medium"
                startIcon={<LinkIcon />}
                onClick={copyUrlToClipboard}
              >
                Copy Link
              </Button>
              <Button
                variant="contained"
                sx={{ p: 1, px: 2, fontSize: 12 }}
                fullWidth={false}
                size="medium"
                href={url}
                target="_blank"
              >
                Preview
              </Button>

              <Button
                variant="contained"
                sx={{ p: 1, px: 2, fontSize: 12 }}
                fullWidth={false}
                size="medium"
                startIcon={<ShareIcon />}
                onClick={() => setOpen(true)}
              >
                Share
              </Button>
            </div> */}
          </div>
          {/* <div className="hidden md:flex items-center px-4 flex-row space-x-4 w-auto">
            <IconButton color="primary">
              <PersonalVideoIcon />
            </IconButton>
            <IconButton>
              <TabletAndroidIcon />
            </IconButton>
            <IconButton>
              <PhoneIphoneIcon />
            </IconButton>
            <IconButton>
              <StayCurrentLandscapeIcon />
            </IconButton>
          </div> */}
          <div className="hidden md:flex flex-row space-x-4 items-center px-6 w-1/4">
            <Button
              variant="contained"
              sx={{ p: 1, fontSize: 12 }}
              fullWidth={true}
              size="small"
              startIcon={<ShareIcon />}
              onClick={() => setOpen(true)}
            >
              Share Website
            </Button>
            {/* <Button
            variant="contained"
            sx={{ p: 1, fontSize: 12 }}
            fullWidth={true}
            size="small"
          >
            Preview Website
          </Button> */}
          </div>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Share your website
                    </Dialog.Title>
                    <label>
                      <textarea
                        placeholder="Type a message..."
                        // value="Type a message..."
                        defaultValue={shareMessage}
                        onChange={(v) => setShareMessage(v.target.value)}
                        cols={10}
                        className="rounded border mt-8 "
                      />
                    </label>

                    <div className="mt-4 text-center uppercase text-xs">
                      Send via
                    </div>
                    <div className="mt-4 flex flex-row space-x-3 justify-center">
                      <WhatsappShareButton
                        url={url}
                        title={shareMessage}
                        separator=":: "
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                      <FacebookShareButton
                        url={url}
                        quote={shareMessage}
                        hashtag={`#${event.slug}`}
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <FacebookMessengerShareButton url={url} appId={""}>
                        <FacebookMessengerIcon size={32} round />
                      </FacebookMessengerShareButton>
                      <TwitterShareButton url={url} title={shareMessage}>
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <EmailShareButton
                        url={url}
                        subject={event.title ?? ""}
                        body={shareMessage}
                      >
                        <EmailIcon size={32} round />
                      </EmailShareButton>
                      <TelegramShareButton url={url} title={shareMessage}>
                        <TelegramIcon size={32} round />
                      </TelegramShareButton>
                      <LinkedinShareButton url={url}>
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 mx-auto flex items-center justify-center">
                  <Button
                    variant="outlined"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                    fullWidth={false}
                  >
                    Close
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
