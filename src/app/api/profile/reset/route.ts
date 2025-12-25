import { NextResponse } from "next/server";
import { mergeProfile } from "@/lib/profile-data";
import { resetStoredProfile } from "@/lib/server/profileStore";

export async function POST() {
  try {
    await resetStoredProfile();
    const profile = mergeProfile();
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("POST /api/profile/reset failed", error);
    return NextResponse.json(
      { error: "Failed to reset profile" },
      { status: 500 }
    );
  }
}
