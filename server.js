import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";


dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/api/lead", async (req, res) => {
  try {
    const { name, whatsapp, business } = req.body;

    if (!name || !whatsapp || !business) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = `
🚀 NEW LEAD

👤 Name: ${name}
📱 WhatsApp: ${whatsapp}
🏢 Business: ${business}
    `;

    console.log("BOT:", process.env.BOT_TOKEN);
    console.log("CHAT:", process.env.CHAT_ID);

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ fixed
        },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: message,
        }),
      }
    );

    const data = await telegramRes.json();

    if (!data.ok) {
      console.error("Telegram API error:", data);
      throw new Error(data.descriptioon);
    }

    // ✅ correct response
    res.json({ success: true });

    app.get('/ping', (req, res) => res.send('Ok'));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, ()=>{
    console.log(`Server runnning on port ${PORT}`)
})
