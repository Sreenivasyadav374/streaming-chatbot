import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export const CHAT_MODEL = 'gpt-3.5-turbo';
