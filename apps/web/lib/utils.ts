/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount*100);
}
export function toInr(amount: number): number {
  return amount*100
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

export const formatCategory = (value: string) => {
  return value.replace(/_/g, " ");
};


interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-indigo-950/30",
        lightBg: "bg-indigo-900/30",
        title: "text-indigo-300",
        subText: "text-indigo-400",
      };

    case "credit":
      return {
        bg: "bg-emerald-950/30",
        lightBg: "bg-emerald-900/30",
        title: "text-emerald-300",
        subText: "text-emerald-400",
      };

    default:
      return {
        bg: "bg-cyan-950/30",
        lightBg: "bg-cyan-900/30",
        title: "text-cyan-300",
        subText: "text-cyan-400",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};
export const authFormSchema = (type: string) =>
  z.object({
    // Sign Up Only
    firstName:
      type === "sign-in"
        ? z.string().optional()
        : z.string()
            .min(3, {
              message: "First name must be at least 3 characters.",
            }),

    lastName:
      type === "sign-in"
        ? z.string().optional()
        : z.string()
            .min(3, {
              message: "Last name must be at least 3 characters.",
            }),

    address1:
      type === "sign-in"
        ? z.string().optional()
        : z.string()
            .min(3, {
              message: "Please enter a valid address.",
            })
            .max(50, {
              message: "Address cannot exceed 50 characters.",
            }),

    city:
      type === "sign-in"
        ? z.string().optional()
        : z.string()
            .min(2, {
              error: "Please enter a valid city.",
            })
            .max(50, {
              error: "City name is too long.",
            }),

    state:
      type === "sign-in"
        ? z.string().optional()
        : z.string()
            .min(3, {
              error: "Enter a valid state.",
            })
            .max(20,{
              error: "State name is too long."
            }),

    postalCode:
      type === "sign-in"
        ? z.string().optional()
        : z.string()
            .min(3, {
              error: "Please enter a valid postal code.",
            })
            .max(10, {
              error: "Postal code is too long.",
            }),

    dateOfBirth:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(1, {
            error: "Date of birth is required.",
          }),

    // Both Sign In & Sign Up
    email: z.email({
      error: "Please enter a valid email address.",
    }),

    password: z.string().min(8, {
      message: "Password must be at least 8 characters long.",
    }),
  });


/*
export const formSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(20),
  address: z.string().min(3).max(50),
  state: z.string().min(3).max(20),
  postalCode: z.string().min(3).max(10),
  dob: z.string().min(3).max(10),
  //sign-in
  email: z.email({
    error: "Invalid email"
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(30, "Password must be at most 30 characters."),
})
    */