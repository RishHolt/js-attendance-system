import { NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set. The /api/login route will not work correctly."
  );
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    const url = new URL("/rest/v1/users", supabaseUrl);
    url.searchParams.set("select", "id,username,role");
    url.searchParams.set("username", `eq.${username}`);
    url.searchParams.set("password", `eq.${password}`);
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
      // eslint-disable-next-line no-console
      console.error(
        "Supabase REST error in /api/login:",
        body?.message || response.statusText
      );
      return NextResponse.json(
        { error: "Database error while logging in." },
        { status: 500 }
      );
    }

    const rows = (await response.json()) as Array<{
      id: string;
      username: string;
      role?: string | null;
    }>;

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    const role = user?.role ?? null;
    const isAdmin = role === "admin";

    return NextResponse.json({ isAdmin, role, username: user?.username ?? null });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Unexpected error in /api/login:", err);
    return NextResponse.json(
      { error: "Unexpected error while logging in." },
      { status: 500 }
    );
  }
}

