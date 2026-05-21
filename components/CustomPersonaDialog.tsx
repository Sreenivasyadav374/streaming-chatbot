"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Persona } from "@/types/persona";

interface CustomPersonaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (persona: Omit<Persona, "id" | "user_id" | "created_at" | "updated_at">) => void;
}

export default function CustomPersonaDialog({
  open,
  onOpenChange,
  onSave,
}: CustomPersonaDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const handleSave = () => {
    if (!name.trim() || !systemPrompt.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      system_prompt: systemPrompt.trim(),
      is_default: false,
      is_custom: true,
    });

    setName("");
    setDescription("");
    setSystemPrompt("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setSystemPrompt("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Custom Persona</DialogTitle>
          <DialogDescription>
            Define your own AI persona with custom instructions and behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Data Analyst"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of this persona"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="system-prompt">System Instructions *</Label>
            <Textarea
              id="system-prompt"
              placeholder="Enter the system instructions that define this persona's behavior..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground">
              These instructions will be sent to the AI model to define its personality and behavior.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !systemPrompt.trim()}>
            Create Persona
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
