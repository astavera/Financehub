import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { currentDebt, apr, monthlyPayment, totalSaved, monthsUntilPayoff } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a personal finance advisor. Analyze this car loan scenario and give a clear, concise recommendation in Spanish.

Car Loan Details:
- Current debt: $${currentDebt.toFixed(2)}
- APR: ${apr}%
- Monthly payment: $${monthlyPayment}
- Extra savings accumulated (in bank): $${totalSaved.toFixed(2)}
- Months until planned payoff (December 2026): ~${monthsUntilPayoff}

The user wants to know:
1. Should they use their accumulated savings ($${totalSaved.toFixed(2)}) to make a lump-sum payment on the car right now?
2. Or should they keep saving and pay it all in December 2026?

Consider:
- Interest savings from paying early vs keeping cash liquid
- Calculate approximate interest they'd save by paying now vs waiting
- Emergency fund implications
- Give a clear YES or NO recommendation with numbers to back it up

Keep response under 200 words. Be direct and practical.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a bilingual personal finance advisor. Always respond in Spanish." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const advice = data.choices?.[0]?.message?.content || "No recommendation available.";

    return new Response(JSON.stringify({ advice }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("car-payoff-advice error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
