"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function CustomSelect({ options, value, onChange, placeholder = "Select..." }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const target = e.target as Node;
      // Don't close if clicking inside container or dropdown menu
      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const dropdownMenu = (
    <div
      ref={dropdownRef}
      className={`fixed z-[100] bg-white shadow-lg p-1 border border-slate-100 rounded-xl origin-top transition duration-150 ease-out ${
        isOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
      }`}
      style={{
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
      }}
      role="listbox"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => {
            onChange(option.value);
            setIsOpen(false);
          }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
            value === option.value
              ? "bg-slate-100 text-slate-900 font-medium"
              : "hover:bg-slate-50 text-slate-700"
          }`}
          role="option"
          aria-selected={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full inline-flex items-center justify-between gap-2 bg-white hover:bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-700 text-sm transition"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <span className={`text-slate-400 transition ${isOpen ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {typeof document !== "undefined" && createPortal(dropdownMenu, document.body)}
    </div>
  );
}
