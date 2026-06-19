"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

//import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // get banks from db
    const banks = await getBanks({ userId });

    if (!banks || banks.length === 0) {
      return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
    }

    const accounts = await Promise.all(
      banks.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.access_token,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        // Calculate database balance adjustment
        let balanceAdjustment = 0;
        try {
          const dbTransactions = await getTransactionsByBankId({ bankId: bank.accountId }) || [];
          for (const t of dbTransactions) {
            const amount = parseFloat(t.amount);
            if (t.type === "debit") {
              balanceAdjustment -= amount;
            } else if (t.type === "credit") {
              balanceAdjustment += amount;
            }
          }
        } catch (e) {
          console.warn("Could not calculate database balance adjustment:", e);
        }

        const account = {
          id: accountData.account_id,
          availableBalance: (accountData.balances.available! || 0) + balanceAdjustment,
          currentBalance: (accountData.balances.current! || 0) + balanceAdjustment,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          itemId: bank.accountId,
          shareableId: bank.shareableId,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async ({ itemId }: { itemId: string }) => {
  try {
    // get bank from db
    const bank = await getBank({ documentId: itemId });

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.access_token,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    let transactions: any[] = [];
    let balanceAdjustment = 0;
    try {
      const plaidTransactions = await getTransactions({ accessToken: bank?.access_token }) || [];
      const dbTransactions = await getTransactionsByBankId({ bankId: bank.accountId }) || [];
      transactions = [...plaidTransactions, ...dbTransactions];

      for (const t of dbTransactions) {
        const amount = parseFloat(t.amount);
        if (t.type === "debit") {
          balanceAdjustment -= amount;
        } else if (t.type === "credit") {
          balanceAdjustment += amount;
        }
      }
    } catch (e) {
      console.warn("Could not fetch transactions (consent may be missing):", e);
    }

    const account = {
      id: accountData.account_id,
      availableBalance: (accountData.balances.available! || 0) + balanceAdjustment,
      currentBalance: (accountData.balances.current! || 0) + balanceAdjustment,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      itemId: bank.accountId,
    };

    // sort transactions by date such that the most recent transaction is first
    const sortedTransactions = (transactions || []).sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: sortedTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const institution = institutionResponse.data.institution;

    return parseStringify(institution);
  } catch (error) {
    console.error("An error occurred while getting the institution:", error);
  }
};

// Get transactions from Plaid
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];
  let cursor = "";

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        cursor,
      });

      const data = response.data;

      transactions = [...transactions, ...data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.personal_finance_category ? transaction.personal_finance_category.primary : "",
        date: transaction.date,
        image: transaction.logo_url,
      }))];

      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the transactions:", error);
  }
};

// Get transfer transactions by bank ID from Supabase
export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`senderBankId.eq.${bankId},receiverBankId.eq.${bankId}`);

    if (error) throw error;

    const transactions = (data || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      amount: t.amount,
      date: t.created_at,
      paymentChannel: t.channel,
      category: t.category,
      type: t.senderBankId === bankId ? "debit" : "credit",
    }));

    return transactions;
  } catch (error) {
    console.error("An error occurred while getting transactions by bank ID:", error);
    return [];
  }
};

// Create Transfer
export const createTransfer = async ({
  accessToken,
  accountId,
  amount,
  legalName,
  description,
}: {
  accessToken: string;
  accountId: string;
  amount: string;
  legalName: string;
  description: string;
}) => {
  try {
    const transferAuthRequest: TransferAuthorizationCreateRequest = {
      access_token: accessToken,
      account_id: accountId,
      type: "debit" as TransferType,
      network: "ach" as TransferNetwork,
      amount,
      ach_class: "ppd" as ACHClass,
      user: {
        legal_name: legalName,
      },
    };

    const transferAuthResponse =
      await plaidClient.transferAuthorizationCreate(transferAuthRequest);
    const authorizationId = transferAuthResponse.data.authorization.id;

    const transferCreateRequest: TransferCreateRequest = {
      access_token: accessToken,
      account_id: accountId,
      description,
      authorization_id: authorizationId,
    };

    const responseCreateResponse = await plaidClient.transferCreate(
      transferCreateRequest
    );

    const transfer = responseCreateResponse.data.transfer;
    return parseStringify(transfer);
  } catch (error) {
    console.error(
      "An error occurred while creating transfer authorization:",
      error
    );
    throw error;
  }
};

// Create Transaction in Supabase
export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        name: transaction.name,
        amount: transaction.amount,
        senderId: transaction.senderId,
        senderBankId: transaction.senderBankId,
        receiverId: transaction.receiverId,
        receiverBankId: transaction.receiverBankId,
        email: transaction.email,
        channel: "online",
        category: "Transfer",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating transaction in Supabase:", error);
      throw error;
    }

    return parseStringify(data);
  } catch (error) {
    console.error("An error occurred while creating transaction:", error);
    throw error;
  }
};