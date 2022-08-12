import Link from "next/link";
import CTA from "./cta";

export default function Footer({
  children,
  urls,
  showMenu = false,
  type = "wedding",
}) {
  return (
    <>
      <div className=" bottom-0 mt-10 ">
        <div className="">{children}</div>
        {showMenu ? (
          <div className="sm:hidden container flex flex-col sm:flex-row items-center mb-5 mx-auto justify-center">
            <a className="px-4" href={`${urls.home}`}>
              Home
            </a>
            <a className="px-4" href={`${urls.story}`}>
              The Story
            </a>
            <a className="px-4" href={`${urls.rsvp}`}>
              RSVP
            </a>
            <a className="px-4" href={`${urls.registry}`}>
              Registry
            </a>
            <a className="px-4" href={`${urls.logistics}`}>
              Flights & Hotels
            </a>
          </div>
        ) : (
          <div></div>
        )}

        <div className="text-primary-dark mb-6">
          <p className="text-center text-xs">
            Created with <span className="text-red-600 text-sm">&hearts;</span>{" "}
            on EventFour
          </p>
          <CTA type={type}></CTA>
        </div>
      </div>
    </>
  );
}
