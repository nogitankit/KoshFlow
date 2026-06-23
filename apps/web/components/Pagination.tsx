"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/utils";

export const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams()!;

  const handleNavigation = (type: "prev" | "next") => {
    const pageNumber = type === "prev" ? page - 1 : page + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageNumber.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors rounded-lg px-3"
        onClick={() => handleNavigation("prev")}
        disabled={Number(page) <= 1}
      >
        <span className="mr-1.5 text-[16px]">←</span>
        <span className="text-[13px] font-medium">Prev</span>
      </Button>
      <p className="text-[13px] flex items-center px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 font-(family-name:--font-jetbrains-mono) tabular-nums">
        {page} <span className="text-slate-600 mx-1.5">/</span> {totalPages}
      </p>
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors rounded-lg px-3"
        onClick={() => handleNavigation("next")}
        disabled={Number(page) >= totalPages}
      >
        <span className="text-[13px] font-medium">Next</span>
        <span className="ml-1.5 text-[16px]">→</span>
      </Button>
    </div>
  );
};