import { NextRequest, NextResponse } from "next/server";
import { pool, query } from "@/lib/db";

// GET /api/tasks/:taskId/comments
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const [taskWithComments] = await query(
      `
    SELECT 
      c.task_id AS id,
      json_agg(
        json_build_object(
          'id', c.id,
          'content', c.content,
          'last_updated', c.created_at
        )
        ORDER BY c.created_at ASC
      ) AS comments
    FROM comments c
    WHERE c.task_id = $1
    GROUP BY c.task_id
    `,
      [id]
    );
    return NextResponse.json(taskWithComments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/tasks/:taskId/comments
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { content, user_id } = await req.json();

  try {
    console.log(id);
    const result = await query(
      `
      INSERT INTO comments (content, task_id, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [content, id, user_id]
    );

    // Fetch user name for the response
    const commentId = result[0].id;
    const commentWithUser = await pool.query(
      `
      SELECT 
        c.id,
        c.content,
        c.created_at,
        c.user_id,
        u.name AS user_name
      FROM comments c
      LEFT JOIN "user" u ON c.user_id = u.id
      WHERE c.id = $1
      `,
      [commentId]
    );

    return NextResponse.json(commentWithUser.rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/90798ce8-4619-427b-84a6-b749de1fdffb/comments

// {
//   "comment_id": "c1",
//   "content": "Updated comment text"
// }


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { comment_id, content } = await req.json();

  try {
    const [updated] = await query(
      `
      UPDATE comments
      SET content = $1, created_at = now()
      WHERE id = $2 AND task_id = $3
      RETURNING id, content, created_at, user_id
      `,
      [content, comment_id, id]
    );

    if (!updated) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating comment:", err);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}
