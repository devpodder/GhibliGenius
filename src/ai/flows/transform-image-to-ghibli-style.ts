
// src/ai/flows/transform-image-to-ghibli-style.ts
'use server';

/**
 * @fileOverview Transforms an uploaded image into a Ghibli-style image.
 *
 * - transformImageToGhibliStyle - A function that transforms an image into Ghibli style.
 * - TransformImageToGhibliStyleInput - The input type for the transformImageToGhibliStyle function.
 * - TransformImageToGhibliStyleOutput - The return type for the transformImageToGhibliStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransformImageToGhibliStyleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to transform to Ghibli style, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TransformImageToGhibliStyleInput = z.infer<typeof TransformImageToGhibliStyleInputSchema>;

const TransformImageToGhibliStyleOutputSchema = z.object({
  transformedImage: z
    .string()
    .describe('The transformed image in Ghibli style, as a data URI.'),
});
export type TransformImageToGhibliStyleOutput = z.infer<typeof TransformImageToGhibliStyleOutputSchema>;

export async function transformImageToGhibliStyle(
  input: TransformImageToGhibliStyleInput
): Promise<TransformImageToGhibliStyleOutput> {
  return transformImageToGhibliStyleFlow(input);
}

// The ai.definePrompt object is removed as the flow will call ai.generate directly.

const transformImageToGhibliStyleFlow = ai.defineFlow(
  {
    name: 'transformImageToGhibliStyleFlow',
    inputSchema: TransformImageToGhibliStyleInputSchema,
    outputSchema: TransformImageToGhibliStyleOutputSchema,
  },
  async (input: TransformImageToGhibliStyleInput) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: 'Transform this image into Ghibli style.'},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed: No media URL returned from the model.');
    }
    return {transformedImage: media.url};
  }
);

