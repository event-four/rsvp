import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import { grey, pink } from "@mui/material/colors";
import { debounce } from "@/helpers/index";
import { dataService } from "@/services/data-service";

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
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  //recent suggestions
  const [recentSuggestions, setRecentSuggestions] = useState([]);
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

  useEffect(() => {
    if (filteredSuggestions.length && downPress) {
      setCursor((prevState) =>
        prevState == filteredSuggestions.length - 1
          ? 0
          : prevState < filteredSuggestions.length - 1
          ? prevState + 1
          : prevState
      );
    }
  }, [downPress]);

  useEffect(() => {
    if (filteredSuggestions.length && upPress) {
      setCursor((prevState) =>
        prevState == 0
          ? filteredSuggestions.length - 1
          : prevState > 0
          ? prevState - 1
          : prevState
      );
    }
  }, [upPress]);

  useEffect(() => {
    if (filteredSuggestions.length && enterPress) {
      setSelected(filteredSuggestions[cursor]);
    }
  }, [cursor, enterPress]);

  useEffect(() => {
    if (filteredSuggestions.length && hovered) {
      setCursor(filteredSuggestions.indexOf(hovered));
    }
  }, [hovered]);

  const onChange = async (e) => {
    // const { suggestions } = this.props;
    const userInput = e.currentTarget.value;
    setUserInput(e.currentTarget.value);
    setActiveSuggestion(0);
    if (userInput === "") return;

    //call api.
    try {
      const res = await dataService.search(userInput);
      console.log(res);

      // Filter our suggestions that don't contain the user's input
      if (res.length > 0) {
        // const filteredSuggestions = suggestions.filter(
        //   (suggestion) =>
        //     suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        // );

        setFilteredSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.log(error);
      setFilteredSuggestions([]);
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
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion]);
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

  const ListItem = ({ item, active, setSelected, setHovered }) => (
    <li
      className={`item ${
        active ? "active bg-slate-50" : ""
      } py-4 px-6 text-sm border-b border-b-gray-100`}
      key={item}
      //   onClick={onClick}
      onClick={() => setSelected(item)}
      onMouseEnter={() => setHovered(item)}
      onMouseLeave={() => setHovered(undefined)}
    >
      {item}
    </li>
  );

  return (
    <div>
      <header className="flex flex-row border-b items-center px-3 pt-3 pb-2">
        <SearchIcon sx={{ fontSize: 28, color: grey[300] }} />
        <input
          type="text"
          onChange={(e) => {
            debounce(onChange(e), 1500);
          }}
          onKeyDown={onKeyDown}
          value={userInput}
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
            {filteredSuggestions.length ? (
              <ul
                role="listbox"
                class="suggestions max-h-96 overflow-y-auto list-none w-full"
              >
                {filteredSuggestions.map((suggestion, i) => {
                  let className;
                  let selected = false;

                  // Flag the active suggestion with a class
                  if (i === activeSuggestion) {
                    className = "bg-slate-50";
                    selected = true;
                  }
                  return (
                    <ListItem
                      //   className={`${className} py-4 px-6 text-sm border-b border-b-gray-100`}
                      //   key={suggestion}
                      //   onClick={onClick}
                      //   key={item.id}
                      key={i}
                      active={i === cursor}
                      item={suggestion}
                      setSelected={setSelected}
                      setHovered={setHovered}
                    >
                      {suggestion}
                    </ListItem>
                  );
                })}
              </ul>
            ) : (
              <div class="no-suggestions text-gray-500 text-center text-sm py-6">
                <p>Sorry, we couldn't find anything matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          recentSuggestions.length > 0 && (
            <div className="DocSearch-Dropdown-Container p-2 pb-6 pt-6 "></div>
          )
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
