import { CheckIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FormCard({
  children,
  currentStep,
  steps = [],
  goToStep,
}) {
  return (
    <div className="flex flex-col items-center h-full">
      <nav aria-label="Progress" className="block w-full">
        <ol
          role="list"
          className="flex items-center gridx grid-flow-colx  w-full justify-items-stretch "
        >
          {steps.map((step, stepIdx) => {
            stepIdx += 1;
            return (
              <li
                key={step.name}
                className={classNames(
                  stepIdx !== steps.length ? "pr-20 sm:pr-20x" : "",
                  "relative"
                )}
                onClick={() => goToStep(stepIdx)}
              >
                {stepIdx < currentStep ? (
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-default" />
                    </div>
                    <a
                      href="#"
                      className="relative w-6 h-6 md:w-4 md:h-4 flex items-center justify-center bg-default rounded-full hover:bg-indigo-900"
                    >
                      <CheckIcon
                        className="w-4 h-4 text-white"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </a>
                  </>
                ) : stepIdx == currentStep ? (
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <a
                      className="relative w-6 h-6 flex items-center justify-center bg-white border-2 border-default rounded-full"
                      aria-current="step"
                    >
                      <span
                        className="h-2.5 w-2.5 bg-default rounded-full"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </a>
                  </>
                ) : (
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <a
                      href="#"
                      className="group relative w-4 h-4 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                    >
                      <span
                        className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </a>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="pt-10 h-full w-full items-centerx align-middle">
        {children}
      </div>
    </div>
  );
}
