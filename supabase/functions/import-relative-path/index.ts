import { functionA } from "another-project/file_a.ts";

Deno.serve(() => {
  const message = "Edge function with relative path import";

  functionA(message);

  return new Response(
    JSON.stringify({ message }),
    { headers: { "Content-Type": "application/json" } },
  );
});
