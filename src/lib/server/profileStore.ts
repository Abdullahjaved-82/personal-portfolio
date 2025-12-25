import path from "path";
import { promises as fs } from "fs";
import type { ProfileData } from "@/lib/profile-data";

const DATA_DIR = path.join(process.cwd(), "data");
const PROFILE_PATH = path.join(DATA_DIR, "profile.json");

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
  await fs.rename(tmpPath, filePath);
}

export async function readStoredProfile(): Promise<StoredProfileFile | null> {
  return readJsonFile<StoredProfileFile>(PROFILE_PATH);
}

export async function writeStoredProfile(profile: ProfileData): Promise<void> {
  await writeJsonAtomic(PROFILE_PATH, { profile, updatedAt: new Date().toISOString() } satisfies StoredProfileFile);
}

export async function resetStoredProfile(): Promise<void> {
  try {
    await fs.unlink(PROFILE_PATH);
  } catch (err: any) {
    if (err?.code === "ENOENT") return;
    throw err;
  }
}
