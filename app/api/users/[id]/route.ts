import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    "Supabase environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set. The /api/users/[id] route will not work correctly."
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('API: Full params object:', params);
    console.log('API: Extracted ID:', id);
    console.log('API: ID type:', typeof id);

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.log('API: Supabase not configured');
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    // Fetch user by ID
    const url = new URL("/rest/v1/users", supabaseUrl);
    url.searchParams.set("id", `eq.${id}`);
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      console.error("Supabase REST error in /api/users/[id] GET:", body?.message || response.statusText);
      return NextResponse.json(
        { error: "Database error while fetching user." },
        { status: 500 }
      );
    }

    const users = await response.json();
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error("Unexpected error in /api/users/[id] GET:", err);
    return NextResponse.json(
      { error: "Unexpected error while fetching user." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || (status !== "active" && status !== "inactive")) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'active' or 'inactive'." },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    // Update user status
    const url = new URL(`/rest/v1/users`, supabaseUrl);
    url.searchParams.set("id", `eq.${id}`);

    const updateResponse = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ status }),
    });

    if (!updateResponse.ok) {
      const body = await updateResponse.json().catch(() => ({}));
      console.error("Supabase REST error in /api/users/[id]:", body?.message || updateResponse.statusText);
      return NextResponse.json(
        { error: "Database error while updating user status." },
        { status: 500 }
      );
    }

    const updatedUsers = await updateResponse.json();
    const updatedUser = Array.isArray(updatedUsers) && updatedUsers.length > 0 ? updatedUsers[0] : null;

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (err) {
    console.error("Unexpected error in /api/users/[id]:", err);
    return NextResponse.json(
      { error: "Unexpected error while updating user." },
      { status: 500 }
    );
  }
}
