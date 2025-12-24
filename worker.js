export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API
    if (url.pathname === "/api/lead" && request.method === "POST") {
      try {
        const { value } = await request.json();
        if (!value) {
          return new Response("Bad Request", { status: 400 });
        }

        await fetch(
          `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: env.CHAT_ID,
              text: `📩 لید جدید:\n${value}`,
            }),
          }
        );

        return new Response("OK");
      } catch (e) {
        return new Response("Server Error", { status: 500 });
      }
    }

    // Static assets (NEW Cloudflare way)
    return env.ASSETS.fetch(request);
  },
};
