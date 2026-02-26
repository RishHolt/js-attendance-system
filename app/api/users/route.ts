import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set. The /api/users route will not work correctly."
  );
}

export async function POST(request: Request) {
  try {
    const { username, password, name, email, contactNo, role, position } = await request.json();

    // Validate required fields
    if (!username || !password || !name || !email) {
      return NextResponse.json(
        { error: "Username, password, name, and email are required." },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be either 'user' or 'admin'." },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    // Check if username already exists
    const checkUsernameUrl = new URL("/rest/v1/users", supabaseUrl);
    checkUsernameUrl.searchParams.set("select", "username");
    checkUsernameUrl.searchParams.set("username", `eq.${username}`);
    checkUsernameUrl.searchParams.set("limit", "1");

    const checkUsernameResponse = await fetch(checkUsernameUrl.toString(), {
      method: "GET",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Accept: "application/json",
      },
    });

    if (checkUsernameResponse.ok) {
      const existingUsers = await checkUsernameResponse.json();
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json(
          { error: "Username already exists." },
          { status: 409 }
        );
      }
    }

    // Check if email already exists
    const checkEmailUrl = new URL("/rest/v1/users", supabaseUrl);
    checkEmailUrl.searchParams.set("select", "email");
    checkEmailUrl.searchParams.set("email", `eq.${email}`);
    checkEmailUrl.searchParams.set("limit", "1");

    const checkEmailResponse = await fetch(checkEmailUrl.toString(), {
      method: "GET",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Accept: "application/json",
      },
    });

    if (checkEmailResponse.ok) {
      const existingUsers = await checkEmailResponse.json();
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json(
          { error: "Email already exists." },
          { status: 409 }
        );
      }
    }

    // Generate a unique user_id
    const user_id = Date.now().toString();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const createUrl = new URL("/rest/v1/users", supabaseUrl);
    createUrl.searchParams.set("select", "id,username,name,email,role,position,contact_no,status,user_id,created_at");

    const userData = {
      user_id,
      username,
      password: hashedPassword, // Store hashed password
      name,
      email,
      contact_no: contactNo || null,
      role: role || "user",
      position: position || null,
      status: "active"
    };

    const createResponse = await fetch(createUrl.toString(), {
      method: "POST",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(userData),
    });

    if (!createResponse.ok) {
      const body = await createResponse.json().catch(() => ({}));
      // eslint-disable-next-line no-console
      console.error(
        "Supabase REST error in /api/users:",
        body?.message || createResponse.statusText
      );
      return NextResponse.json(
        { error: "Database error while creating user." },
        { status: 500 }
      );
    }

    const createdUser = await createResponse.json();
    const user = Array.isArray(createdUser) ? createdUser[0] : createdUser;

    return NextResponse.json({
      message: "User created successfully.",
      user: {
        id: user.id,
        user_id: user.user_id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        contact_no: user.contact_no,
        status: user.status,
        created_at: user.created_at
      }
    });

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Unexpected error in /api/users:", err);
    return NextResponse.json(
      { error: "Unexpected error while creating user." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    const url = new URL("/rest/v1/users", supabaseUrl);
    url.searchParams.set("select", "id,username,name,email,role,position,contact_no,status,user_id,created_at");
    
    // Add search filters
    if (search) {
      url.searchParams.set("or", `(username.ilike.*${search}*,name.ilike.*${search}*,email.ilike.*${search}*)`);
    }
    
    if (role) {
      url.searchParams.set("role", `eq.${role}`);
    }

    // Add ordering and pagination
    url.searchParams.set("order", "created_at.desc");
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("offset", ((page - 1) * limit).toString());

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
        "Supabase REST error in /api/users (GET):",
        body?.message || response.statusText
      );
      return NextResponse.json(
        { error: "Database error while fetching users." },
        { status: 500 }
      );
    }

    const users = await response.json();

    // Get total count for pagination
    const countUrl = new URL("/rest/v1/users", supabaseUrl);
    countUrl.searchParams.set("count", "exact");
    countUrl.searchParams.set("head", "true");
    
    if (search) {
      countUrl.searchParams.set("or", `(username.ilike.*${search}*,name.ilike.*${search}*,email.ilike.*${search}*)`);
    }
    
    if (role) {
      countUrl.searchParams.set("role", `eq.${role}`);
    }

    const countResponse = await fetch(countUrl.toString(), {
      method: "HEAD",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Accept: "application/json",
      },
    });

    const totalCount = countResponse.ok 
      ? parseInt(countResponse.headers.get("content-range")?.split("/")[1] || "0")
      : Array.isArray(users) ? users.length : 0;

    return NextResponse.json({
      users: Array.isArray(users) ? users : [],
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Unexpected error in /api/users (GET):", err);
    return NextResponse.json(
      { error: "Unexpected error while fetching users." },
      { status: 500 }
    );
  }
}
