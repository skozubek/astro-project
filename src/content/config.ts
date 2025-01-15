// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { type SupportedLanguages } from '../i18n/i18n-config';

// UI collection schema
const uiSchema = z.object({
  id: z.enum(['en', 'pl']),
  meta: z.object({
    description: z.string(),
  }),
  nav: z.object({
    schedule: z.string(),
    twitter: z.string(),
  }),
  newsletter: z.object({
    title: z.string(),
    description: z.string(),
    placeholder: z.string(),
    button: z.string(),
    toast: z.object({
      success: z.string(),
      error: z.object({
        invalid: z.string(),
        failed: z.string(),
        server: z.string(),
        general: z.string(),
      }),
    }),
  }),
  tools: z.object({
    title: z.string(),
    description: z.string(),
    website: z.string(),
    key_features: z.string(),
    last_updated: z.string(),
    categories: z.record(z.string()),
    ecosystems: z.record(z.string()),
    status: z.record(z.string()),
    filters: z.record(z.string()),
    pricing: z.record(z.string()),
  }),
  footer: z.object({
    description: z.string(),
  }),
  copyright: z.string(),
});

// Home collection schema
const homeSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string()
  }),
  consultations: z.object({
    title: z.string(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string()
    }))
  }),
  services: z.object({
    title: z.string(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string()
    }))
  }),
  discovery: z.object({
    title: z.string(),
    description: z.string(),
    cta: z.string()
  }),
  benefits: z.object({
    title: z.string(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string()
    }))
  })
});

/**
 * Core categories for Web3 tools
 */
const categorySchema = z.enum([
  'wallets',         // Crypto wallets, key management
  'marketplaces',    // NFT and token marketplaces
  'defi',           // DeFi protocols and tools
  'infrastructure', // RPCs, nodes, indexers
  'security',       // Security tools, audit tools
  'analytics',      // Data analytics, market tracking
  'other'          // Catch-all for edge cases
]);

/**
 * Tool status indicators
 */
const statusSchema = z.enum([
  'active',     // Tool is actively maintained
  'beta',       // Tool is in testing phase
  'deprecated'  // Tool is no longer maintained
]);

/**
 * Supported blockchain ecosystems
 */
const ecosystemSchema = z.array(z.enum([
  'bitcoin',    // BTC, Ordinals, Lightning
  'ethereum',   // ETH, EVM chains
  'solana',     // SOL ecosystem
  'multichain', // Cross-chain solutions
  'other'       // Other blockchains
])).min(1);

/**
 * Schema for multilingual tool content
 */
const toolTranslationsSchema = z.record(
  z.custom<SupportedLanguages>(), // Use the imported type
  z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.string()),
    sections: z.array(z.object({
      title: z.string(),
      content: z.string()
    })),
    keyFeatures: z.array(z.object({
      title: z.string(),
      items: z.array(z.string())
    }))
  })
);

/**
 * Main tool schema
 * Combines metadata with translations
 */
const toolSchema = z.object({
  id: z.string(),
  logo: z.string().optional(),
  screenshot: z.string().optional(),
  website: z.string().url(),
  github: z.string().url().optional(),
  social: z.object({
    x: z.string().url().optional(),
    discord: z.string().url().optional(),
    telegram: z.string().url().optional(),
  }).optional(),
  category: z.enum(['wallets', 'marketplaces', 'defi', 'infrastructure', 'security', 'analytics', 'other']),
  ecosystems: z.array(z.enum(['bitcoin', 'ethereum', 'solana', 'multichain', 'other'])).min(1),
  status: z.enum(['active', 'beta', 'deprecated']),
  lastUpdated: z.date(),
  i18n: toolTranslationsSchema,
  metadata: z.object({
    tags: z.array(z.string()),
    pricing: z.enum(['free', 'paid', 'hybrid'])
  }).optional()
});

// Collections Configuration
const tools = defineCollection({
  schema: toolSchema,
  // Update the loader to use glob for loading MDX files
  loader: glob({
    pattern: "tools/**/**.mdx",
    base: "./src/content"
  })
});

const home = defineCollection({
  type: 'data',
  schema: homeSchema,
});

const ui = defineCollection({
  type: 'data',
  schema: uiSchema,
});

// Export the collections
export const collections = { tools, home, ui };

// Export type helpers
export type Tool = z.infer<typeof toolSchema>;
export type ToolTranslations = z.infer<typeof toolTranslationsSchema>;
export type ToolCategory = z.infer<typeof categorySchema>;
export type ToolStatus = z.infer<typeof statusSchema>;
export type ToolEcosystem = z.infer<typeof ecosystemSchema>[number];