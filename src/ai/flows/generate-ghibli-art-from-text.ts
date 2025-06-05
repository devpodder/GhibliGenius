// src/ai/flows/generate-ghibli-art-from-text.ts
'use server';

/**
 * @fileOverview Flow to generate Ghibli-style art from a text prompt.
 *
 * - generateGhibliArtFromText - A function that generates Ghibli-style art from text.
 * - GenerateGhibliArtFromTextInput - The input type for the generateGhibliArtFromText function.
 * - GenerateGhibliArtFromTextOutput - The return type for the generateGhibliArtFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGhibliArtFromTextInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate Ghibli-style art from.'),
});
export type GenerateGhibliArtFromTextInput = z.infer<
  typeof GenerateGhibliArtFromTextInputSchema
>;

const GenerateGhibliArtFromTextOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The URL of the generated Ghibli-style art image.'),
});
export type GenerateGhibliArtFromTextOutput = z.infer<
  typeof GenerateGhibliArtFromTextOutputSchema
>;

export async function generateGhibliArtFromText(
  input: GenerateGhibliArtFromTextInput
): Promise<GenerateGhibliArtFromTextOutput> {
  return generateGhibliArtFromTextFlow(input);
}

const generateGhibliArtFromTextPrompt = ai.definePrompt({
  name: 'generateGhibliArtFromTextPrompt',
  input: {schema: GenerateGhibliArtFromTextInputSchema},
  output: {schema: GenerateGhibliArtFromTextOutputSchema},
  prompt: `Generate an image in the style of Studio Ghibli based on the following description: {{{prompt}}}. The image should evoke the whimsical and serene qualities typical of Ghibli films. Return the URL of the generated image.`,
});

const generateGhibliArtFromTextFlow = ai.defineFlow(
  {
    name: 'generateGhibliArtFromTextFlow',
    inputSchema: GenerateGhibliArtFromTextInputSchema,
    outputSchema: GenerateGhibliArtFromTextOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.prompt + ' in the style of Studio Ghibli',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {imageUrl: media.url!};
  }
);
