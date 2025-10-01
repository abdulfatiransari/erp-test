"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { MultiSelectProps } from "@/types/role";

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (option: string) => {
    onChange(selected.filter((s) => s !== option));
  };

  const selectables = options.filter((option) => !selected.includes(option));

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option, index) => (
            <Badge key={`${option}-${index}`} variant="secondary">
              {option}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                  if (e.key === "Enter") {
                    handleUnselect(option);
                  }
                }}
                onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option, index) => (
                  <CommandItem
                    key={`${option}-${index}`}
                    onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...selected, option]);
                    }}
                    className="cursor-pointer"
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
