import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import { grey, pink } from "@mui/material/colors";
import { debounce } from "@/helpers/index";
import { dataService } from "@/services/data-service";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { getFromStorage, setToStorage } from "@/helpers/utils";

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

const Autocomplete = ({ suggestions = [] }) => {
  // The active selection's index
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  // The suggestions that match the user's input
  const [filteredResults, setFilteredResults] = useState([]);
  //recent suggestions
  const [rawResult, setRawResult] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [favoriteResults, setFavoriteResults] = useState([]);
  // Whether or not the suggestion list is shown
  const [showSuggestions, setShowSuggestions] = useState(false);
  // What the user has entered
  const [userInput, setUserInput] = useState("");

  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);
  const router = useRouter();
  const inRef = useRef();

  useEffect(() => {
    //check recent
    const res = getFromStorage("recent_search");
    if (res) {
      setRecentResults(processResult(JSON.parse(res)));
    }
    res = getFromStorage("search_favorites");
    if (res) {
      setFavoriteResults(processResult(JSON.parse(res)));
    }
  }, []);

  useEffect(() => {
    if (filteredResults.length && downPress) {
      setCursor((prevState) =>
        prevState == filteredResults.length - 1
          ? 0
          : prevState < filteredResults.length - 1
          ? prevState + 1
          : prevState
      );
    }
  }, [downPress]);

  useEffect(() => {
    if (filteredResults.length && upPress) {
      setCursor((prevState) =>
        prevState == 0
          ? filteredResults.length - 1
          : prevState > 0
          ? prevState - 1
          : prevState
      );
    }
  }, [upPress]);

  useEffect(() => {
    if (filteredResults.length && enterPress) {
      setSelected(filteredResults[cursor]);
    }
  }, [cursor, enterPress]);

  useEffect(() => {
    if (filteredResults.length && hovered) {
      setCursor(filteredResults.indexOf(hovered));
    }
  }, [hovered]);

  const _debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const onChange = _debounce((e) => searchApi(e));

  const searchApi = async (e) => {
    console.log(e);
    console.log(inRef.current.value);

    const userInput = inRef.current.value;
    setUserInput(userInput);
    setActiveSuggestion(0);

    if (userInput === "") return;

    try {
      console.log("Searching api...");
      const res = await dataService.search(e);
      console.log(res);

      // Filter our suggestions that don't contain the user's input
      if (res.length > 0) {
        const filteredSuggestions = processResult(res);

        setRawResult(res);
        setFilteredResults(filteredSuggestions);
        setToStorage("recent_search", JSON.stringify(res));
        setShowSuggestions(true);
      } else {
        setFilteredResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.log(error);
      setFilteredResults([]);
      setShowSuggestions(false);
    }
  };

  const onClick = (e) => {
    // setActiveSuggestion(0);
    // setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);
  };

  const onKeyDown = (e) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      if (selected && selected.url !== "") {
        router.push(selected.url);
      }
      // setActiveSuggestion(0);
      // setShowSuggestions(false);
      // setUserInput(filteredSuggestions[activeSuggestion]);
    }
    // User pressed the up arrow
    // else if (e.keyCode === 38) {
    //   if (activeSuggestion === 0) {
    //     return;
    //   }
    //   setActiveSuggestion(activeSuggestion - 1);
    // }
    // // User pressed the down arrow
    // else if (e.keyCode === 40) {
    //   if (activeSuggestion - 1 === filteredSuggestions.length) {
    //     return;
    //   }
    //   setActiveSuggestion(activeSuggestion + 1);
    // }
  };

  const addFavorite = (item) => {
    const index = filteredResults.indexOf(item);
    const raw = rawResult[index];
    const res = getFromStorage("search_favorites") ?? "[]";
    if (res) {
      const raws = JSON.parse(res);
      raws.push(raw);
      setToStorage("search_favorites", JSON.stringify(raws));
      setFavoriteResults(processResult(raws));
    }
  };

  const removeFavorite = (item) => {
    const index = favoriteResults.indexOf(item);
    const res = getFromStorage("search_favorites") ?? "[]";
    if (res) {
      const raws = JSON.parse(res);
      raws.splice(index, 1);
      setToStorage("search_favorites", JSON.stringify(raws));
      setFavoriteResults(processResult(raws));
    }
  };

  const ListItem = ({ item, active, setSelected, setHovered, isFavorite }) => (
    <li
      className={`cursor-pointer item ${
        active ? "active bg-slate-50" : ""
      } py-4 px-6 text-sm border-b border-b-gray-100`}
      key={item}
      //   onClick={onClick}
      onClick={() => setSelected(item)}
      onMouseEnter={() => setHovered(item)}
      onMouseLeave={() => setHovered(undefined)}
    >
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <div className="flex flex-col flex-grow">
            <Link href={item.url}>
              <>
                <div className="flex flex-row">
                  <p>{item.title}</p>

                  <small className="text-gray-500 ml-2">({item.type})</small>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {item.description}
                </div>
              </>
            </Link>
          </div>
          <div className="flex flex-row items-center cursor-pointer">
            {isFavorite ? (
              <IconButton onClick={() => removeFavorite(item)} color="primary">
                <StarIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => addFavorite(item)}
                sx={{ color: grey[400] }}
              >
                <StarOutlineIcon />
              </IconButton>
            )}
            <div className="ml-2 pl-2 h-6 border-l"></div>
            <IconButton onClick={() => {}} sx={{ color: grey[400] }}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </li>
  );

  const processResult = (items) => {
    const results = [];
    items.forEach((item, i) => {
      if (!item) return;
      const data = item.data;
      if (item.type == "service") {
        results.push({
          id: "service-" + item.data.id,
          type: "Service",
          title: item.data.name,
          title_small: "(Service)",
          description: "See all the vendors providing this service.",
          url: ``,
        });
      } else if (item.type == "vendor") {
        results.push({
          id: "vendor-" + item.data.id,
          type: "Vendor",
          title: `${item.data.businessName}`,
          title_small: "(Vendor)",
          photo: item.data.avatar,
          description: `${item.data.city ? item.data.city : ""}`,
          url: ``,
        });
      } else if (item.type == "event") {
        const date = data.startDate
          ? dayjs(data.startDate).format("ddd, MMMM DD, YYYY")
          : "Date To Be Announced";

        results.push({
          id: "event-" + data.id,
          type: `Event - ${item.data.type.name}`,
          title: `${item.data.title}`,
          title_small: "(Event)",
          photo: item.data.avatar,
          description: (
            <div className="flex flex-row items-center">
              {date}
              <div className="ml-2 pl-2 h-4 border-l"></div>
              {item.data.city ? item.data.city : "Location to be announced"}
            </div>
          ),
          url: `/w/${data.slug}`,
        });
      }
    });

    return results;
  };

  return (
    <div>
      <header className="flex flex-row border-b items-center px-3 pt-3 pb-2">
        <SearchIcon sx={{ fontSize: 28, color: grey[300] }} />
        <input
          ref={inRef}
          type="text"
          onChange={(e) => onChange(e.target.value)}
          // onKeyUp={(e) => {
          //   console.log(e);
          //   debounce((v) => {
          //     console.log(v);
          //     onChange(v);
          //   }, 500);
          // }}
          // onKeyDown={onKeyDown}
          // value={userInput}
          autoFocus={true}
          className="inp w-full placeholder:text-gray-300 ml-0 sm:text-sm without-ring focus:ring-0 focus:ring-offset-0 outline-none border-none "
          placeholder="Type an event code, celebrant's name, vendor, or service."
        />
        <div className="text-xs p-2 bg-slate-100 text-slate-400 rounded-lg text-center max-h-9">
          ESC
        </div>
      </header>

      <div className="DocSearch-Dropdown">
        {showSuggestions && userInput ? (
          <div className="DocSearch-Dropdown-Container ">
            {filteredResults.length ? (
              <ul
                role="listbox"
                className="suggestions max-h-96 overflow-y-auto list-none w-full"
              >
                {filteredResults.map((item, i) => {
                  return (
                    <ListItem
                      key={i}
                      active={i === cursor}
                      item={item}
                      setSelected={setSelected}
                      setHovered={setHovered}
                    />
                  );
                })}
              </ul>
            ) : (
              <div className="no-suggestions text-gray-500 text-center text-sm py-6">
                <p>Sorry, we couldn't find anything matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          recentResults.length > 0 && (
            <div className="DocSearch-Dropdown-Container p-2 pb-6 pt-6 ">
              <p className="text-gray-700 font-bold pl-6 pb-4">Recent</p>
              <ul
                role="listbox"
                className="suggestions max-h-96 overflow-y-auto list-none w-full"
              >
                {recentResults.map((item, i) => {
                  return (
                    <ListItem
                      key={i}
                      active={i === cursor}
                      item={item}
                      setSelected={setSelected}
                      setHovered={setHovered}
                    />
                  );
                })}
              </ul>
            </div>
          )
        )}
        {favoriteResults.length > 0 && (
          <div className="DocSearch-Dropdown-Container p-2 pb-6 pt-6 ">
            <p className="text-gray-700 font-bold pl-6 pb-4">Favorite</p>
            <ul
              role="listbox"
              className="suggestions max-h-96 overflow-y-auto list-none w-full"
            >
              {favoriteResults.map((item, i) => {
                return (
                  <ListItem
                    key={i}
                    active={i === cursor}
                    item={item}
                    setSelected={setSelected}
                    setHovered={setHovered}
                    isFavorite={true}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <footer className="DocSearch-Footer flex flex-row relative">
        <div className="flex flex-row items-center ">
          <p className="text-gray-300 text-xs">Search by &nbsp;</p>
          <p className="font-extrabold text-base text-default">eventfour</p>
          <div className="font-normal text-[7px] text-gray-500 -mt-2 ml-[1px]">
            TM
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Autocomplete;
