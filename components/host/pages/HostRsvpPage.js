import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import {
  createRef,
  useState,
  useRef,
  Fragment,
  useEffect,
  useCallback,
} from "react";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Section from "../Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AddIconFill from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { CheckIcon } from "@heroicons/react/outline";
import { useSnackbar } from "/components/SnackBar";
import WZGuestsPage from "./HostGuests";
import WZResponsesPage from "./HostResponses";
import WZFollowUpPage from "./HostFollowUp";
import dayjs from "dayjs";
import { Divider } from "@mui/material";

export default function WZRsvpPage({ event, pageTitle }) {
  const [subPage, setSubPage] = useState(1);

  return (
    <>
      <h1 className="text-lg font-semibold">{pageTitle}</h1>
      <Section title="" classes="space-y-6">
        <div className="flex flex-row mt-3 space-x-4">
          <Button
            size="small"
            variant={subPage === 1 ? "contained" : "outlined"}
            sx={{ px: 1, py: 0.5, fontSize: 11 }}
            onClick={() => setSubPage(1)}
          >
            My Guests List
          </Button>
          <Button
            variant={subPage === 2 ? "contained" : "outlined"}
            size="small"
            sx={{ px: 1, py: 0.5, fontSize: 11 }}
            onClick={() => setSubPage(2)}
          >
            Follow-up
          </Button>
          <Button
            variant={subPage === 3 ? "contained" : "outlined"}
            size="small"
            sx={{ px: 1, py: 0.5, fontSize: 11 }}
            onClick={() => setSubPage(3)}
          >
            Responses
          </Button>
        </div>
        <Divider />
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center rounded text-gray-600 border items-center px-3 py-5 flex flex-col">
            <EventIcon sx={{ fontSize: 36 }} />
            <p className="mb-1 text-sm">Wedding Day</p>
            <span className=" items-center text-xs text-gray-500 space-x-2 mt-1 ">
              <EventIcon sx={{ fontSize: 16 }} />
              {"  "}
              {event.startDate
                ? dayjs(event.startDate).format("MMMM DD, YYYY")
                : " Date to be decided"}
            </span>

            <div className="flex flex-row mt-3 space-x-4">
              <Button
                variant="outlined"
                size="small"
                sx={{ px: 1, py: 0.5, fontSize: 11 }}
                onClick={() => setShowGuests(false)}
              >
                Follow-up
              </Button>
              <Button
                size="small"
                sx={{ px: 1, py: 0.5, fontSize: 11 }}
                onClick={() => setShowGuests(true)}
              >
                My Guests List
              </Button>
            </div>
          </div>
        </div> */}

        {/* {error && <div>{error.message}</div>}
        {loading && <>Loading...</>} */}

        {/* =================SUB PAGES======================== */}

        <WZGuestsPage show={subPage === 1} event={event} />
        <WZFollowUpPage show={subPage === 2} event={event} />
        <WZResponsesPage show={subPage === 3} event={event} />

        {/* =================SUB PAGES======================== */}
      </Section>
    </>
  );
}
