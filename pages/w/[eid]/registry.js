import { useRouter } from "next/router";
import utils from "../../../consts/utils";
import { useState, useEffect } from "react";
import {
  PersonalInfo,
  OtherInfo,
  Confirmation,
  Wish,
} from "../../../components/Rsvp Forms";
import FormCard from "../../../components/FormCard";
import FormProvider from "/components/providers/FormProvider";
import InnerLayout from "../../../components/guests/InnerLayout";
import { useGetRsvpGeneralQuestions } from "../../../swr/useRsvpRequests";
import { eventService, useFetchEventRegistry } from "/services";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { TextInput } from "@/components/form";
import { useSnackbar } from "/components/SnackBar";

const Registry = () => {
  const [ev, setEv] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      const json = await utils.getFromStorage("event");
      setEv(JSON.parse(json));
    }
    fetchEvent();
  }, []);
  if (!ev) return;

  return (
    <InnerLayout>
      <RegistryPageBody event={ev} />
    </InnerLayout>
  );
};

const currencies = [
  { name: "NGN", symbol: "₦" },
  // { name: "USD", symbol: "$" },
];

const RegistryPageBody = ({ event }) => {
  const [cashRegistry, setCashRegistry] = useState();
  const [giftRegistry, setGiftRegistry] = useState();
  const [hasRegistry, setHasRegistry] = useState(false);
  const { data, loading, error } = useFetchEventRegistry(event.slug, false);
  const [activeRegistry, setActiveRegistry] = useState(0);
  const [currency, setCurrency] = useState(currencies[0]);
  const [cashAmount, setCashAmount] = useState();
  const [showAccount, setShowAccount] = useState(false);
  const snackbar = useSnackbar();

  useEffect(() => {
    if (data) {
      console.log(data);
      const csh = data.filter((r) => r.type === "cash");
      const gft = data.filter((r) => r.type === "gift");

      setCashRegistry(csh[0]);
      setGiftRegistry(gft);
      setHasRegistry((csh[0] && csh[0].active) || (gft && gft.length > 0));
    }
  }, [data]);

  const formatAmount = (v) => {
    console.log(v);
    if (!v) return;
    const value = v.replace(/,/g, "");
    v = parseFloat(value).toLocaleString("en-US", {
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

    return v;
  };
  const startPay = async () => {
    await eventService.postCashGift({
      payload: {
        amount: cashAmount,
        charge: 0,
        total: cashAmount,
        event: event.id,
      },
    });
  };

  const DDT = ({ label, value }) => {
    return (
      <div className="bg-gray-50x px-4 py-1 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6 items-center flex flex-col justify-center">
        <dt className="text-sm font-medium text-gray-500 md:text-right sm:col-span-2">
          {label}
        </dt>
        <dd className="mt-1 text-center md:text-start text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex flex-col md:flex-row items-center mb-2">
          {value}

          {label === "Account Number" ? (
            // <div className="ml-2 text-default  flex flex-row space-x-3">
            //   copy
            //   <ContentCopyIcon sx={{ fontSize: 16 }} />
            // </div>
            <Button
              variant="text"
              sx={{ pl: 1, fontSize: 10 }}
              fullWidth={false}
              size="small"
              startIcon={<ContentCopyIcon sx={{ fontSize: 12 }} />}
              onClick={copyUrlToClipboard}
            >
              <span>Copy</span>
            </Button>
          ) : (
            ""
          )}
        </dd>
      </div>
    );
  };

  const copyUrlToClipboard = () => {
    const v = cashRegistry.data.accountNumber;
    navigator.clipboard.writeText(v);
    snackbar.info(`Copied ${v}`);
    startPay();
  };

  function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === "paste") {
      key = event.clipboardData.getData("text/plain");
    } else {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }
  return (
    <>
      <div className=" text-center flex flex-col items-center w-full h-full my-auto mx-auto justify-center">
        <div className="text-center text-primary-dark pt-4 mb-10">
          <p className="text-center page-title font-pacifico text-2xl md:text-5xl mb-4 text-shadow-md">
            Gift Registry
          </p>
          <p className="text-center font-rochester text-lg md:text-3xl my-6">
            {event.title}
          </p>
          {hasRegistry && (
            <p className="align-middle text-center md:max-w-lg mx-auto text-xs mt-6">
              Your love, laughter and company on our wedding day is the greatest
              gift of all. However, should you wish to celebrate us with a gift,
              we have registered some items and cash fund. Thank you!
            </p>
          )}
        </div>
        {hasRegistry && (
          <>
            <div className="flex flex-col space-y-6">
              {/* <p className="text-default text-sm">
            How would you like to celebrate us?
          </p> */}
              <ul
                role="list"
                className="flex flex-row justify-evenly divide-x divide-default rounded-md border border-default"
              >
                <li
                  onClick={() => setActiveRegistry(0)}
                  className={`flex items-center justify-between text-sm cursor-pointer px-4 py-3 font-medium  ${
                    activeRegistry === 0
                      ? "bg-default text-white"
                      : "text-default"
                  }`}
                >
                  Cash Gift
                </li>
                <li
                  onClick={() => setActiveRegistry(1)}
                  className={`flex items-center justify-between text-sm cursor-pointer px-4 py-3 font-medium ${
                    activeRegistry === 1
                      ? "bg-default text-white"
                      : "text-default"
                  }`}
                >
                  Buy a Gift
                </li>
              </ul>
            </div>
            {activeRegistry === 1 && (
              <div className="flex flex-grow flex-col space-y-2 my-12 justify-center items-center">
                <CardGiftcardIcon color="primary" sx={{ fontSize: 50 }} />
                <span>Gift Registry Coming Soon!</span>
              </div>
            )}
            {activeRegistry === 0 && (
              <div className="flex flex-grow items-center justify-center flex-col space-y-6 my-10">
                {!showAccount && (
                  <>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-default"
                      >
                        Enter an amount
                      </label>
                      <div className="relative mt-2 rounded-md shadow-sm bg-defaul">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-default sm:text-lg">
                            {currency.symbol}
                          </span>
                        </div>
                        <input
                          type="text"
                          name="price"
                          id="price"
                          className="block w-full rounded-md border-default p-4 pl-7 pr-12 focus:border-default focus:ring-default sm:text-lg bg-transparent"
                          placeholder="0.00"
                          // defaultValue={formatAmount(cashAmount)}
                          onKeyPress={(e) => validate(e)}
                          onBlur={(e) => {
                            const v = formatAmount(e.target.value);
                            console.log(v);
                            setCashAmount(e.target.value);
                            if (v) {
                              e.target.value = v;
                            }
                          }}
                          autoComplete={"off"}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <label htmlFor="currency" className="sr-only">
                            Currency
                          </label>
                          <select
                            id="currency"
                            name="currency"
                            className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-transparent focus:ring-transparent sm:text-sm"
                            onChange={(e) => {
                              setCurrency(currencies[e.target.value]);
                            }}
                          >
                            {currencies.map((c, index) => (
                              <option key={index} value={index}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <TextInput
                      label="Full Name"
                      type="text"
                      name="name"
                      placeholder=" "
                      defaultValue={""}
                      isInset={true}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        console.log(cashAmount);
                        if (cashAmount && cashAmount > 0) setShowAccount(true);
                      }}
                    >
                      Next
                    </Button>
                  </>
                )}
                {showAccount && (
                  <>
                    <p className="text-xs">
                      Please send your cash gift to our bank account below:
                    </p>
                    <div className="border border-default rounded-lg flex py-4 w-full items center justify-center">
                      <dl>
                        <DDT
                          label="Account Name"
                          value={cashRegistry.data.accountName}
                        />
                        <DDT
                          label="Account Number"
                          value={cashRegistry.data.accountNumber}
                        />
                        <DDT label="Bank Name" value={cashRegistry.data.bank} />
                        {cashRegistry.data.routingCode &&
                          cashRegistry.data.routingCode.length === 0 && (
                            <DDT
                              label="Swift Code"
                              value={cashRegistry.data.routingCode}
                            />
                          )}

                        {cashRegistry.data.otherInfo &&
                          cashRegistry.data.otherInfo.length === 0 && (
                            <DDT
                              label="Other Information"
                              value={cashRegistry.data.otherInfo}
                            />
                          )}
                      </dl>
                    </div>
                    <Button size="small" onClick={() => setShowAccount(false)}>
                      Back
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {!hasRegistry && (
          <>
            <p className="align-middle text-center w-full md:max-w-lg mx-auto">
              Your love, laughter and company on our wedding day is the greatest
              gift of all. However, should you wish to celebrate us with a gift,
              a registry is coming soon!
            </p>

            <div className="flex flex-col mt-7">
              <span className="">Love,</span>
              <span className="text-lg md:text-3xl font-rochester mt-2">
                {event.title}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Registry;
