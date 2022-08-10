import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function PagesMenu({
  baseUrl,
  currentPage,
  pages,
  onChangePage,
}) {
  const router = useRouter();
  const [openPageMenu, setOpenPageMenu] = useState();

  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <div>
          <h1 className=" px-6 text-default font-500">Your Pages</h1>
          {/* <div>
            <IconButton>
              <MenuIcon />
            </IconButton>
          </div> */}
        </div>

        <nav className={`flex flex-row md:flex-col w-full overflow-scroll`}>
          {pages.map((page) => (
            <a
              key={page.name}
              // href={`${baseUrl}?page=${page.href}`}
              // as={`${baseUrl}/${page.href}`}
              onClick={() => onChangePage(page)}
              href="#"
              className={classNames(
                page === currentPage
                  ? `border-default text-default bg-default bg-opacity-[0.05] hover:text-default`
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300x",
                "font-bold whitespace-nowrap px-6 py-3 md:border-r-2  sm:font-medium text-sm w-full hover:bg-default hover:bg-opacity-[0.05] hover:border-t-0"
              )}
              aria-current={page.current ? "page" : undefined}
              // as="a"
            >
              {page.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
