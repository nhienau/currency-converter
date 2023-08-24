import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckIcon from "@mui/icons-material/Check";
import styles from "./Select.module.css";

function Select({ options, value = null, onChange }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(value);
  const [filterOptions, setFilterOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  function handleSelectOption(option) {
    setSelected(option);
    onChange(option);
    setIsOpen(false);
  }

  function handleBlurList(e) {
    if (!e.relatedTarget) {
      setIsOpen(false);
    }
  }

  function handleBlurDropdown(e) {
    if (e.relatedTarget?.nodeName === "INPUT") {
      e.relatedTarget.click();
    } else {
      setIsOpen(false);
    }
  }

  function handleKeyDown(e) {
    if (document.activeElement !== searchRef.current && !isOpen) return;
    switch (e.code) {
      case "ArrowUp":
      case "ArrowDown": {
        const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
        if (newValue >= 0 && newValue < filterOptions.length) {
          setHighlightedIndex(newValue);
        } else {
          setHighlightedIndex(0);
        }
        break;
      }
      case "Escape":
        setIsOpen(false);
        break;
      case "Enter":
        if (
          filterOptions.length !== 0 &&
          highlightedIndex >= 0 &&
          highlightedIndex < filterOptions.length
        ) {
          handleSelectOption(filterOptions[highlightedIndex]);
        } else setIsOpen(false);
        break;
    }
  }

  useEffect(
    function () {
      if (isOpen) {
        searchRef.current.focus();
      } else {
        setQuery("");
        setHighlightedIndex(-1);
      }
    },
    [isOpen, options]
  );

  useEffect(
    function () {
      if (query.length === 0) setFilterOptions(options);
      else
        setFilterOptions(
          options.filter(option =>
            option.label
              .toString()
              .toLowerCase()
              .includes(query.trim().toLowerCase())
          )
        );
    },
    [query, options]
  );

  useEffect(function () {
    const handler = function (e) {
      if (
        document.activeElement === containerRef.current &&
        e.code === "Enter"
      ) {
        setIsOpen(prev => !prev);
        return;
      }
    };
    const el = containerRef.current;
    el.addEventListener("keydown", handler);

    return function () {
      el.removeEventListener("keydown", handler);
    };
  }, []);

  useEffect(
    function () {
      setSelected(value);
    },
    [value]
  );

  return (
    <div className={styles.select}>
      <div
        className={styles.value}
        tabIndex={0}
        onClick={() => setIsOpen(isOpen => !isOpen)}
        onBlur={handleBlurDropdown}
        ref={containerRef}
      >
        <span className={styles.shorten}>{selected ? selected.label : ""}</span>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>
      {/* <ul
        className={`${styles.options} ${isOpen ? styles.open : ""}`}
        onBlur={handleBlurList}
        tabIndex={-1}
      >
        <div className={`${styles.search}`}>
          <SearchIcon />
          <input
            type="text"
            className={styles.input}
            placeholder="Search"
            ref={searchRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={!isOpen}
            onKeyDown={handleKeyDown}
          />
        </div>
        {filterOptions.map((option, index) => (
          <li
            key={option.value}
            className={`${styles.option} ${
              selected?.value === option.value ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""} `}
            onClick={() => handleSelectOption(option)}
          >
            <span className={styles.shorten}>{option.label}</span>
            {selected?.value === option.value && <CheckIcon />}
          </li>
        ))}
      </ul> */}
      {isOpen && (
        <ul
          className={`${styles.options} ${isOpen ? styles.open : ""}`}
          onBlur={handleBlurList}
          tabIndex={-1}
        >
          <div className={`${styles.search}`}>
            <SearchIcon />
            <input
              type="text"
              className={styles.input}
              placeholder="Search"
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={!isOpen}
              onKeyDown={handleKeyDown}
            />
          </div>
          {filterOptions.map((option, index) => (
            <li
              key={option.value}
              className={`${styles.option} ${
                selected?.value === option.value ? styles.selected : ""
              } ${index === highlightedIndex ? styles.highlighted : ""} `}
              onClick={() => handleSelectOption(option)}
            >
              <span className={styles.shorten}>{option.label}</span>
              {selected?.value === option.value && <CheckIcon />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
