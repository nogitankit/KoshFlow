import Image from "next/image";

import { topCategoryStyles } from "@/constants";
import { cn } from "@/lib/utils";
import { formatCategory } from "@/lib/utils";
import { Progress } from "./ui/progress";

export const Category = ({ category }: CategoryProps) => {
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = topCategoryStyles[category.name as keyof typeof topCategoryStyles] ||
  topCategoryStyles.default;

  return (
    <div className={cn("gap-4.5 flex p-4 rounded-xl border border-transparent hover:border-white/5 transition-all duration-300 group/cat cursor-default", bg)}>
      <figure className={cn("flex-center size-10 rounded-full transition-transform duration-300 group-hover/cat:scale-110", circleBg)}>
        <Image src={icon} width={20} height={20} alt={category.name} className="opacity-80 group-hover/cat:opacity-100 transition-opacity" />
      </figure>
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="text-14 flex justify-between">
          <h2 className={cn("font-medium", main)}>{formatCategory(category.name)}</h2> 
          <h3 className={cn("font-normal font-(family-name:--font-jetbrains-mono) text-[13px]", count)}>{category.count}</h3>
        </div>
        <Progress
          value={(category.count / category.totalCount) * 100}
          className={cn("h-2 w-full rounded-full", progressBg)}
          indicatorClassName={cn("h-2 w-full rounded-full transition-all duration-500", indicator)}
        />
      </div>
    </div>
  );
};
export default Category;