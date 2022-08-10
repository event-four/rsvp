import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import { createRef, useState, useRef, Fragment, useEffect } from "react";
import {
  eventService,
  useFetchRsvpQuestions,
  postRsvpQuestions,
} from "/services";
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
import WZGuestsPage from "./WZGuests";
import dayjs from "dayjs";

const randomQuestions = [
  { question: "Will you attend the Ceremony?", description: "" },
  { question: "Will you attend the Traditional Wedding?", description: "" },
  { question: "Do you want the Asoebi?", description: "" },
];

export default function WZRsvpPage({ event, pageTitle }) {
  const [questions, setQuestions] = useState([]);
  const [inputQ, setInputQ] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const inputDialogRef = useRef(null);
  const { data, loading, error } = useFetchRsvpQuestions(event);
  const snackbar = useSnackbar();
  const [showGuests, setShowGuests] = useState(false);

  useEffect(() => {
    if (data) {
      setQuestions(data.questions ?? []);
    }
  });

  const insertNewQuestion = (index) => {
    const qs = randomQuestions[index];
    questions.push(qs);

    modifyQuestion(questions);
  };

  const showQuestionDialog = (q) => {
    console.log(q);
    if (q) {
      setQuestionIndex(questions.indexOf(q));
      setInputQ(q.question);
    } else {
      setQuestionIndex(-1);
    }

    setOpen(true);
  };

  const updateQuestion = () => {
    const isAdding = questionIndex === -1;

    if (isAdding) {
      questions.push({ question: inputQ });
    } else {
      questions[questionIndex] = {
        ...questions[questionIndex],
        question: inputQ,
      };
    }
    modifyQuestion(questions);
    setOpen(false);
  };

  const deleteQuestion = (index) => {
    questions.splice(index, 1);
    modifyQuestion(questions);
  };

  const modifyQuestion = (questions) => {
    const payload = data;
    data.questions = questions;

    postRsvpQuestions(payload)
      .then((response) => {
        setQuestions([...questions]);
      })
      .catch((error) => {
        snackbar.error(error.message);
      });
  };

  return (
    <>
      <h1 className="text-lg font-semibold">{pageTitle}</h1>
      <Section title="Your Events" classes="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center rounded text-gray-600 border items-center px-3 py-5 flex flex-col">
            <EventIcon sx={{ fontSize: 36 }} />
            <p className="mb-1 text-sm">Wedding Day</p>
            <span className=" items-center text-xs text-gray-500 space-x-2 mt-1 ">
              <EventIcon sx={{ fontSize: 16 }} />
              {"  "}
              {dayjs(event.startDate).format("MMMM DD, YYYY") ??
                " Date to be decided"}
            </span>
            {/* <span className="inline-flex text-xs text-gray-500 mt-1">
              <ScheduleIcon sx={{ fontSize: 16 }} />
              {"  "}
              {event.date ?? " Time to be decided"}
            </span> */}
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
                variant="outlined"
                size="small"
                sx={{ px: 1, py: 0.5, fontSize: 11 }}
                onClick={() => setShowGuests(true)}
              >
                My Guests List
              </Button>
            </div>
          </div>
          {/* <div className="border rounded border-dashed border-gray-200 items-center p-3 text-gray-400 flex flex-col item-center justify-center hover:border-gray-400 hover: cursor: pointer">
            <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
            <span className="text-sm font-normal">Add Event</span>
          </div> */}
        </div>

        {error && <div>{error.message}</div>}
        {loading && <>Loading...</>}

        {/* =================GUESTS======================== */}
        <div
          className={`${showGuests ? "flex" : "hidden"}  flex-col space-y-4`}
        >
          <WZGuestsPage event={event} />
        </div>
        {/* =================GUESTS======================== */}

        <div
          className={`${showGuests ? "hidden" : "flex"}  flex-col space-y-4`}
        >
          <div className="text-gray-700">Your follow-up questions.</div>
          {questions && (
            <ul className="flex flex-col space-y-2 w-full">
              {questions.map((q, index) => (
                <li
                  key={`${q.question}-${index}`}
                  className="border rounded px-2 md:px-4 py-2  text-sm inline-flex justify-between items-center hover:cursor-pointer hover:border-default"
                >
                  {/* <IconButton color="primary"> */}
                  <DragIndicatorIcon />
                  {/* </IconButton> */}
                  <div className="flex flex-grow ml-4">{q.question} </div>
                  <div className="flex space-x-0 md:space-x-1">
                    <IconButton
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                      onClick={() => showQuestionDialog(q)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                      onClick={() => deleteQuestion(index)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                </li>
              ))}
              <li
                key={`q--1`}
                onClick={() => showQuestionDialog(-1)}
                className="border border-dashed rounded px-4 py-2 text-sm inline-flex justify-between items-center hover:cursor-pointer hover:border-default text-gray-500 hover:text-default"
              >
                <div className="flex flex-grow ml-4 items-center justify-center space-x-3 h-10 ">
                  <AddCircleOutlineIcon /> <span>Add Question</span>{" "}
                </div>
              </li>
            </ul>
          )}

          <div className="pt-6 pb-2x text-gray-700">
            We've suggested some follow-up questions for you.
          </div>
          {randomQuestions && (
            <ul className="flex flex-col space-y-2 w-full">
              {randomQuestions.map((q, index) => (
                <li
                  key={`${q.question}-${index}`}
                  className="border rounded md:px-4 py-2 text-sm inline-flex justify-between items-center hover:cursor-pointer hover:border-default"
                >
                  <div className="flex flex-grow ml-4 text-gray-500">
                    {q.question}
                  </div>
                  <div className="hidden md:flex space-x-1 items-center justify-center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: 12, px: 2, py: 1 }}
                      onClick={() => insertNewQuestion(index)}
                      startIcon={<AddCircleOutlineIcon />}
                    >
                      Add Question
                    </Button>
                  </div>
                  <div className="sm:hidden flex space-x-1 items-center justify-center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: 12, px: 2, py: 1 }}
                      onClick={() => insertNewQuestion(index)}
                      startIcon={<AddCircleOutlineIcon />}
                    >
                      Add
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
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
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Follow-Up Question
                    </Dialog.Title>
                    <div className="mt-4">
                      <input
                        className="border w-full rounded text-sm h-12 px-6"
                        ref={inputDialogRef}
                        defaultValue={inputQ}
                        onChange={(v) => setInputQ(v.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 w-full flex flex-row  justify-center space-x-4">
                  <Button
                    variant="outlined"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </Button>
                  <Button onClick={updateQuestion}>Save</Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

// export const getServerSideProps = async ({ req, res }) => {
//   let user = getCookie("E4_UIF", { req, res });
//   user = JSON.parse(user);
//   // console.log("user", user.profile);
//   // return;
//   const url =
//     Urls.event + "?owner=" + user.profile.id + "&publicationState=preview";

//   const headers = {
//     method: "GET",
//     "Content-type": "application/json",
//     Authorization: `Bearer ${user.jwt}`,
//   };

//   const response = await fetch(url, headers);
//   // console.log(response.ok);
//   if (!response.ok) {
//     return { props: {} };
//   }

//   const data = await response.json();
//   // console.log(data);

//   return {
//     props: { events: data.data, baseUrl: process.env.EVENT_WEBSITE_BASE_URL },
//   };
// };
