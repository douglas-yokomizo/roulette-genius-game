"use client";
import { useState, useEffect } from "react";

interface IVirtualKeyboard {
  isVisible: boolean;
  onChange: (value: string) => void;
  focusedInput: string;
}

const VirtualKeyboard = ({
  isVisible,
  onChange,
  focusedInput,
}: IVirtualKeyboard) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setInputValue("");
    }
  }, [isVisible]);

  useEffect(() => {
    setInputValue("");
  }, [focusedInput]);

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const handleKeyPress = (key: string): void => {
    const maxLengths: Record<string, number> = {
      cpf: 14, // Adjusted for CPF format (XXX.XXX.XXX-XX)
      dob: 8,
      phone: 11,
    };

    if (
      focusedInput &&
      inputValue.length >= maxLengths[focusedInput] &&
      key !== "backspace"
    ) {
      return;
    }

    let newValue = inputValue;

    if (key === "backspace") {
      newValue = newValue.slice(0, -1);
    } else {
      newValue += key;
    }

    if (focusedInput === "cpf") {
      newValue = formatCpf(newValue);
    }

    setInputValue(newValue);
    onChange(newValue);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed w-fit bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-200 p-6 rounded-t-lg shadow-lg">
      <div className="flex justify-center my-1">
        <div className="flex flex-col">
          <div className="flex justify-center my-1">
            {"123".split("").map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="px-4 py-3 w-full bg-white border border-gray-400 rounded shadow mx-1"
              >
                {key}
              </button>
            ))}
          </div>
          <div className="flex justify-center my-1">
            {"456".split("").map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="px-4 py-3 w-full bg-white border border-gray-400 rounded shadow mx-1"
              >
                {key}
              </button>
            ))}
          </div>
          <div className="flex justify-center my-1">
            {"789".split("").map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="px-4 py-3 w-full bg-white border border-gray-400 rounded shadow mx-1"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center ml-2">
          <button
            onClick={() => handleKeyPress("backspace")}
            className="px-2 py-1 bg-white border h-full border-gray-400 rounded shadow"
          >
            Backspace
          </button>
        </div>
      </div>
      <div className="flex justify-center my-1">
        <button
          onClick={() => handleKeyPress("0")}
          className="px-4 py-3 w-full bg-white border border-gray-400 rounded shadow mt-1"
        >
          0
        </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
