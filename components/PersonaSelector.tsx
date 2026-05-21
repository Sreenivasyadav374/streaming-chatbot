"use client";

import { useState } from "react";
import { Persona } from "@/types/persona";
import { DEFAULT_PERSONAS } from "@/lib/personas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import CustomPersonaDialog from "./CustomPersonaDialog";

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  customPersonas: Persona[];
  onAddCustomPersona: (persona: Omit<Persona, "id" | "user_id" | "created_at" | "updated_at">) => void;
  onDeleteCustomPersona: (id: string) => void;
}

export default function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  customPersonas,
  onAddCustomPersona,
  onDeleteCustomPersona,
}: PersonaSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const allPersonas = [...DEFAULT_PERSONAS, ...customPersonas];

  const handleValueChange = (value: string) => {
    if (value === "custom") {
      setIsDialogOpen(true);
      return;
    }

    const persona = allPersonas.find((p) => p.id === value);
    if (persona) {
      onSelectPersona(persona);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedPersona.id} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px] h-9">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <SelectValue placeholder="Select persona" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Default Personas
          </div>
          {DEFAULT_PERSONAS.map((persona) => (
            <SelectItem key={persona.id} value={persona.id}>
              <div className="flex flex-col">
                <span className="font-medium">{persona.name}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {persona.description}
                </span>
              </div>
            </SelectItem>
          ))}

          {customPersonas.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                Custom Personas
              </div>
              {customPersonas.map((persona) => (
                <SelectItem key={persona.id} value={persona.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{persona.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {persona.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}

          <div className="border-t mt-2 pt-2">
            <SelectItem value="custom">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Custom Persona</span>
              </div>
            </SelectItem>
          </div>
        </SelectContent>
      </Select>

      <CustomPersonaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={onAddCustomPersona}
      />
    </div>
  );
}
