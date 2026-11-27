import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const features = defineCollection({
  loader: glob({ pattern: '*.md', base: './content' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    format: z.string().trim().min(1),
    topics: z.array(z.string().trim().min(1)).min(1),
    demo: z.object({
      id: z.string().regex(/^[A-Za-z0-9]+$/),
      title: z.string().trim().min(1),
      height: z.number().int().positive()
    }),
    afterDemo: z.string().trim().min(1)
  }).strict()
});

export const collections = { features };
