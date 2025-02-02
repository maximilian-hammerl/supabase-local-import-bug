import { functionA } from "another-project/a.ts";
import { functionB } from "another-project/b.ts";

Deno.serve(() => {
  const message = "Edge function with relative path import";

  functionA(message);
  functionB(message);

  return new Response(
    JSON.stringify({ message }),
    { headers: { "Content-Type": "application/json" } },
  );
});
