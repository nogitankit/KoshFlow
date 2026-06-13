# KoshFlow Project Directory Tree

```
KoshFlow/
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc
├── AGENTS.md
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── turbo.json
│
├── apps/
│   └── web/
│       ├── components.json
│       ├── eslint.config.js
│       ├── next-env.d.ts
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       │
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── (auth)/
│       │   │   ├── layout.tsx
│       │   │   ├── sign-in/
│       │   │   │   └── page.tsx
│       │   │   └── sign-up/
│       │   │       └── page.tsx
│       │   └── (root)/
│       │       ├── layout.tsx
│       │       └── page.tsx
│       │
│       ├── components/
│       │   ├── Counter.tsx
│       │   ├── Doughnut.tsx
│       │   ├── MobileNav.tsx
│       │   ├── Sidebar.tsx
│       │   ├── TotalBalanceBox.tsx
│       │   ├── headerBox.tsx
│       │   └── theme-provider.tsx
│       │
│       ├── constants/
│       │   └── index.ts
│       │
│       ├── lib/
│       │   └── utils.ts
│       │
│       ├── public/
│       │   └── icons/
│       │
│       └── types/
│           └── index.d.ts
│
└── packages/
    ├── eslint-config/
    │   ├── base.js
    │   ├── next.js
    │   ├── package.json
    │   ├── react-internal.js
    │   └── README.md
    │
    ├── typescript-config/
    │   ├── base.json
    │   ├── nextjs.json
    │   ├── package.json
    │   ├── react-library.json
    │   └── README.md
    │
    └── ui/
        ├── components.json
        ├── eslint.config.js
        ├── package.json
        ├── postcss.config.mjs
        ├── tsconfig.json
        ├── tsconfig.lint.json
        │
        ├── src/
        │   ├── components/
        │   │   └── button.tsx
        │   │
        │   ├── hooks/
        │   │
        │   ├── lib/
        │   │   └── utils.ts
        │   │
        │   └── styles/
        │       └── globals.css
```

## Project Structure Overview

**KoshFlow** is a monorepo using:
- **Turbo** for workspace management
- **Next.js** for the web application
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shared packages** for reusable configs and UI components

### Key Directories:
- **`apps/web/`** - Main Next.js application
  - Auth routes (sign-in, sign-up)
  - Root dashboard layout
  - UI components (navigation, charts, balance box)
  
- **`packages/`** - Shared configuration and component packages
  - `eslint-config/` - ESLint configurations
  - `typescript-config/` - TypeScript configuration presets
  - `ui/` - Shared UI components library
