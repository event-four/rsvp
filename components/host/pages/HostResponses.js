import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import { createRef, useState, useRef, Fragment, useEffect, memo } from "react";
import { eventService, useFetchRsvpResponses } from "/services";
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
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { useSnackbar } from "/components/SnackBar";
import * as XLSX from "xlsx";
import dynamic from "next/dynamic";
import ZPortal from "@/components/Portal";

const NextPortal = dynamic(
  () => {
    return import("nextportal/dist/NextPortal");
  },
  { ssr: false }
);
const WZResponsesPage = ({ event, show = false }) => {
  const [responses, setResponses] = useState([]);
  const [portal, showPortal] = useState(false);
  const [open, setOpen] = useState(true);

  const { data, loading, error } = useFetchRsvpResponses(event.id);
  const snackbar = useSnackbar();

  useEffect(() => {
    if (data) {
      let ans = [];
      let tmp = [];

      data.questions.forEach((d) => {
        let q = {
          id: d.id,
          yes: 0,
          no: 0,
          null: 0,
          question: d.question,
          type: d.type,
          personsYes: [],
          personsNo: [],
          personsNull: [],
        };

        //check responses for answers to this id.
        data.answers.forEach((a) => {
          const resObj = a.response;
          const ans = resObj[q.id];

          switch (ans) {
            case true:
              q.yes = q.yes + 1;
              q.personsYes.push(a.guest);
              break;
            case false:
              q.no = q.no + 1;
              q.personsNo.push(a.guest);
              break;
            default:
              q.null = q.null + 1;
              q.personsNull.push(a.guest);
              break;
          }

          // console.log(q);
        });

        tmp.push(q);
      });

      console.log(tmp);
      setResponses([...tmp]);
    }
  }, [data]);

  const downloadExcel = () => {
    let list = [];
    guests.map((g, index) => {
      list.push({
        "#": index + 1,
        name: g.name,
        email: g.email,
        phone: g.phone,
        attending: g.rsvp ? "YES" : " NO",
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
    XLSX.writeFile(workbook, "MyGuestList.xlsx");
  };

  const showPortalHandler = () => {
    showPortal(true);
  };

  const hidePortalHandler = () => {
    showPortal(false);
  };
  return (
    <div className={`${show ? "flex" : "hidden"}  flex-col space-y-4`}>
      <h1 className="text-lg font-semibold">Responses</h1>
      {/* <Section title="" classes="space-y-6x p-0"> */}
      {error && <div>{error.message}</div>}
      {loading && <>Loading...</>}
      {/* <button id="button" onClick={() => setOpen(true)}>
        Open portal
      </button> */}

      {/* =================GUESTS======================== */}

      {responses && (
        <>
          {/* <div className="flex items-center justify-between p-2">
              <Button
                variant="outlined"
                size="small"
                onClick={() => downloadExcel()}
              >
                Export to Excel
              </Button>
            </div> */}
          <div className="overflow-x-auto relative flex flex-col space-y-6">
            {responses &&
              responses.length > 0 &&
              responses.map((r, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <p className="font-semibold text-sm">
                    {index + 1}. {r.question}
                  </p>
                  <div className="flex flex-row justify-between border rounded-lg divide-x">
                    <div className="flex flex-col p-2 justify-center text-center flex-grow ">
                      <p className="text-gray-600">
                        <span className="font-semibold text-lg">{r.yes}</span>
                      </p>
                      <p className="text-gray-600 text-sm">Yes</p>
                    </div>
                    <div className="flex flex-col p-2 justify-center text-center flex-grow">
                      <p className="text-gray-600">
                        <span className="font-semibold text-lg">{r.no}</span>
                      </p>
                      <p className="text-gray-600 text-sm">No</p>
                    </div>
                    <div className="flex flex-col p-2 justify-center text-center flex-grow">
                      <p className="text-gray-600">
                        <span className="font-semibold text-lg">{r.null}</span>
                      </p>
                      <p className="text-gray-600 text-sm">No Answer</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
      {/* </Section> */}
      {/* <ZPortal open={open} onClose={() => setOpen(false)}>
        Hello
      </ZPortal> */}
    </div>
  );
};

export default memo(WZResponsesPage);
