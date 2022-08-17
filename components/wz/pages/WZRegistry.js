import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import { createRef, useState } from "react";
import { eventService } from "/services";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Section from "../Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
// var paystack = require("paystack-api")
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

export default function WZRegistry({ event, pageTitle, pss }) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [coverMedia, setCoverMedia] = useState(event.coverMedia);
  const uploaderRef = createRef();

  const activateCashRegistry = () => {
    // paystack.page
    //   .list()
    //   .then(function (body) {
    //     console.log(body);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  return (
    <>
      <h1 className="text-lg font-semibold">{pageTitle}</h1>
      <Section title="Your Registry">
        {/* <div
          className={`relative block w-full border-1 border-gray-100 rounded-lg text-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 items-center h-80 overflow-clip border" `}
        >
          <Button onClick={activateCashRegistry}>Activate Cash Registry</Button>
        </div> */}
        <div className="flex flex-col space-y-2 my-12 justify-center items-center">
          <CardGiftcardIcon color="primary" sx={{ fontSize: 80 }} />
          <span>Coming Soon!</span>
        </div>
      </Section>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  return {
    props: { pss: process.env.PAYSTACK_SECRET },
  };
};
