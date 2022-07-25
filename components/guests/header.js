import Navbar from "./navbar";

export default function Header({ urls, title }) {
  return (
    <>
      {/* <div className="md:hidden z-0 relative">
        <Navbar urls={urls} />
      </div> */}
      <div className="text-center">
        <p className="text-center font-rochester text-3xl md:text-5xl mb-6 mt-6">
          {title}
        </p>
        <p className="mb-1">DEC 2022 | NNEWI, ANAMBRA STATE</p>
        <p>45 days to go!</p>
      </div>
      <div className="">
        <Navbar urls={urls} />
      </div>
    </>
  );
}
