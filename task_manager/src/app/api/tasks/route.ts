import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/tasks -> fetch all tasks
export async function GET() {
  try {
    const tasks = await query(
      `
      SELECT t.id, t.title, t.description, t.due_date, t.created_at, t.updated_at, t.user_id,
             p.name AS priority,
             s.name AS status
      FROM tasks t
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN statuses s ON t.status_id = s.id
      ORDER BY t.created_at DESC
      `
    );

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST /api/tasks -> create new task
export async function POST(req: NextRequest) {
  const { title, description, priority_id, status_id, due_date, user_id } =
    await req.json();

  try {
    const [insertedTask] = await query(
      `
      INSERT INTO tasks (title, description, priority_id, status_id, due_date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [title, description, priority_id, status_id, due_date, user_id]
    );

    const taskId = insertedTask.id;

    const [taskWithNames] = await query(
      `
      SELECT t.id, t.title, t.description, t.due_date, t.created_at, t.updated_at, t.user_id,
             p.name AS priority,
             s.name AS status
      FROM tasks t
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN statuses s ON t.status_id = s.id
      WHERE t.id = $1
      `,
      [taskId]
    );

    return NextResponse.json(taskWithNames);
  } catch (err) {
    console.error("Error creating task:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
