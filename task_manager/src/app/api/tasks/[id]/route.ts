import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/tasks/:id -> fetch one task
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const [task] = await query(
      `
      SELECT t.id, t.title, t.description, t.due_date, t.created_at, t.updated_at, t.user_id,
             p.name AS priority,
             s.name AS status
      FROM tasks t
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN statuses s ON t.status_id = s.id
      WHERE t.id = $1
      `,
      [id]
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}
