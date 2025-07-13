# Webprodogies Spotlight

This is a Next.js application bootstrapped with `create-next-app`. It uses Prisma as an ORM for database management, Clerk for authentication, and Shadcn/UI for the component library.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Database](#database)
- [Linting and Formatting](#linting-and-formatting)
- [Deployment](#deployment)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v20 or later)
- npm or yarn
- A running PostgreSQL database instance

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/webprodogies-spotlight.git
    cd webprodogies-spotlight
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the necessary environment variables. See the [Environment Variables](#environment-variables) section for more details.

4.  **Run database migrations:**

    ```bash
    npx prisma migrate dev
    ```

### Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The following environment variables are required to run the application. Create a `.env.local` file in the root of the project and add the following:

```
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home
```

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Linting:** [ESLint](https://eslint.org/)
- **TypeScript:** [TypeScript](https://www.typescriptlang.org/)

## Project Structure

```
.
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
├── src/
│   ├── actions/            # Server-side actions
│   ├── app/                # Next.js App Router
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library functions and utilities
│   ├── providers/          # React context providers
│   └── store/              # Zustand store
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Authentication

Authentication is handled by [Clerk](https://clerk.com/). The relevant files are:

- `src/middleware.ts`: Protects routes and handles authentication.
- `src/app/(auth)/`: Contains the sign-in and sign-up pages.
- `src/actions/auth.ts`: Contains authentication-related server actions.

## Database

This project uses [Prisma](https://www.prisma.io/) as the ORM to interact with a PostgreSQL database. The database schema is defined in `prisma/schema.prisma`.

To apply database migrations, run:

```bash
npx prisma migrate dev
```

To generate the Prisma Client, run:

```bash
npx prisma generate
```

## Linting and Formatting

This project uses [ESLint](https://eslint.org/) for linting. To run the linter, use the following command:

```bash
npm run lint
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.