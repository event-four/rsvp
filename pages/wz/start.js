import FormCard from "@/components/FormCard";
import FormProvider from "@/components/providers/WZStartFormProvider";

import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  PersonalInfo,
  ChooseUrl,
  CreateAccount,
  EventDetails,
} from "@/components/wz";
import Layout from "@/components/wz/Layout";

const DZStartPage = () => {
  // const formStep = router.query.step ?? 1;

  // const goToStep = (step) => {
  //   const path = `${router.asPath}`.split("?")[0];
  //   router.push(path + `/?step=${step}`);
  // };

  return (
    <Layout>
      <div className="container mx-auto grid md:grid-cols-4 md:gap-4 h-screen">
        <div className="hidden md:hidden col-span-3"></div>

        <div className="p-6 align-middle h-full sm:mx-auto sm:col-span-4">
          <StartPageForm />
        </div>
      </div>
    </Layout>
  );
};

const StartPageForm = () => {
  const { isReady, query, asPath } = useRouter();
  const router = useRouter();

  // let formStep = 1;
  const steps = [
    { name: "info", required: true, done: true },
    { name: "Step 2", required: true, done: true },
    { name: "Step 3", required: false, done: false },
    { name: "Step 4", required: true, done: false },
  ];

  const goToStep = (step) => {
    const thisForm = steps[formStep - 1];
    const prevStep = step - 2 < 0 ? 0 : step - 2;
    const prevForm = steps[prevStep];

    //check if prev form is completed
    if (step > formStep && prevForm.required && !prevForm.done) return;
    if (step > formStep && thisForm.required && !thisForm.done) return;
    const path = `${asPath}`.split("?")[0];
    router.push(path + `/?step=${step}`);
  };

  const formStep = router.query.step ?? 1;

  useEffect(() => {
    if (!isReady) return;
  });

  const submitRegistration = (data) => {
    console.log(data);
    router.push("/wz/dashboard");
  };

  return (
    <FormProvider>
      <FormCard currentStep={formStep} steps={steps} goToStep={goToStep}>
        {formStep == 1 && (
          <PersonalInfo
            isVisible={formStep == 1}
            formStep={formStep}
            goToStep={() => goToStep(2)}
          />
        )}
        {formStep == 2 && (
          <CreateAccount
            isVisible={formStep == 2}
            goToStep={() => goToStep(3)}
          />
        )}
        {formStep == 3 && (
          <ChooseUrl isVisible={formStep == 3} goToStep={() => goToStep(4)} />
        )}
        {formStep == 4 && (
          <EventDetails
            isVisible={formStep == 4}
            // goToStep={() => goToStep(3)}
            submitForm={submitRegistration}
          />
        )}
      </FormCard>
    </FormProvider>
  );
};
export default DZStartPage;
