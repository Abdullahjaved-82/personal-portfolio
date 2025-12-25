import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function GET() {
  try {
    await ensureUploadDir();
    const entries = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => e.isFile())
        .map(async (e) => {
          const full = path.join(UPLOAD_DIR, e.name);
          const stat = await fs.stat(full);
          return {
            name: e.name,
            url: `/uploads/${e.name}`,
            size: stat.size,
            modifiedAt: stat.mtime.toISOString(),
          };
        })
    );

    files.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));
    return NextResponse.json({ files });
  } catch (error) {
    console.error("GET /api/media failed", error);
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureUploadDir();
    const form = await request.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    const ext = path.extname(file.name) || "";
    const base = sanitizeFilename(path.basename(file.name, ext));
    const filename = `${base}-${randomUUID()}${sanitizeFilename(ext)}`;

    const bytes = new Uint8Array(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);

    return NextResponse.json({ name: filename, url: `/uploads/${filename}` });
  } catch (error) {
    console.error("POST /api/media failed", error);
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureUploadDir();
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const safe = sanitizeFilename(name);
    const full = path.join(UPLOAD_DIR, safe);

    // Basic safety: ensure path stays inside upload dir.
    if (!full.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    await fs.unlink(full);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("DELETE /api/media failed", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
