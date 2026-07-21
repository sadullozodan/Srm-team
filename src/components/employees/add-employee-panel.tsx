"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  Trash2,
  FilePlus,
} from "lucide-react";

const POSITION_OPTIONS = ["Director", "Manager", "Developer", "Mentor"];

export function AddEmployeePanel() {
  // Form fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [experience, setExperience] = useState<number>(0);
  const [branch, setBranch] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [description, setDescription] = useState("");

  // Position multi-select state
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);

  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const togglePosition = (pos: string) => {
    if (selectedPositions.includes(pos)) {
      setSelectedPositions(selectedPositions.filter((p) => p !== pos));
    } else {
      setSelectedPositions([...selectedPositions, pos]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleSelectSampleAvatar = () => {
    setPhotoUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80");
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* 1. Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/employees"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-70 transition-all"
        >
          <ArrowLeft className="size-5 stroke-[2.5]" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Add new employee
        </h1>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 2. Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Basic details Form (~60% width) */}
        <div className="lg:col-span-7 bg-white dark:bg-card rounded-2xl md:rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-5">
          <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
            Basic details
          </h2>

          <div className="space-y-4">
            {/* First name */}
            <div className="relative">
              {firstName && (
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  First name
                </label>
              )}
              <input
                type="text"
                placeholder={firstName ? "" : "First name"}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Last name */}
            <div className="relative">
              {lastName && (
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Last name
                </label>
              )}
              <input
                type="text"
                placeholder={lastName ? "" : "Last name"}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Birth date */}
            <div className="relative flex items-center">
              {birthDate && (
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Birth date
                </label>
              )}
              <input
                type="text"
                placeholder={birthDate ? "" : "Birth date"}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-9"
              />
              <Calendar className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Phone number & Email (2-Column Row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone number */}
              <div className="relative">
                {phoneNumber && (
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Phone number
                  </label>
                )}
                <input
                  type="text"
                  placeholder={phoneNumber ? "" : "Phone number"}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Email */}
              <div className="relative">
                {email && (
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Email
                  </label>
                )}
                <input
                  type="email"
                  placeholder={email ? "" : "Email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Adress */}
            <div className="relative">
              {address && (
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Adress
                </label>
              )}
              <input
                type="text"
                placeholder={address ? "" : "Adress"}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Position & Experience (Two-column row) */}
            <div className="grid grid-cols-12 gap-4">
              {/* Custom Position Dropdown Trigger (~70% width = col-span-8) */}
              <div className="col-span-8 relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 z-10">
                  Position
                </label>

                <div
                  onClick={() => setIsPositionDropdownOpen(!isPositionDropdownOpen)}
                  className={`w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border ${
                    isPositionDropdownOpen
                      ? "border-indigo-600 ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800"
                  } rounded-xl focus:outline-none transition-all text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer select-none`}
                >
                  <span className={selectedPositions.length ? "font-semibold" : "text-slate-400"}>
                    {selectedPositions.length ? selectedPositions.join(", ") : "Position"}
                  </span>
                  {isPositionDropdownOpen ? (
                    <ChevronUp className="size-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-slate-400 shrink-0" />
                  )}
                </div>

                {/* Position Dropdown Popover (image_c6a724.png) */}
                {isPositionDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                    {POSITION_OPTIONS.map((pos) => {
                      const isSelected = selectedPositions.includes(pos);
                      return (
                        <div
                          key={pos}
                          onClick={() => togglePosition(pos)}
                          className={`px-4 py-2.5 flex items-center gap-3 text-xs font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          }`}
                        >
                          <div
                            className={`size-4 rounded border flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                            }`}
                          >
                            {isSelected && <Check className="size-3 stroke-[3]" />}
                          </div>
                          <span>{pos}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Experience Stepper Input (~30% width = col-span-4) */}
              <div className="col-span-4 relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Experience
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8"
                  />
                  <div className="absolute right-2 flex flex-col">
                    <button
                      type="button"
                      onClick={() => setExperience((v) => v + 1)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                    >
                      <ChevronUp className="size-3 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExperience((v) => Math.max(0, v - 1))}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                    >
                      <ChevronDown className="size-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Dropdown */}
            <div className="relative">
              {branch && (
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Branch
                </label>
              )}
              <div className="relative flex items-center">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
                >
                  <option value="">Branch</option>
                  <option value="Sadbarg">Sadbarg</option>
                  <option value="Profsous">Profsous</option>
                </select>
                <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Telegram user name */}
            <div className="relative">
              {telegramUsername && (
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Telegram user name
                </label>
              )}
              <input
                type="text"
                placeholder={telegramUsername ? "" : "Telegram user name"}
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Description */}
            <div className="relative">
              {description && (
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Description
                </label>
              )}
              <input
                type="text"
                placeholder={description ? "" : "Description"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/employees"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all inline-block"
            >
              Save account
            </Link>
            <Link
              href="/employees"
              className="border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl transition-all inline-block"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Right Column: Photo Upload Component (~40% width) */}
        <div className="lg:col-span-5 bg-white dark:bg-card rounded-2xl md:rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
              Photo
            </h2>
            <button
              onClick={() => setPhotoUrl(null)}
              disabled={!photoUrl}
              className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                photoUrl
                  ? "text-rose-500 hover:text-rose-600 cursor-pointer"
                  : "text-slate-400 cursor-not-allowed"
              }`}
            >
              <Trash2 className="size-4" />
              <span>Remove foto</span>
            </button>
          </div>

          {/* Upload Area: Empty State vs Filled State */}
          {!photoUrl ? (
            /* Empty State (image_c6a669.png) */
            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-100 dark:border-slate-700 rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-2.5 bg-slate-50/40 dark:bg-slate-900/20 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="size-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
                  <FilePlus className="size-6 stroke-[1.8]" />
                </div>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  Select file
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Click or drag file to this area to upload
                </span>
              </div>

              {/* Action Buttons below Empty State */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectSampleAvatar}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  Choose avatar
                </button>
                <button
                  type="button"
                  disabled
                  className="bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 font-bold text-xs px-5 py-2.5 rounded-xl cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            /* Filled State (image_c6a720.png) */
            <div className="space-y-6 text-center">
              <div className="size-44 sm:size-48 rounded-full border-4 border-slate-100 dark:border-slate-700 overflow-hidden shadow-md mx-auto relative group">
                <img src={photoUrl} alt="Uploaded Employee Avatar" className="size-full object-cover" />
              </div>

              {/* Action Buttons below Filled State */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  Change avatar
                </button>
                <button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
