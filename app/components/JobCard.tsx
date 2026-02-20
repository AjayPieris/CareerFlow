"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { deleteJob, updateStatus } from "@/app/actions"; // Import the delete action
import { AIButton } from "./AIButton";

interface JobCardProps {
  id: string; // <--- New Prop
  title: string;
  company: string;
  type: "Remote" | "On-site" | "Hybrid" | string;
  date: string;
  status: string;
}

export function JobCard({
  id,
  title,
  company,
  type,
  date,
  status,
}: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow mb-4 relative group">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-bold">{title}</CardTitle>
          <Badge variant="outline">{type}</Badge>
        </div>
        <p className="text-sm text-gray-500">{company}</p>
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
      </CardContent>
    </Card>
  );
}
