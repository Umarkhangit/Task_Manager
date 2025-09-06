import db from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST() {
  const text = "Sample todo from API";
  const result = await db.query(
    `INSERT INTO todo (text) VALUES ($1) RETURNING *`,
    [text]
  );

  return NextResponse.json(result.rows[0]);
}
