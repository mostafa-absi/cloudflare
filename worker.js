import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API endpoint
    if (url.pathname === "/api/lead" && request.method === "POST") {
      try {
        const { value } = await request.json();
        if (!value) return new Response("Bad Request", { status: 400 });

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: env.CHAT_ID, text: `📩 لید جدید:\n${value}` }),
        });

        return new Response("OK");
      } catch (err) {
        return new Response("Error", { status: 500 });
      }
    }

    // فایل‌های استاتیک
    try {
      return await getAssetFromKV(request);
    } catch (err) {
      return new Response("Not Found", { status: 404 });
    }
  }
};
