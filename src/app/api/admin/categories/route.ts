import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceRoleKey && !url.includes("your-project-ref-id")) {
    return createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return null;
}

export async function GET() {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, icon, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nama dan slug kategori wajib diisi" },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name,
          slug,
          icon: icon || "Package",
          description: description || null,
        })
        .select("*")
        .single();

      if (error) {
        console.error("Error creating category via Service Role:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(data);
    }

    // Local fallback return
    return NextResponse.json({
      id: `c-local-${Date.now()}`,
      name,
      slug,
      icon: icon || "Package",
      description: description || null,
      created_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, slug, icon, description } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const supabase = getAdminSupabaseClient();
    if (supabase) {
      const updatePayload: Record<string, any> = {};
      if (name !== undefined) updatePayload.name = name;
      if (slug !== undefined) updatePayload.slug = slug;
      if (icon !== undefined) updatePayload.icon = icon;
      if (description !== undefined) updatePayload.description = description;

      const { data, error } = await supabase
        .from("categories")
        .update(updatePayload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating category via Service Role:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(data);
    }

    return NextResponse.json({
      id,
      name,
      slug,
      icon,
      description,
      updated_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const supabase = getAdminSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) {
        console.error("Error deleting category via Service Role:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
