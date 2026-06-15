import { cookies } from "next/headers";
import { createAdminClient } from "@/utils/supabase/admin";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createAdminClient(cookieStore);

const response = await supabase
  .from("users")
  .select("*");

  return (
    <pre>
      {JSON.stringify(response.data, null, 2)}
    </pre>
  );
}