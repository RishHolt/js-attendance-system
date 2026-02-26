import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

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

    // Check for hardcoded local admin credentials first
    const localAdminUsername = process.env.LOCAL_ADMIN_USERNAME;
    const localAdminPassword = process.env.LOCAL_ADMIN_PASSWORD;

    if (localAdminUsername && localAdminPassword && 
        username === localAdminUsername && password === localAdminPassword) {
      // Create token for local admin
      const token = Buffer.from(`local-admin:${username}:${Date.now()}`).toString('base64');
      
      const response = NextResponse.json({ 
        isAdmin: true, 
        role: "admin", 
        username: username,
        isLocalAdmin: true 
      });
      
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/'
      });
      
      // Also set a non-httpOnly cookie for client-side checks
      response.cookies.set('auth_token_client', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/'
      });

      return response;
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    const url = new URL("/rest/v1/users", supabaseUrl);
    url.searchParams.set("select", "id,username,role,email,password");
    // Check if input is email or username
    const isEmail = username.includes('@');
    if (isEmail) {
      url.searchParams.set("email", `eq.${username}`);
    } else {
      url.searchParams.set("username", `eq.${username}`);
    }
    url.searchParams.set("limit", "1");

    const dbResponse = await fetch(url.toString(), {
      method: "GET",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Accept: "application/json",
      },
    });

    if (!dbResponse.ok) {
      const body = await dbResponse.json().catch(() => ({}));
      // eslint-disable-next-line no-console
      console.error(
        "Supabase REST error in /api/login:",
        body?.message || dbResponse.statusText
      );
      return NextResponse.json(
        { error: "Database error while logging in." },
        { status: 500 }
      );
    }

    const rows = (await dbResponse.json()) as Array<{
      id: string;
      username: string;
      email: string;
      password: string;
      role?: string | null;
    }>;

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    const role = user?.role ?? null;
    const isAdmin = role === "admin";

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Create a simple token (in production, use JWT or proper session management)
    const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64');

    // Set the token in a cookie
    const apiResponse = NextResponse.json({ isAdmin, role, username: user?.username ?? null });
    apiResponse.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/'
    });
    
    // Also set a non-httpOnly cookie for client-side checks
    apiResponse.cookies.set('auth_token_client', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/'
    });

    return apiResponse;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Unexpected error in /api/login:", err);
    return NextResponse.json(
      { error: "Unexpected error while logging in." },
      { status: 500 }
    );
  }
}

