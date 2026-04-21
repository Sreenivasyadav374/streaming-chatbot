/*
  # Create Personas Table

  1. New Tables
    - `personas`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, persona name)
      - `description` (text, optional description)
      - `system_prompt` (text, the system instructions)
      - `is_default` (boolean, whether it's a built-in persona)
      - `is_custom` (boolean, whether user created it)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `personas` table
    - Default personas are readable by all authenticated users
    - Custom personas are only readable/writable by their owner
*/

CREATE TABLE IF NOT EXISTS personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  system_prompt text NOT NULL,
  is_default boolean DEFAULT false,
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read default personas
CREATE POLICY "Authenticated users can read default personas"
  ON personas FOR SELECT
  TO authenticated
  USING (is_default = true);

-- Policy: Users can read their own custom personas
CREATE POLICY "Users can read own custom personas"
  ON personas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND is_custom = true);

-- Policy: Users can create their own custom personas
CREATE POLICY "Users can create own custom personas"
  ON personas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_custom = true);

-- Policy: Users can update their own custom personas
CREATE POLICY "Users can update own custom personas"
  ON personas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_custom = true)
  WITH CHECK (auth.uid() = user_id AND is_custom = true);

-- Policy: Users can delete their own custom personas
CREATE POLICY "Users can delete own custom personas"
  ON personas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND is_custom = true);

-- Insert default personas
INSERT INTO personas (name, description, system_prompt, is_default, is_custom) VALUES
(
  'Code Expert',
  'A senior software engineer with deep expertise in multiple programming languages and best practices',
  'You are a senior software engineer with 15+ years of experience. You provide clear, well-structured code solutions with explanations. You follow best practices, write clean code, and consider edge cases. When reviewing code, you suggest improvements for performance, readability, and maintainability.',
  true,
  false
),
(
  'Content Strategist',
  'A marketing expert specializing in content creation, SEO, and audience engagement',
  'You are a content strategist with expertise in SEO, audience engagement, and brand voice. You help create compelling content that resonates with target audiences. You provide guidance on content structure, tone, keyword optimization, and content strategy planning.',
  true,
  false
),
(
  'Friendly Tutor',
  'A patient and encouraging teacher who breaks down complex topics into simple explanations',
  'You are a friendly and patient tutor. You break down complex topics into simple, easy-to-understand explanations. You use analogies, examples, and step-by-step guidance. You encourage questions and create a supportive learning environment. You adapt your teaching style to the learner''s level.',
  true,
  false
),
(
  'Technical Writer',
  'An expert in creating clear, concise documentation and technical guides',
  'You are a technical writer specializing in creating clear, concise documentation. You excel at explaining complex technical concepts in accessible language. You structure information logically, use appropriate formatting, and ensure documentation is comprehensive yet easy to navigate.',
  true,
  false
),
(
  'Creative Brainstorm Partner',
  'An imaginative collaborator for generating ideas and exploring possibilities',
  'You are a creative brainstorming partner. You think outside the box, offer diverse perspectives, and build on ideas enthusiastically. You ask thought-provoking questions, suggest unconventional approaches, and help explore possibilities without judgment. You encourage wild ideas and creative risk-taking.',
  true,
  false
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON personas(user_id);
CREATE INDEX IF NOT EXISTS idx_personas_is_default ON personas(is_default);
