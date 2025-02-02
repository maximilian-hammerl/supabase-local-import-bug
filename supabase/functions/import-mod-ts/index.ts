import { functionA, functionB } from "another-project";

Deno.serve(() => {
  const message = "Edge function with mod.ts import";

  functionA(message);
  functionB(message);

  return new Response(
    JSON.stringify({ message }),
    { headers: { "Content-Type": "application/json" } },
  );
});
