import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));
    const answer = data.answer || "yes";
    const topic =
      process.env.NTFY_TOPIC ||
      process.env.NEXT_PUBLIC_NTFY_TOPIC ||
      "gtw-ketali-dare-alert";

    // Send push notification via ntfy.sh
    const response = await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers: {
        Title: "Ketali said YES!",
        Priority: "urgent",
        Tags: "tada,sparkles,heart_eyes,party_popper",
      },
      body: `🚨 DARE ALERT: Ketali answered ${answer.toUpperCase()}!\nTime: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`,
    });

    if (!response.ok) {
      console.warn("ntfy response status:", response.status);
    }

    return NextResponse.json({ success: true, topic });
  } catch (error) {
    console.error("Failed to notify via ntfy:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
