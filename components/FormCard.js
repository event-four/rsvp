export default function FormCard({ children, currentStep, prevFormStep }) {
  return (
    <div className="flex flex-col flex-grow">
      {currentStep < 3 && (
        <>
          {/* {currentStep > 0 && (
            <button className="" onClick={prevFormStep} type="button">
              back
            </button>
          )} */}

          {/* <span className="">
            Step {currentStep + 1} of {children.length}
          </span> */}
        </>
      )}
      {children}
    </div>
  );
}
