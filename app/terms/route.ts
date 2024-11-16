const TERMS_DOC = "https://docs.google.com/document/d/1YbgSsqCas0Uhs4m-6q5CFT1I0LID1ZjV1qcnL7y85yE/edit?usp=sharing"

import { type NextRequest, NextResponse } from "next/server";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  return NextResponse.redirect(TERMS_DOC);
}