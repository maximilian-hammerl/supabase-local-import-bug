import { functionA } from "another-project";

Deno.serve(() => {
  const message = "Edge function with mod.ts import";

  functionA(message);

  return new Response(
    JSON.stringify({ message }),
    { headers: { "Content-Type": "application/json" } },
  );
});
