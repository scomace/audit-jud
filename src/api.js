export async function sendIM(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return { reply: data.reply, flagged: data.flagged };
}

export async function sendEmail(messages) {
  const res = await fetch("/api/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return { reply: data.reply, docsAttached: data.docsAttached };
}

export async function submitReview(steps) {
  const res = await fetch("/api/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steps }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data.results;
}