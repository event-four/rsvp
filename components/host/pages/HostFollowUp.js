import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import { createRef, useState, useRef, Fragment, useEffect, memo } from "react";
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
import * as XLSX from "xlsx";

const randomQuestions = [
  { question: "Will you attend the Ceremony?", description: "", type: "yesno" },
  {
    question: "Will you attend the Traditional Wedding?",
    description: "",
    type: "yesno",
  },
  { question: "Do you want the Asoebi?", description: "", type: "yesno" },
];
const randomQuestionsOthers = [
  { question: "Will you attend the Ceremony?", description: "", type: "yesno" },
];

const WZFollowUpPage = ({ event, show = false }) => {
  const [suggestedQuestions, setSuggestedQuestions] = useState(
    event.type.name === "Wedding" ? randomQuestions : randomQuestionsOthers
  );
  const [questions, setQuestions] = useState([]);
  const [inputQ, setInputQ] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const inputDialogRef = useRef(null);
  const { data, loading, error } = useFetchRsvpQuestions(event);
  const snackbar = useSnackbar();

  useEffect(() => {
    if (data) {
      setQuestions(data.questions ?? []);
    }
  });

  const insertNewQuestion = (question) => {
    //check if we already have this question.
    const exists = questions.find((q) => q.question === question);

    if (exists) {
      snackbar.show("You already have this question.");
      return;
    }
    //remove the question from the suggestions list.
    const remainingQuestions = suggestedQuestions.filter(
      (q) => q.question !== question
    );
    //update the suggestions list.
    setSuggestedQuestions([...remainingQuestions]);
    //insert the question into questions list.
    questions.push({ question: question });
    modifyQuestion(questions);
  };

  const showQuestionDialog = (q) => {
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
      questions.push({ question: inputQ, description: "", type: "yesno" });
    } else {
      questions[questionIndex] = {
        ...questions[questionIndex],
        question: inputQ,
      };
    }
    modifyQuestion(questions);
    setOpen(false);
  };

  const deleteQuestion = (question) => {
    const updateQuestionList = questions.filter((q) => q.question !== question);
    modifyQuestion(updateQuestionList);
  };

  const modifyQuestion = (questions) => {
    const payload = data;
    data.questions = questions;

    postRsvpQuestions(payload)
      .then((response) => {
        console.log(response);
        setQuestions([...questions]);
      })
      .catch((error) => {
        snackbar.error(error.message);
      });
  };

  const getSuggestedQ = () => {
    const unAdded = [];
    suggestedQuestions.map((qs) => {
      const exists = questions.find((mq) => mq.question === qs.question);

      if (!exists) {
        unAdded.push(qs);
      }
    });

    return unAdded;
  };

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

  return (
    <div className={`${show ? "flex" : "hidden"}  flex-col space-y-4`}>
      <h1 className="text-lg font-semibold">Follow-Up</h1>
      <div className="text-gray-700 text-sm">Your follow-up questions.</div>
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
                  onClick={() => deleteQuestion(q.question)}
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

      {suggestedQuestions.length > 0 && (
        <>
          {getSuggestedQ().length > 0 && (
            <div className="pt-6 pb-2x text-gray-700 text-sm">
              We've suggested some follow-up questions for you.
            </div>
          )}
          <ul className="flex flex-col space-y-2 w-full">
            {getSuggestedQ().map((q, index) => (
              <li
                key={`${q.question}-${index}`}
                className="border rounded pl-4 pr-2 md:px-4 py-2 text-sm inline-flex justify-between items-center hover:cursor-pointer hover:border-default"
              >
                <div className="flex flex-grow text-gray-500 mr-2">
                  {q.question}
                </div>
                {/* <div className="hidden md:flex space-x-1 items-center justify-center">
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: 12, px: 2, py: 1 }}
                        onClick={() => insertNewQuestion(index)}
                        startIcon={<AddCircleOutlineIcon />}
                      >
                        Add Question
                      </Button>
                    </div> */}
                <div className=" flex space-x-1 items-center justify-center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: 12, px: 2, py: 1 }}
                    onClick={() => insertNewQuestion(q.question)}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Add
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
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
    </div>
  );
};

export default memo(WZFollowUpPage);
