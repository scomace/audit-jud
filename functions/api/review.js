export async function onRequestPost(context) {
  const GEMINI_KEY = context.env.GEMINI_API_KEY;

  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { steps } = await context.request.json();

  const systemPrompt = `You are evaluating audit workpaper responses for an Allowance for Doubtful Accounts engagement. The client is Sample Corp with trade receivables analyzed using an A/R aging approach.

Analyze the student's responses to 5 professional judgment steps and return ONLY a valid JSON object with boolean evaluations. No other text, no markdown, no explanation, no backticks. Just the raw JSON object.

Evaluation criteria:

Step 1 (Clarify Issues & Objectives):
- "valuation": Did the student explain that VALUATION (not merely existence) of accounts receivable is being tested? Look for words like valuation, value, fairly stated, reasonableness of amounts, measurement. If they ONLY mention existence or just say "test accounts receivable" without mentioning valuation concepts, this is false.
- "completeness": Did the student mention that COMPLETENESS of the allowance for expected credit losses (ECL) or allowance for doubtful accounts is being tested? They must specifically reference the allowance/reserve being complete, not just mention A/R.
- "materiality": Did the student specify any specific dollar amount ($) or percentage (%) threshold related to materiality or tolerable misstatement? General references to "materiality" without a number do NOT count.

Step 2 (Consider Alternatives):
- "accept_rates": Did the student mention comparing or accepting client's reserve rates against prior year as an approach?
- "historical_writeoff": Did the student mention recalculating or analyzing historical write-off data as an approach?
- "industry_benchmark": Did the student mention benchmarking against industry loss rates, peer companies, or external data as an approach?

Step 3 (Gather & Evaluate Information):
- "consistent": Are the procedures described logically consistent with at least one approach identified in Step 2? If Step 2 was empty or vague, evaluate whether the procedures described would be reasonable for ANY of the three standard approaches.

Step 4 (Reach Conclusion):
- "links_to_objective": Does the conclusion explicitly reference or connect back to the objective stated in Step 1? Look for references to the assertion being tested, the materiality threshold, or the specific objective language from Step 1.

Step 5 (Articulate & Document Rationale):
- "summarizes": Does this provide a cohesive summary that references work from multiple prior steps (not just restating the conclusion)?

Return ONLY this exact JSON structure with true/false values:
{"step1":{"valuation":true,"completeness":true,"materiality":true},"step2":{"accept_rates":true,"historical_writeoff":true,"industry_benchmark":true},"step3":{"consistent":true},"step4":{"links_to_objective":true},"step5":{"summarizes":true}}`;

  const userMessage = `Here are the student's 5 professional judgment step responses to evaluate:

Step 1 - Clarify Issues & Objectives:
${steps[0] || "(left blank)"}

Step 2 - Consider Alternatives:
${steps[1] || "(left blank)"}

Step 3 - Gather & Evaluate Information:
${steps[2] || "(left blank)"}

Step 4 - Reach Conclusion:
${steps[3] || "(left blank)"}

Step 5 - Articulate & Document Rationale:
${steps[4] || "(left blank)"}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      { role: "user", parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.1,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await geminiRes.json();

  if (!geminiRes.ok) {
    return new Response(JSON.stringify({ error: "Gemini API error", details: data }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Try multiple parsing strategies
  let parsed = null;
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  // Strategy 1: direct parse
  try { parsed = JSON.parse(cleaned); } catch {}

  // Strategy 2: extract first { ... } block
  if (!parsed) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try { parsed = JSON.parse(match[0]); } catch {}
    }
  }

  // Strategy 3: fallback with all false
  if (!parsed) {
    parsed = {
      step1: { valuation: false, completeness: false, materiality: false },
      step2: { accept_rates: false, historical_writeoff: false, industry_benchmark: false },
      step3: { consistent: false },
      step4: { links_to_objective: false },
      step5: { summarizes: false },
    };
  }

  return new Response(JSON.stringify({ results: parsed }), {
    headers: { "Content-Type": "application/json" },
  });
}