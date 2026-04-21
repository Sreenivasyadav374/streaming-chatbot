export interface Persona {
  id: string;
  user_id: string | null;
  name: string;
  description: string;
  system_prompt: string;
  is_default: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonaWithSelect extends Persona {
  isSelected?: boolean;
}
