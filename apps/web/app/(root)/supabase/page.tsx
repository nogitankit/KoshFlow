import { createAdminClient } from "@/utils/supabase/admin";
// import {cookies} from 'next/headers'
export default async function Page() {
  const supabase = createAdminClient();
//pass cookies param if breaks idk
  const response = await supabase
    .from("users")
    .select("*");

  return (
    <pre>
      {JSON.stringify(response.data, null, 2)}
    </pre>
  );
}