import { useState } from "react";

function NavLink({ to, children }) {
  return (
    <a href={to} className={`mx-4 uppercase text-xs `}>
      {children}
    </a>
  );
}

function MobileNavLink({ to, children, open, setOpen }) {
  return (
    <a
      href={to}
      className={`mx-4 my-3 text-xl font-normal text-white`}
      onClick={() =>
        setTimeout(() => {
          setOpen(!open);
        }, 100)
      }
    >
      {children}
    </a>
  );
}

function MobileNav({ open, setOpen, urls }) {
  return (
    <div
      className={`fixed flex flex-col top-0 bottom-0 mx-auto my-auto bg-blue-400 h-screen w-screen transform ${
        open ? "-translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out filter z-0`}
    >
      <div className="flex items-center justify-center h-20">
        {/* {" "} */}
        {/*logo container*/}
        {/* <a className="text-xl font-semibold" href="/">
          EventFour
        </a> */}
      </div>
      <div className=" flex flex-col text-center justify-center my-auto">
        <MobileNavLink to={`${urls.home}`} open={open} setOpen={setOpen}>
          Home
        </MobileNavLink>
        <MobileNavLink to={`${urls.story}`} open={open} setOpen={setOpen}>
          The Story
        </MobileNavLink>
        <MobileNavLink to={`${urls.rsvp}`} open={open} setOpen={setOpen}>
          RSVP
        </MobileNavLink>
        <MobileNavLink to={`${urls.registry}`} open={open} setOpen={setOpen}>
          Registry
        </MobileNavLink>

        <MobileNavLink to={`${urls.logistics}`} open={open} setOpen={setOpen}>
          Flights & Hotels
        </MobileNavLink>
      </div>
    </div>
  );
}

export default function Navbar({ urls }) {
  const [open, setOpen] = useState(false);
  //   console.log(urls);
  return (
    <nav className="flex w-full h-20x items-center justify-center">
      {/* <MobileNav open={open} setOpen={setOpen} urls={urls} /> */}
      {/* <div className="w-3/12 flex items-center">
        <a className="text-2xl font-semibold" href="/">
          EventFour
        </a>
      </div> */}
      <div className="w-12/12x container w-full mr-5  justify-end items-centerx hidden">
        <div
          className="z-50 flex fixed w-6 h-6  mt-4 flex-col justify-between items-center md:hidden"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {/* hamburger button */}
          <span
            className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${
              open ? "rotate-45 translate-y-2.5" : ""
            }`}
          />
          <span
            className={`h-1 w-full bg-black rounded-lg transition-all duration-300 ease-in-out ${
              open ? "w-0" : "w-full"
            }`}
          />
          <span
            className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${
              open ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          />
        </div>

        <div className="hidden md:flex w-full justify-center">
          <NavLink to={`${urls.home}`}>Home</NavLink>
          <NavLink to={`${urls.story}`}>The Story</NavLink>
          <NavLink to={`${urls.rsvp}`}>RSVP</NavLink>
          <NavLink to={`${urls.registry}`}>Registry</NavLink>
          <NavLink to={`${urls.logistics}`}>Flights & Hotels</NavLink>
        </div>
      </div>
    </nav>
  );
}
