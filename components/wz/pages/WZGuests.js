import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import { createRef, useState, useRef, Fragment, useEffect } from "react";
import { eventService, useFetchGuests } from "/services";
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

export default function WZGuestsPage({ event }) {
  const [guests, setGuests] = useState([]);
  const [guestsRsvp, setGuestsRsvp] = useState(0);
  const { data, loading, error } = useFetchGuests(event);
  const snackbar = useSnackbar();
  console.log(data);

  useEffect(() => {
    if (data) {
      setGuests(data.guests ?? []);
      const c = data.guests.filter((guest) => guest.rsvp == true).length;
      setGuestsRsvp(c);
    }
  });

  const downloadExcel = () => {
    let list = [];
    data.guests.map((g, index) => {
      list.push({
        "#": index + 1,
        name: g.name,
        email: g.email,
        phone: g.phone,
        attending: g.rsvp,
      });
    });
    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
    XLSX.writeFile(workbook, "MyGuestList.xlsx");
  };

  return (
    <>
      <h1 className="text-lg font-semibold">Guest List</h1>
      <Section title="" classes="space-y-6x p-0">
        {error && <div>{error.message}</div>}
        {loading && <>Loading...</>}

        {/* =================GUESTS======================== */}

        {guests && (
          <>
            <div className="flex items-center justify-between p-2">
              <div className="flex flex-col md:flex-row md:space-x-4 text-sm text-gray-500 md:pl-4">
                <p className="">
                  Total: <span className="text-gray-700">{guests.length}</span>
                </p>
                <p className="">
                  Attending: <span className="text-gray-700">{guestsRsvp}</span>
                </p>
                <p>
                  Not Attending:{" "}
                  <span className="text-gray-700">
                    {guests.length - guestsRsvp}
                  </span>
                </p>
              </div>
              <Button
                variant="outlined"
                size="small"
                onClick={() => downloadExcel()}
              >
                Export to Excel
              </Button>
            </div>
            <div className="overflow-x-auto relative ">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      #
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Name
                    </th>
                    <th scope="col" className="py-3 px-6">
                      RSVP
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Phone
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g, index) => (
                    <tr
                      key={`${g.name.toLowerCase()}-${index} `}
                      className="border-b"
                    >
                      <td scope="row" className="py-4 px-4 text-center">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap py-4 px-6">{g.name}</td>
                      <td className="py-4 px-6">{g.rsvp ? "Yes" : "No"}</td>

                      <td className="whitespace-nowrap py-4 px-6">
                        {g.phone ?? "-"}
                      </td>
                      <td className="py-4 px-6">{g.email ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Section>
    </>
  );
}
