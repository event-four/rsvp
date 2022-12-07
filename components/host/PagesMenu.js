import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { userService } from "@/services/user-service";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function PagesMenu({
  baseUrl,
  currentPage,
  pages,
  onChangePage,
  title = "Your Pages",
}) {
  const router = useRouter();
  const [openPageMenu, setOpenPageMenu] = useState();

  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        {title && (
          <div>
            <h1 className=" px-6 text-default font-500">{title}</h1>
          </div>
        )}
        <nav
          className={`flex flex-row md:flex-col w-full overflow-scroll z-[1600]`}
        >
          {pages.map((page) => (
            <a
              key={page.name}
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
          <a
            onClick={() => userService.logout()}
            href="#"
            className={classNames(
              "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300x",
              "font-bold whitespace-nowrap px-6 py-3 md:border-r-2  sm:font-medium text-sm w-full hover:bg-default hover:bg-opacity-[0.05] hover:border-t-0"
            )}
            // as="a"
          >
            Log out
          </a>
        </nav>
      </div>
    </>
  );
}
