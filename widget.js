// ⭐ AI MESSAGE ROUTE ⭐
app.post("/api/message", async (req, res) => {
  try {
    const { business_id, message } = req.body;

    // 1. Fetch business info
    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", business_id)
      .single();

    if (!business) {
      return res.status(400).json({ error: "Business not found" });
    }

    // Build prompt
    const prompt = `
You are the AI assistant for ${business.name}.
Here is the important information you must use:
Hours: ${business.hours}
Services: ${business.services}
FAQs: ${business.faqs}
Tone: ${business.tone}

Customer said: "${message}"
Respond clearly using their tone.
`;

    // ⭐ NEW OPENAI RESPONSE API ⭐
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ]
    });

    // ⭐ NEW WAY TO READ OUTPUT ⭐
    const aiReply = response.output[0].content[0].text;

    // 3. Send AI reply back
    res.json({ reply: aiReply });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "Server error." });
  }
});
