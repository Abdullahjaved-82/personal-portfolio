import { NextResponse } from "next/server";
import { mergeProfile, type ProfileData } from "@/lib/profile-data";
import { readStoredProfile, writeStoredProfile } from "@/lib/server/profileStore";

export async function GET() {
  try {
    const stored = await readStoredProfile();
    const profile = mergeProfile(stored?.profile ?? undefined);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("GET /api/profile failed", error);
    const message = error instanceof Error ? error.message : "Failed to load profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { profile?: unknown };
    const incoming = (body?.profile ?? {}) as Partial<ProfileData>;

    const merged = mergeProfile(incoming);
    await writeStoredProfile(merged);

    return NextResponse.json({ profile: merged });
  } catch (error) {
    console.error("PUT /api/profile failed", error);
    const message = error instanceof Error ? error.message : "Failed to save profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
