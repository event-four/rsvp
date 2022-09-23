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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ZPortal from "@/components/Portal";

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

  const [selectedQuestionType, setSelectedQuestionType] = useState("yesno");
  const [questionOptions, setQuestionOptions] = useState([]);

  const handleChange = (event) => {
    setSelectedQuestionType(event.target.value);
  };
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
      setSelectedQuestionType(q.type);

      if (q.type === "multiple") {
        let qs = [];
        qs = q.choice;
        if (q.choice.length === 1) {
          qs.push({});
        } else if (q.choice.length === 0) {
          qs.push({});
          qs.push({});
        }
        setQuestionOptions(qs);
        console.log(questionOptions);
      } else {
        setQuestionOptions([]);
      }
    } else {
      setQuestionIndex(-1);
    }

    setOpen(true);
  };

  const updateQuestion = () => {
    const isAdding = questionIndex === -1;
    let open = false;

    if (isAdding) {
      questions.push({
        question: inputQ,
        description: "",
        type: "yesno",
        choice: questionOptions,
      });
    } else {
      questions[questionIndex] = {
        ...questions[questionIndex],
        question: inputQ,
        type: selectedQuestionType,
        choice: questionOptions,
      };
    }

    //validate multi choice
    if (questions[questionIndex].type === "multiple") {
      const c = questions[questionIndex].choice;
      if (c.length < 2) {
        snackbar.error(
          "Multiple choice questions requires at least two (2) options."
        );
        return;
      }

      for (let cc of c) {
        if (cc.option === "" || cc.option === null) {
          snackbar.error("Option field can not be blank.");
          open = true;
          break;
        }
      }
    } else {
      questions[questionIndex].choice = [];
    }

    modifyQuestion(questions);
    setOpen(open);
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

  const updateQuestionOption = (value, optionIndex, field) => {
    questionOptions[optionIndex][field] = value;
  };

  const addQuestionOption = () => {
    questionOptions.push({});
    setQuestionOptions([...questionOptions]);
  };

  const onDeleteOption = (optionIndex) => {
    if (questionOptions.length < 3) {
      return;
    }
    const qo = questionOptions.splice(optionIndex, 1);
    setQuestionOptions([...qo]);
  };

  const onSelectedQuestionType = (type) => {
    if (type === "multiple") {
      setQuestionOptions([{}, {}]);
    } else {
      setQuestionOptions([]);
    }

    setSelectedQuestionType(type);
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

      {/* ================= ADD Question DIALOG =================== */}
      <ZPortal
        title="Follow-Up Question"
        open={open}
        onClose={() => setOpen(false)}
        positiveLabel="Save"
        positiveOnClick={updateQuestion}
      >
        <>
          <div className="mt-3 text-center sm:mt-5">
            <div className="mt-4 flex flex-col items-start text-sm">
              <input
                className="border w-full rounded text-sm h-12 px-6"
                ref={inputDialogRef}
                placeholder="Enter question"
                defaultValue={inputQ}
                onChange={(v) => setInputQ(v.target.value)}
              />
              <p className="mt-4 mb-2 text-gray-500">Type of response</p>
              <div className="text-sm flex flex-row w-full justify-between ">
                <input
                  type="radio"
                  id="yesno"
                  // checked={() => onSelectedQuestionType("yesno")}
                  onChange={() => onSelectedQuestionType("yesno")}
                  value="yesno"
                  name="radio-buttons"
                />
                <label className="mr-4 ml-1" htmlFor="yesno">
                  Yes/No
                </label>
                <input
                  type="radio"
                  id="short"
                  // checked={() => onSelectedQuestionType("short")}
                  onChange={() => onSelectedQuestionType("short")}
                  value="short"
                  name="radio-buttons"
                />
                <label className="mr-4 ml-1" htmlFor="short">
                  Short Answer
                </label>
                <input
                  type="radio"
                  id="multiple"
                  // checked={() => onSelectedQuestionType("multiple")}
                  onChange={() => onSelectedQuestionType("multiple")}
                  value="multiple"
                  name="radio-buttons"
                />
                <label className="mr-4 ml-1" htmlFor="multiple">
                  Multiple Choice
                </label>
              </div>
              {selectedQuestionType === "multiple" && (
                <div className="flex flex-col space-y-2 w-full mt-6">
                  {questionOptions.map((option, i) => (
                    <OptionItem
                      key={i}
                      option={option.option}
                      description={option.description}
                      onChangeOption={(v) =>
                        updateQuestionOption(v.target.value, i, "option")
                      }
                      onChangeDescription={(v) =>
                        updateQuestionOption(v.target.value, i, "description")
                      }
                      onDeleteOption={() => onDeleteOption(i)}
                    />
                  ))}

                  <div className=" flex space-x-1 items-center justify-center">
                    <li
                      key={`qx--1`}
                      onClick={() => addQuestionOption()}
                      className="border border-dashed rounded px-4 py-2 text-sm inline-flex justify-between items-center hover:cursor-pointer hover:border-default text-gray-500 hover:text-default w-full"
                    >
                      <div className="flex flex-grow ml-4 items-center justify-center space-x-3 h-10 ">
                        <AddCircleOutlineIcon /> <span>Add Option</span>{" "}
                      </div>
                    </li>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      </ZPortal>
    </div>
  );
};

const OptionItem = ({
  option,
  description,
  onChangeOption,
  onChangeDescription,
  onDeleteOption,
}) => {
  return (
    <div className="flex flex-row space-x-6 items-start">
      <div className="flex flex-col w-full space-y-2 mb-4">
        <input
          className="border w-full rounded text-sm h-10 px-6"
          placeholder="Option*"
          defaultValue={option}
          onChange={onChangeOption}
        />
        <textarea
          className="border w-full rounded text-sm h-10x px-6 bg-transparent"
          placeholder="Description"
          defaultValue={description}
          onChange={onChangeDescription}
          rows={3}
        />
      </div>

      <IconButton
        variant="outlined"
        sx={{ p: { xs: 0.5, sm: 1 } }}
        onClick={onDeleteOption}
      >
        <ClearIcon />
      </IconButton>
    </div>
  );
};
export default memo(WZFollowUpPage);
