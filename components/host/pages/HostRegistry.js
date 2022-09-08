import { createRef, useRef, useEffect, useState, memo } from "react";
import { eventService, useFetchEventRegistry } from "/services";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Section from "../Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
// var paystack = require("paystack-api")
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Form } from "@unform/web";
import { LoadingButton } from "@mui/lab";
import { TextInput, TextArea } from "@/components/form";
import { useSnackbar } from "../../SnackBar";

const WZRegistry = ({ event, pageTitle, pss }) => {
  const { data: registry, loading, error } = useFetchEventRegistry(event.slug);
  const [showCashRegistryForm, setShowCashRegistryForm] = useState(false);
  const [cashRegistry, setCashRegistry] = useState();
  const [giftRegistry, setGiftRegistry] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const snackbar = useSnackbar();

  const formRef = useRef();

  useEffect(() => {
    if (registry) {
      const cashR = registry.find((r) => r.type === "cash");
      const giftR = registry.filter((r) => r.type === "gift");
      setCashRegistry(cashR);
      setGiftRegistry([...giftR]);
    }
  }, [registry]);

  async function handleSubmit(data) {
    const { accountName, accountNumber, bank, routingCode, otherInfo } = data;
    console.log(data);
    data.routingCode = routingCode === "" ? null : routingCode;
    data.otherInfo = otherInfo === "" ? null : otherInfo;

    try {
      if (accountName === "" || accountNumber === "" || bank === "") {
        snackbar.error("The fields marked * are required.");
        return;
      }

      setShowSpinner(true);
      let res;

      if (cashRegistry) {
        res = await updateData({ data, active: true });
      } else {
        res = await createData({ data, type: "cash", eventId: event.id });
      }

      const record = res;
      setCashRegistry(record);
      setShowCashRegistryForm(false);
      snackbar.show("Registry details updated successfully.");
      // Validation passed - do something with data
    } catch (err) {
      const errors = {};
      // Validation failed - do show error
      console.log(err);
      snackbar.error(err.message, "Oops! an error occurred.");
    }

    setShowSpinner(false);
  }

  const deactivateCashRegistry = async () => {
    const data = cashRegistry;
    data.active = false;

    await eventService
      .updateRegistryData(data, data.id)
      .then((res) => {
        setCashRegistry(res.data);
        setShowCashRegistryForm(false);
      })
      .catch((error) => {
        snackbar.error(err.message, "Oops! an error occurred.");
      });
  };

  const createData = async (data) => {
    return await eventService
      .postRegistryData(data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  };
  const updateData = async (data) => {
    return await eventService
      .updateRegistryData(data, cashRegistry.id)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const CashRegistryBox = ({ onClick }) => {
    return (
      <div className="flex flex-col space-y-4 my-12 justify-center items-center">
        <MonetizationOnIcon color="primary" sx={{ fontSize: 80 }} />
        <Button variant="outlined" onClick={onClick}>
          Activate Cash Gifts
        </Button>
      </div>
    );
  };

  return (
    <>
      <h1 className="text-lg font-semibold">{pageTitle}</h1>
      <Section title="">
        <div className="flex flex-col space-y-2 my-12 justify-center items-center">
          <CardGiftcardIcon color="primary" sx={{ fontSize: 80 }} />
          <span>Gift Registry Coming Soon!</span>
        </div>
      </Section>
      <Section title="">
        {(!cashRegistry || (cashRegistry && !cashRegistry.active)) &&
          !showCashRegistryForm && (
            <CashRegistryBox onClick={() => setShowCashRegistryForm(true)} />
          )}

        <div>
          {((cashRegistry && cashRegistry.active) || showCashRegistryForm) && (
            <>
              <div className="flex flex-row items-center justify-between">
                <MonetizationOnIcon color="primary" sx={{ fontSize: 40 }} />
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium leading-6 text-gray-900">
                    Cash Gift Registry
                  </h2>
                </div>
                {showCashRegistryForm ? (
                  <IconButton
                    variant="outlined"
                    onClick={() => setShowCashRegistryForm(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    variant="outlined"
                    onClick={() => setShowCashRegistryForm(true)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </div>

              <p className="my-4 max-w-2xl text-sm text-gray-500">
                Your guests will send cash gifts to the account details below.
              </p>
            </>
          )}
          {showCashRegistryForm && (
            <div className="overflow-hidden bg-white  sm:rounded-lg">
              <Form
                ref={formRef}
                onSubmit={handleSubmit}
                className={`flex flex-col justify-between w-full space-y-3`}
                autoComplete="off"
              >
                <TextInput
                  name="accountName"
                  label="Account Name *"
                  defaultValue={
                    cashRegistry ? cashRegistry.data.accountName : null
                  }
                />
                <TextInput
                  name="accountNumber"
                  type="number"
                  label="Account Number *"
                  defaultValue={
                    cashRegistry ? cashRegistry.data.accountNumber : null
                  }
                />
                <TextInput
                  name="bank"
                  label="Bank Name *"
                  defaultValue={cashRegistry ? cashRegistry.data.bank : null}
                />
                <TextInput
                  name="routingCode"
                  label="Bank Routing Number/ Swift Code"
                  defaultValue={
                    cashRegistry ? cashRegistry.data.routingCode : null
                  }
                />
                <TextInput
                  name="otherInfo"
                  label="Other Information"
                  defaultValue={
                    cashRegistry ? cashRegistry.data.otherInfo : null
                  }
                />

                <div className="mt-6 flex justify-center">
                  <div className="my-5 flex flex-col space-y-4">
                    <LoadingButton loading={showSpinner} type="submit">
                      Save Changes
                    </LoadingButton>
                    {cashRegistry && cashRegistry.active && (
                      <Button
                        variant="text"
                        type="button"
                        onClick={deactivateCashRegistry}
                      >
                        Deactivate Cash Gifts
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          )}
          {cashRegistry && !showCashRegistryForm && (
            <div className="">
              {cashRegistry.active && (
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Account Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {cashRegistry.data.accountName}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Account Number
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {cashRegistry.data.accountNumber}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Bank Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {cashRegistry.data.bank}
                      </dd>
                    </div>
                    {cashRegistry.data.routingCode && (
                      <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Bank Routing Number/ Swift Code
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {cashRegistry.data.routingCode}
                        </dd>
                      </div>
                    )}
                    {cashRegistry.data.otherInfo && (
                      <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Other Information
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {cashRegistry.data.otherInfo}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

export default memo(WZRegistry);

export const getServerSideProps = async ({ req, res }) => {
  return {
    props: { pss: process.env.PAYSTACK_SECRET },
  };
};
