import GlobalNavbar from "./GlobalNavbar";
import Link from "next/link";

export default function GlobalLayout({ children, staticNavbar }) {
  return (
    <div className="container-fluid flex flex-col bg-primary relative">
      <div className="min-h-full w-full">
        <div className="f1"></div>
        <div className="f2"></div>
        <div className="f3"></div>
      </div>
      <div className="container-fluid relative flex flex-col">
        <GlobalNavbar staticNavbar={staticNavbar} />
        <div className="relative z-[10]">{children}</div>
      </div>
      <div className="h-1"></div>
      <div>
        <div className="text-center text-sm mt-16 mb-5 font-poppins px-8 text-gray-800 ">
          <>
            <p>Planning an event?</p>
            <Link href="/host/start" className="underline text-pink-600">
              Create your own event website for free!
            </Link>
          </>
        </div>
        <p className="text-sm text-center mb-5 text-gray-800">
          &copy; 2022. EventFour Ltd.
        </p>
      </div>
    </div>
  );
}
