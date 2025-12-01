"use client";

import { useState, useActionState } from "react"; // <--- CHANGED: Import from 'react'
import { useFormStatus } from "react-dom";
import { generateCoverLetter } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Helper component for the loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-4">
      {pending ? "✨ Writing Magic..." : "Generate Cover Letter"}
    </Button>
  );
}

export function AIButton({ company, title }: { company: string, title: string }) {
  // <--- CHANGED: useActionState instead of useFormState
  const [state, formAction] = useActionState(generateCoverLetter, null);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs border border-purple-200 bg-purple-50 text-purple-700 px-2 py-1 rounded hover:bg-purple-100 transition-colors">
            ✨ AI Letter
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Generate Cover Letter for {company}</DialogTitle>
          <DialogDescription>
            Paste the job description below and generate a tailored draft.
          </DialogDescription>
        </DialogHeader>
        
        {!state?.success ? (
            /* STEP 1: INPUT FORM */
            <form action={formAction}>
                <input type="hidden" name="company" value={company} />
                <input type="hidden" name="title" value={title} />
                
                <div className="space-y-2 mt-4">
                    <Label>Paste Job Description</Label>
                    <Textarea 
                        name="description" 
                        placeholder="Paste the requirements from LinkedIn here..." 
                        className="h-40"
                        required 
                    />
                </div>
                <SubmitButton />
            </form>
        ) : (
            /* STEP 2: RESULT */
            <div className="mt-4">
                <Label>Your AI Draft</Label>
                <Textarea 
                    value={state.letter} 
                    readOnly 
                    className="h-64 mt-2 bg-gray-50" 
                />
                <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => {navigator.clipboard.writeText(state.letter)}}
                >
                    Copy to Clipboard
                </Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}