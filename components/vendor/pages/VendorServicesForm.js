import PermMediaIcon from "@mui/icons-material/PermMedia";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "@/components/common/Upload";
import { createRef, useState, useRef, memo, useEffect } from "react";
import Button from "@mui/material/Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import Section from "@/components/common/Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import { Form } from "@unform/web";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../SnackBar";
import ZPortal from "@/components/Portal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import * as yup from "yup";
import { userService, dataService } from "/services";
import {
  useUpdateVendorService,
  usePostVendorService,
  useGetVendorServices,
  useUpdateVendorServicePrice,
  useDeleteVendorService,
} from "@/services/vendor-service";
import FormCard from "@/components/FormCard";
import FormProvider from "@/components/providers/HostStartFormProvider";
import {
  TextInput,
  SelectInput,
  // Button,
  OutlineButton,
  TextArea,
  ToggleSwitch,
} from "@/components/form";
import { toMoneyFormat } from "@/helpers/utils";

const schema = yup.object().shape(
  {
    service: yup.string().required("Service category is required."),
    businessName: yup.string().required("Business name is required."),
    state: yup.string().required("Business location is required."),
    whyUnique: yup.string().required("Business value proposal is required."),
  },
  []
);

const DshVendorServicesForm = ({ pageTitle, vendor }) => {
  // const user = userService.getUser();
  // const vendor = user.vendor_profile;
  const serviceCategories = dataService.getServiceCategories();
  const priceUnits = dataService.getPriceUnits();
  const snackbar = useSnackbar();
  const formRef = useRef();
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState();
  const [activeServiceType, setActiveServiceType] = useState();
  const [activePriceUnit, setActivePriceUnit] = useState();
  const [activePricePack, setActivePricePack] = useState();
  const [isEditing, setIsEditing] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openPriceDialog, setOpenPriceDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useGetVendorServices(vendor.id);

  useEffect(() => {
    if (data) {
      console.log(data);
      setServices(data);
      //get state
      // const state = data.state
      //   ? states.find((state) => state.name === data.state)
      //   : null;
      // setStateNg(state);
      // //get logo.
      // if (data.avatar) {
      //   setLogo(data.avatar);
      // }
    }
  }, [data]);

  const checkDuplicates = (array) =>
    array.filter((item, index) => array.indexOf(item) !== index);

  async function handleSubmit(data) {
    //get service ids into array
    var serviceIds = [];
    services.map((s) => serviceIds.push(s.id));

    //check dupes.
    const duplicates = checkDuplicates(serviceIds);
    if (duplicates.length > 0) {
      let item = serviceCategories.find((s) => s.service.id === duplicates[0]);
      snackbar.error(`You have duplicate entries for ${item.name}`);
      return;
    }

    try {
      setIsLoading(true);

      // Validation passed - do something with data
      const payload = [];
      serviceIds.map((i) => {
        payload.push({ vendorId: vendor.id, serviceTypeId: i });
      });

      await useUpdateVendorServices(payload);
      snackbar.show("Services updated successfully.");
      setIsLoading(false);
    } catch (err) {
      const errors = {};
      // Validation failed - do show error
      console.log(err);
      snackbar.error(err.message, "Oops! an error occurred.");
    }

    setIsLoading(false);
  }

  const addNewService = () => {
    setIsEditing(false);
    setActiveServiceType();
    setOpenDialog(true);
  };

  const editService = (index) => {
    const service = services[index];
    setIsEditing(true);
    setActiveService(service);
    setActiveServiceType(service.service);
    setOpenDialog(true);
  };

  const deleteService = async (index) => {
    const service = services[index];
    try {
      await useDeleteVendorService(service.id);
      services.splice(index, 1);
      setServices([...services]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectService = async (service, index) => {
    setActiveServiceType(service);
  };

  const handleAddService = async () => {
    const service = activeServiceType;
    const duplicate = services.find((s) => s.service.id == service.id);

    if (duplicate) {
      snackbar.error(`You have already added ${duplicate.service.name}.`);
      return;
    }

    const payload = { vendorId: vendor.id, serviceTypeId: service.id };

    try {
      var response = await usePostVendorService(payload);
      setServices(response.data);
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const savePriceInfo = async () => {
    const service = services.find((s) => s.id == activeService.id);
    const serviceIndex = services.indexOf(service);

    if (activePricePack.id == -1) {
      service.prices.push({
        ...activePricePack,
        id: service.prices.length + 1,
      });
    } else {
      //find the price pack.
      const pp = service.prices.find((p) => p.id == activePricePack.id);
      const ppIndex = service.prices.indexOf(pp);
      service.prices[ppIndex] = activePricePack;
    }

    //find average price.
    var averagePrice = 0;
    for (const price of service.prices) {
      averagePrice += parseFloat(price.price);
    }
    averagePrice = averagePrice / service.prices.length;

    var minPrice = service.prices.reduce(function (res, obj) {
      return obj.price < res.price ? obj : res;
    });

    // console.log(total);
    services[serviceIndex] = {
      ...service,
      averagePrice: averagePrice,
      startingPrice: minPrice.price,
    };

    const payload = {
      prices: service.prices,
      averagePrice: averagePrice,
      startingPrice: minPrice.price,
      vendorId: vendor.id,
    };

    await useUpdateVendorServicePrice(payload, service.id);

    setServices(services);
    setActivePricePack();
    setOpenPriceDialog(false);
  };

  //openPriceDialog
  const launchPriceDialog = (service, pricePackIndex) => {
    setActiveService(service);

    const pricePack =
      pricePackIndex == -1
        ? { id: -1, name: "", price: null, unit: null, features: [] }
        : service.prices[pricePackIndex];
    console.log(pricePack);

    const priceUnit = priceUnits.find((pu) => pu.name === pricePack.unit);
    setActivePriceUnit(priceUnit);

    setActivePricePack(pricePack);
    setOpenPriceDialog(true);
  };

  const DataCard = ({ label, value }) => {
    return (
      <div className="flex flex-row space-x-2 text-xs">
        <dt className=" font-medium text-gray-500">{label}:</dt>
        <dd className=" text-gray-900 ">{value}</dd>
      </div>
    );
  };

  if (!services) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Section title={pageTitle}>
        <FormProvider>
          <FormCard>
            <Form
              ref={formRef}
              onSubmit={handleSubmit}
              className={`flex flex-col justify-between md:mx-auto md:max-w-2xl`}
              autoComplete="off"
            >
              <div className="flex flex-col space-y-4 md:space-y-4">
                {services &&
                  services.map((s, index) => (
                    <Section key={index} classes="px-4 py-3">
                      <div className="flex flex-row justify-between items-center text-gray-600">
                        <p>{s && s.service ? s.service.name ?? "-" : "-"}</p>
                        <div className="flex flex-row space-x-2">
                          <IconButton onClick={() => deleteService(index)}>
                            <DeleteOutlinedIcon />
                          </IconButton>
                        </div>
                      </div>
                      <div className="flex flex-row space-x-4">
                        <DataCard label="Views" value={s.views} />
                        <DataCard label="Leads" value={s.leads} />
                        <DataCard label="Contracts" value={s.contracts} />
                      </div>
                      <div className="border-t border-gray-100 my-2"></div>
                      <div className="flex flex-col mt-3">
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-row justify-between items-start">
                            <p className="text-sm text-gray-500">Pricing</p>
                            <Button
                              onClick={() => launchPriceDialog(s, -1)}
                              variant="text"
                              sx={{ fontSize: 10 }}
                              startIcon={<AddCircleOutlineIcon />}
                            >
                              Add Package
                            </Button>{" "}
                          </div>
                          {/* <div className="flex flex-row space-x-4">
                            <DataCard
                              label="Average Price"
                              value={toMoneyFormat(s.averagePrice)}
                            />
                            <DataCard
                              label="Starting Price"
                              value={toMoneyFormat(s.startingPrice)}
                            />
                          </div> */}
                          <div className="flex">
                            <ul className="text-gray-400 text-xs mt-3x flex flex-row space-x-3 justify-start overflow-x-scroll scroll-mx-3 items-stretch">
                              {s.prices && s.prices.length > 0 ? (
                                s.prices.map((price, index) => (
                                  <li
                                    key={index}
                                    onClick={() => launchPriceDialog(s, index)}
                                    className="border rounded flex  flex-col hover:cursor-pointer hover:border-default text-gray-500 hover:text-default max-w-sm px-4 py-4 min-w-fit text-xs "
                                  >
                                    <p className="font-bold text-gray-700 ">
                                      {price.name}
                                    </p>
                                    <p className="text-base mt-2">
                                      {toMoneyFormat(price.price)}
                                    </p>
                                    <p className="text-2xs mt-0 text-gray-400">
                                      {price.unit}
                                    </p>
                                    <div className="border-t border-gray-100 w-full my-2"></div>
                                    <div className="flex flex-col justify-start">
                                      <p className="text-gray-700 font-semibold mb-2 text-2xs">
                                        What's included
                                      </p>

                                      {price.features.map((feature, index) => (
                                        <p
                                          key={index}
                                          className="space-x-1 items-center inline-flex "
                                        >
                                          <CheckIcon
                                            color="primary"
                                            fontSize="small"
                                          />
                                          <span>{feature}</span>
                                        </p>
                                      ))}
                                    </div>
                                  </li>
                                ))
                              ) : (
                                <>You have not added any price package.</>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Section>
                  ))}
                {services.length < 3 && (
                  <div className=" flex space-x-1 items-center justify-center">
                    <li
                      key={`qx--1`}
                      onClick={() => addNewService()}
                      className="border border-dashed rounded px-4 py-2 text-sm inline-flex justify-between items-center hover:cursor-pointer hover:border-default text-gray-500 hover:text-default w-full"
                    >
                      <div className="flex flex-grow ml-4 items-center justify-center space-x-3 h-10 ">
                        <AddCircleOutlineIcon />
                        <span>Add Service Category</span>
                      </div>
                    </li>
                  </div>
                )}
              </div>

              {/* {services && (
                <div className="flex flex-col space-y-4 md:space-y-6">
                  <div className="flex flex-col md:flex-row space-y-6  md:space-y-0 md:space-x-6 justify-center pt-6 items-center">
                    <LoadingButton
                      variant="contained"
                      loading={isLoading}
                      type="submit"
                    >
                      Save
                    </LoadingButton>
                  </div>
                </div>
              )} */}
            </Form>
          </FormCard>
        </FormProvider>
      </Section>

      {/* ================= ADD Service DIALOG =================== */}
      <ZPortal
        title={
          isEditing
            ? `Edit Service - ${activeServiceType.name}`
            : `Add New Service`
        }
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        positiveLabel="Save"
        positiveOnClick={handleAddService}
      >
        <Form>
          <div className="mt-3 sm:mt-5 ">
            <div className=" flex flex-col items-start text-sm w-full">
              {!isEditing && (
                <SelectInput
                  options={serviceCategories}
                  selected={activeServiceType ? activeServiceType : null}
                  classes="w-full"
                  name={`si-`}
                  label="Choose Service Category"
                  onChange={(e, i) => handleSelectService(e, i)}
                  disabled={isEditing}
                />
              )}
            </div>
          </div>
        </Form>
      </ZPortal>
      {/* ================= ADD Price DIALOG =================== */}
      <ZPortal
        title={
          isEditing
            ? `Edit Price - ${activeServiceType.name}`
            : `Add New Price Package`
        }
        open={openPriceDialog}
        onClose={() => setOpenPriceDialog(false)}
        positiveLabel="Save"
        positiveOnClick={savePriceInfo}
      >
        {activePricePack && (
          <Form>
            <div className="mt-3 sm:mt-5 w-full">
              <div className="mt-4 flex flex-col items-start text-sm w-full">
                <TextInput
                  label="Package Name * "
                  type="text"
                  name="name"
                  defaultValue={activePricePack.name}
                  placeholder=" "
                  wrapperclasses="w-full"
                  onChange={(e) => {
                    setActivePricePack({
                      ...activePricePack,
                      name: e.target.value,
                    });
                  }}
                />
                <small className="text-gray-400 mb-3">Ex. Premium</small>
                <div className="flex flex-row justify-between space-x-3 mb-3 w-full">
                  <div className="w-full">
                    <TextInput
                      label="Price (NGN)*"
                      type="number"
                      name="price"
                      defaultValue={activePricePack.price}
                      placeholder=" "
                      wrapperclasses="w-full"
                      onChange={(e) => {
                        setActivePricePack({
                          ...activePricePack,
                          price: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="w-full">
                    <SelectInput
                      options={priceUnits}
                      selected={activePriceUnit}
                      classes="w-full"
                      name={`si-`}
                      label="Unit"
                      onChange={(e) => {
                        setActivePriceUnit(e);
                        setActivePricePack({
                          ...activePricePack,
                          unit: e.name,
                        });
                      }}
                    />
                  </div>
                </div>
                <TextArea
                  label="Features *"
                  type="text"
                  name="whyUnique"
                  placeholder=" "
                  defaultValue={activePricePack.features.join("\n ")}
                  rows={5}
                  wrapperclasses="w-full"
                  onBlur={(e) => {
                    const result = e.target.value.trim().split(/\r?\n/);
                    setActivePricePack({
                      ...activePricePack,
                      features: result,
                    });
                  }}
                />
                <small className="text-gray-400 mb-3">
                  Enter each feature on a separate line.
                </small>
              </div>
            </div>
          </Form>
        )}
      </ZPortal>
    </>
  );
};

export default memo(DshVendorServicesForm);
