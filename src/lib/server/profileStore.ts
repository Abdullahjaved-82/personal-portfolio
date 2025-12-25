import path from "path";
import { promises as fs } from "fs";
import type { ProfileData } from "@/lib/profile-data";

const DATA_DIR = path.join(process.cwd(), "data");
const PROFILE_PATH = path.join(DATA_DIR, "profile.json");

const KV_KEY = "portfolio:profile";

function kvEnabled() {
  // On Vercel this is configured automatically when you add KV to the project.
  // Locally, it will be absent unless you `vercel env pull`.
  return Boolean(process.env.KV_REST_API_URL || process.env.KV_URL);
}

export type StoredProfileFile = {
  profile: Partial<ProfileData>;
  updatedAt: string;
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err: any) {
    if (err?.code === "ENOENT") return null;
    throw err;
  }
}

async function writeJsonAtomic(filePath: string, payload: unknown) {
  await ensureDataDir();
  const tmpPath = `${filePath}.tmp`;
  const data = JSON.stringify(payload, null, 2);
  await fs.writeFile(tmpPath, data, "utf8");
  try {
    // On Windows, rename-to-existing can throw EPERM/EEXIST.
    await fs.rename(tmpPath, filePath);
  } catch (err: any) {
    if (err?.code === "EPERM" || err?.code === "EEXIST") {
      await fs.unlink(filePath).catch(() => undefined);
      await fs.rename(tmpPath, filePath);
    } else {
      throw err;
    }
  }
}

export async function readStoredProfile(): Promise<StoredProfileFile | null> {
  if (kvEnabled()) {
    try {
      const { kv } = await import("@vercel/kv");
      const stored = await kv.get<StoredProfileFile>(KV_KEY);
      return stored ?? null;
    } catch (err) {
      // Fall back to filesystem if KV isn't reachable in local dev.
      console.warn("KV read failed, falling back to file store", err);
    }
  }

  return readJsonFile<StoredProfileFile>(PROFILE_PATH);
}

export async function writeStoredProfile(profile: ProfileData): Promise<void> {
  const payload = { profile, updatedAt: new Date().toISOString() } satisfies StoredProfileFile;

  if (kvEnabled()) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.set(KV_KEY, payload);
      return;
    } catch (err) {
      console.warn("KV write failed, falling back to file store", err);
    }
  }

  await writeJsonAtomic(PROFILE_PATH, payload);
}

export async function resetStoredProfile(): Promise<void> {
  if (kvEnabled()) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.del(KV_KEY);
      return;
    } catch (err) {
      console.warn("KV delete failed, falling back to file store", err);
    }
  }

  try {
    await fs.unlink(PROFILE_PATH);
  } catch (err: any) {
    if (err?.code === "ENOENT") return;
    throw err;
  }
}
