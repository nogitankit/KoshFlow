 "use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSeclected] = useState<Account | undefined>(accounts[0]);

  useEffect(() => {
    if (accounts.length > 0) {
      const isSelectedInAccounts = accounts.some((acc) => acc.itemId === selected?.itemId);
      if (!isSelectedInAccounts) {
        setSeclected(accounts[0]);
        if (setValue) {
          setValue("senderBank", accounts[0]?.itemId);
        }
      }
    }
  }, [accounts, selected, setValue]);

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.itemId === id)!;

    setSeclected(account);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });
    router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <Select
      value={selected?.itemId}
      onValueChange={(value) => handleBankChange(value)}
    >
      <SelectTrigger
        className={`flex w-full gap-3 md:w-[300px] ${otherStyles}`}
      >
        <Image
          src="/icons/credit-card.svg"
          width={20}
          height={20}
          alt="account"
        />
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent
        className={`w-full md:w-[300px] ${otherStyles}`}
        align="end"
        position="popper"
      >
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">
            Select a bank to display
          </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.itemId}
              className="cursor-pointer border-t"
            >
              <div className="flex flex-col ">
                <p className="text-16 font-medium">{account.name}</p>
                <p className="text-14 font-medium text-blue-600">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};