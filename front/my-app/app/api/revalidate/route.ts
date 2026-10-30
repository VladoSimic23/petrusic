import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Secret nije postavljen" }, { status: 500 });
  }

  const { isValidSignature } = await parseBody(req, secret, true);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Neispravan potpis" }, { status: 401 });
  }

  revalidateTag("sanity", { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
