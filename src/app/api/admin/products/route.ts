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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { is_ram_upgradable, is_ssd_upgradable, specifications, ...productData } = body;

    const supabase = getAdminSupabaseClient();
    if (supabase) {
      // Store upgradability flags inside specifications metadata so Supabase doesn't error on missing columns
      const specs = Array.isArray(specifications) ? [...specifications] : [];
      const cleanSpecs = specs.filter(
        (s: any) => s.label !== "__is_ram_upgradable" && s.label !== "__is_ssd_upgradable"
      );
      cleanSpecs.push(
        { label: "__is_ram_upgradable", value: String(Boolean(is_ram_upgradable)) },
        { label: "__is_ssd_upgradable", value: String(Boolean(is_ssd_upgradable)) }
      );

      const payload = {
        ...productData,
        specifications: cleanSpecs,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select("*, category:categories(*)")
        .single();

      if (error) {
        console.error("Error creating product via Service Role:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        ...data,
        is_ram_upgradable: Boolean(is_ram_upgradable),
        is_ssd_upgradable: Boolean(is_ssd_upgradable),
      });
    }

    return NextResponse.json({
      id: `p-local-${Date.now()}`,
      ...productData,
      specifications,
      is_ram_upgradable: Boolean(is_ram_upgradable),
      is_ssd_upgradable: Boolean(is_ssd_upgradable),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, is_ram_upgradable, is_ssd_upgradable, specifications, category, ...productData } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const supabase = getAdminSupabaseClient();
    if (supabase) {
      const updatePayload: Record<string, any> = {
        ...productData,
        updated_at: new Date().toISOString(),
      };

      if (specifications !== undefined) {
        const specs = Array.isArray(specifications) ? [...specifications] : [];
        const cleanSpecs = specs.filter(
          (s: any) => s.label !== "__is_ram_upgradable" && s.label !== "__is_ssd_upgradable"
        );
        if (is_ram_upgradable !== undefined) {
          cleanSpecs.push({
            label: "__is_ram_upgradable",
            value: String(Boolean(is_ram_upgradable)),
          });
        }
        if (is_ssd_upgradable !== undefined) {
          cleanSpecs.push({
            label: "__is_ssd_upgradable",
            value: String(Boolean(is_ssd_upgradable)),
          });
        }
        updatePayload.specifications = cleanSpecs;
      }

      const { data, error } = await supabase
        .from("products")
        .update(updatePayload)
        .eq("id", id)
        .select("*, category:categories(*)")
        .single();

      if (error) {
        console.error("Error updating product via Service Role:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        ...data,
        is_ram_upgradable: is_ram_upgradable !== undefined ? Boolean(is_ram_upgradable) : undefined,
        is_ssd_upgradable: is_ssd_upgradable !== undefined ? Boolean(is_ssd_upgradable) : undefined,
      });
    }

    return NextResponse.json({
      id,
      ...productData,
      specifications,
      is_ram_upgradable,
      is_ssd_upgradable,
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
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const supabase = getAdminSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Error deleting product via Service Role:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
