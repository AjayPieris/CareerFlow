"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { deleteJob, updateStatus, updateNote } from "@/app/actions";
import { AIButton } from "./AIButton";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  type: "Remote" | "On-site" | "Hybrid" | string;
  date: string;
  status: string;
  note?: string | null;
}

export function JobCard({
  id,
  title,
  company,
  type,
  date,
  status,
  note,
}: JobCardProps) {
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState(note || "");
  const [expanded, setExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save note after user stops typing (debounce 800ms)
  const handleNoteChange = (value: string) => {
    setNoteText(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      const formData = new FormData();
      formData.set("id", id);
      formData.set("note", value);
      await updateNote(formData);
      setIsSaving(false);
    }, 800);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow mb-4 relative group">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-bold">{title}</CardTitle>
          <Badge variant="outline">{type}</Badge>
        </div>
        <p className="text-sm text-gray-500">{company}</p>
        {noteText && (
          <div className="mt-1">
            <p
              className={`text-xs text-amber-600/70 italic ${
                !expanded ? "line-clamp-1" : ""
              }`}
            >
              📝 {noteText}
            </p>
            {noteText.length > 40 && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-[10px] text-amber-500 hover:text-amber-700 font-medium mt-0.5 transition-colors"
              >
                {expanded ? "show less" : "read more"}
              </button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <Separator className="my-2" />
        <div className="flex flex-wrap justify-between items-center gap-y-2">
          <p className="text-xs text-gray-400 shrink-0">Applied: {date}</p>
          <div className="flex items-center gap-1 flex-wrap">
            <form action={updateStatus} className="h-auto">
              <input type="hidden" name="id" value={id} />
              <select
                name="status"
                defaultValue={status}
                onChange={(e) => e.target.form?.requestSubmit()}
                className="text-xs border-2 h-8 rounded p-1 bg-gray-50 cursor-pointer hover:bg-gray-100"
              >
                <option value="Wishlist">🎯 Wishlist</option>
                <option value="Applied">🚀 Applied</option>
                <option value="Interview">🗣️ Interview</option>
                <option value="Offer">🎉 Offer</option>
                <option value="Rejected">❌ Rejected</option>
              </select>
            </form>
            {/* NOTE TOGGLE BUTTON */}
            <button
              type="button"
              onClick={() => setShowNote(!showNote)}
              title="Toggle notes"
              className={`text-sm px-1.5 py-0.5 rounded transition-colors ${
                showNote || noteText
                  ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                  : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
              }`}
            >
              📝
            </button>
            {/* AI BUTTON */}
            <AIButton company={company} title={title} />
            {/* DELETE BUTTON — always visible on touch, hover-only on desktop */}
            <form action={deleteJob}>
              <input type="hidden" name="id" value={id} />
              <button
                type="submit"
                className="text-red-400 hover:text-red-600 text-sm font-bold opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                🗑
              </button>
            </form>
          </div>
        </div>

        {/* NOTE SECTION */}
        {showNote && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="relative">
              <textarea
                value={noteText}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border-2 border-amber-200 bg-amber-50/50 focus:border-amber-400 focus:bg-white focus:outline-none resize-none transition-colors placeholder:text-amber-300"
              />
              {isSaving && (
                <span className="absolute bottom-2 right-2 text-[10px] text-amber-400 animate-pulse">
                  saving...
                </span>
              )}
              {!isSaving && noteText && (
                <span className="absolute bottom-2 right-2 text-[10px] text-green-400">
                  ✓ saved
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
