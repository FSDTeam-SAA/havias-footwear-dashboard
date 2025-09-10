"use client";

import React, { useState, KeyboardEvent, ChangeEvent } from "react";

interface TagsInputProps {
  value: string[];
  onValueChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onValueChange,
  placeholder = "Add a tag",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !value.includes(trimmedValue)) {
        onValueChange([...value, trimmedValue]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue) {
      // Remove last tag if backspace is pressed and input is empty
      onValueChange(value.slice(0, -1));
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onValueChange(newTags);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-md px-2 py-1">
      {value.map((tag, index) => (
        <div
          key={index}
          className="flex items-center bg-blue-100 text-blue-800 text-sm rounded px-2 py-1"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => handleRemoveTag(index)}
            className="ml-1 text-blue-600 font-bold"
          >
            ×
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] border-none outline-none py-1 px-2 bg-transparent"
      />
    </div>
  );
};
