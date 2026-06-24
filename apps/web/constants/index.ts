export const sidebarLinks = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Dashboard",
  },
  {
    imgURL: "/icons/dollar-circle.svg",
    route: "/my-banks",
    label: "My Banks",
  },
  {
    imgURL: "/icons/transaction.svg",
    route: "/transaction-history",
    label: "Transaction History",
  },
  {
    imgURL: "/icons/money-send.svg",
    route: "/payment-transfer",
    label: "Transfer Funds",
  },
];

// good_user / good_password - Bank of America
export const TEST_USER_ID = "6627ed3d00267aa6fa3e";

// custom_user -> Chase Bank
// export const TEST_ACCESS_TOKEN =
//   "access-sandbox-da44dac8-7d31-4f66-ab36-2238d63a3017";

// custom_user -> Chase Bank
export const TEST_ACCESS_TOKEN =
  "access-sandbox-229476cf-25bc-46d2-9ed5-fba9df7a5d63";

export const ITEMS = [
  {
    id: "6624c02e00367128945e", // appwrite item Id
    accessToken: "access-sandbox-83fd9200-0165-4ef8-afde-65744b9d1548",
    itemId: "VPMQJKG5vASvpX8B6JK3HmXkZlAyplhW3r9xm",
    userId: "6627ed3d00267aa6fa3e",
    accountId: "X7LMJkE5vnskJBxwPeXaUWDBxAyZXwi9DNEWJ",
  },
  {
    id: "6627f07b00348f242ea9", // appwrite item Id
    accessToken: "access-sandbox-74d49e15-fc3b-4d10-a5e7-be4ddae05b30",
    itemId: "Wv7P6vNXRXiMkoKWPzeZS9Zm5JGWdXulLRNBq",
    userId: "6627ed3d00267aa6fa3e",
    accountId: "x1GQb1lDrDHWX4BwkqQbI4qpQP1lL6tJ3VVo9",
  },
];

export const topCategoryStyles = {
  "Food and Drink": {
    bg: "bg-indigo-950/30",
    circleBg: "bg-indigo-900/40",
    text: {
      main: "text-indigo-300",
      count: "text-indigo-400",
    },
    progress: {
      bg: "bg-indigo-950/50",
      indicator: "bg-indigo-500",
    },
    icon: "/icons/a-coffee.svg",
  },
  Travel: {
    bg: "bg-emerald-950/30",
    circleBg: "bg-emerald-900/40",
    text: {
      main: "text-emerald-300",
      count: "text-emerald-400",
    },
    progress: {
      bg: "bg-emerald-950/50",
      indicator: "bg-emerald-500",
    },
    icon: "/icons/coins.svg",
  },
  Payment: {
    bg: "bg-amber-950/30",
    circleBg: "bg-amber-900/40",
    text: {
      main: "text-amber-300",
      count: "text-amber-400",
    },
    progress: {
      bg: "bg-amber-950/50",
      indicator: "bg-amber-500",
    },
    icon: "/icons/money-send.svg",
  },
  "Bank Fees": {
    bg: "bg-violet-950/30",
    circleBg: "bg-violet-900/40",
    text: {
      main: "text-violet-300",
      count: "text-violet-400",
    },
    progress: {
      bg: "bg-violet-950/50",
      indicator: "bg-violet-500",
    },
    icon: "/icons/dollar-circle.svg",
  },
  Transfer: {
    bg: "bg-cyan-950/30",
    circleBg: "bg-cyan-900/40",
    text: {
      main: "text-cyan-300",
      count: "text-cyan-400",
    },
    progress: {
      bg: "bg-cyan-950/50",
      indicator: "bg-cyan-500",
    },
    icon: "/icons/bank-transfer.svg",
  },
  Processing: {
    bg: "bg-slate-950/30",
    circleBg: "bg-slate-900/40",
    text: {
      main: "text-slate-300",
      count: "text-slate-400",
    },
    progress: {
      bg: "bg-slate-950/50",
      indicator: "bg-slate-500",
    },
    icon: "/icons/transaction.svg",
  },
  Success: {
    bg: "bg-teal-950/30",
    circleBg: "bg-teal-900/40",
    text: {
      main: "text-teal-300",
      count: "text-teal-400",
    },
    progress: {
      bg: "bg-teal-950/50",
      indicator: "bg-teal-500",
    },
    icon: "/icons/deposit.svg",
  },
  default: {
    bg: "bg-rose-950/30",
    circleBg: "bg-rose-900/40",
    text: {
      main: "text-rose-300",
      count: "text-rose-400",
    },
    progress: {
      bg: "bg-rose-950/50",
      indicator: "bg-rose-500",
    },
    icon: "/icons/shopping-bag.svg",
  },
};

export const transactionCategoryStyles = {
  "Food and Drink": {
    borderColor: "border-rose-500/30",
    backgroundColor: "bg-rose-500",
    textColor: "text-rose-400",
    chipBackgroundColor: "bg-rose-950/30",
  },
  Payment: {
    borderColor: "border-emerald-500/30",
    backgroundColor: "bg-emerald-500",
    textColor: "text-emerald-400",
    chipBackgroundColor: "bg-emerald-950/30",
  },
  "Bank Fees": {
    borderColor: "border-amber-500/30",
    backgroundColor: "bg-amber-500",
    textColor: "text-amber-400",
    chipBackgroundColor: "bg-amber-950/30",
  },
  Transfer: {
    borderColor: "border-violet-500/30",
    backgroundColor: "bg-violet-500",
    textColor: "text-violet-400",
    chipBackgroundColor: "bg-violet-950/30",
  },
  Processing: {
    borderColor: "border-slate-500/30",
    backgroundColor: "bg-slate-500",
    textColor: "text-slate-400",
    chipBackgroundColor: "bg-slate-800/50",
  },
  Success: {
    borderColor: "border-emerald-500/30",
    backgroundColor: "bg-emerald-500",
    textColor: "text-emerald-400",
    chipBackgroundColor: "bg-emerald-950/30",
  },
  Travel: {
    borderColor: "border-cyan-500/30",
    backgroundColor: "bg-cyan-500",
    textColor: "text-cyan-400",
    chipBackgroundColor: "bg-cyan-950/30",
  },
  default: {
    borderColor: "border-indigo-500/30",
    backgroundColor: "bg-indigo-500",
    textColor: "text-indigo-400",
    chipBackgroundColor: "bg-indigo-950/30",
  },
};