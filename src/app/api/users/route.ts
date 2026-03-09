export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient"; // utilise le client serveur

// GET : lister tous les utilisateurs
export async function GET() {
  const { data, error } = await supabaseServer.auth.admin.listUsers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data.users });
}

// POST : créer un utilisateur
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, role } = body;

  const { data, error } = await supabaseServer.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data.user });
}

// DELETE : supprimer un utilisateur
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  const { error } = await supabaseServer.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// PUT : mettre à jour le rôle d’un utilisateur
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, role } = body;

  const { data, error } = await supabaseServer.auth.admin.updateUserById(id, {
    user_metadata: { role },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data.user });
}