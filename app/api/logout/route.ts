import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (err) {
    console.error("Unexpected error in /api/logout:", err);
    return NextResponse.json(
      { error: "Unexpected error while logging out." },
      { status: 500 }
    );
  }
}
