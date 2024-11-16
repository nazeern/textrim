const PRIVACY_DOC = "https://docs.google.com/document/d/1srV4EdGrpr7_UPENcDxPC-ArbLZvvnXb_0TLlcwbJMw/edit?usp=sharing"

import { type NextRequest, NextResponse } from "next/server";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  return NextResponse.redirect(PRIVACY_DOC);
}