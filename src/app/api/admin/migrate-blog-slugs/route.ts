import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import Post from "@/models/Posts";
import { verifyAdmin } from "@/utils/validator";

// Mirrors the cleanBlogSlug logic in middleware.ts — keep in sync if either changes
function cleanSlug(slug: string): string {
  return slug
    .replace(/-?&-?/g, "-and-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Only replaces & with "and" in display titles; leaves : ' , intact
function cleanTitle(title: string): string {
  return title.replace(/\s*&\s*/g, " and ").replace(/\s{2,}/g, " ").trim();
}

// POST /api/admin/migrate-blog-slugs
// Requires admin session cookie. Run once after deployment, then remove this route.
export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    await verifyAdmin(req);

    const posts = await Post.find({ postType: "blog" }).select("title slug");

    const results: {
      old: { slug: string; title: string };
      new: { slug: string; title: string };
      status: "updated" | "skipped" | "error";
      error?: string;
    }[] = [];

    for (const post of posts) {
      const newSlug = cleanSlug(post.slug);
      const newTitle = cleanTitle(post.title);

      const slugChanged = newSlug !== post.slug;
      const titleChanged = newTitle !== post.title;

      if (!slugChanged && !titleChanged) {
        results.push({
          old: { slug: post.slug, title: post.title },
          new: { slug: newSlug, title: newTitle },
          status: "skipped",
        });
        continue;
      }

      try {
        const updateData: Record<string, string> = {};
        if (slugChanged) updateData.slug = newSlug;
        if (titleChanged) updateData.title = newTitle;

        await Post.findOneAndUpdate(
          { slug: post.slug },
          { $set: updateData },
          { runValidators: true }
        );

        results.push({
          old: { slug: post.slug, title: post.title },
          new: { slug: newSlug, title: newTitle },
          status: "updated",
        });
      } catch (err: unknown) {
        results.push({
          old: { slug: post.slug, title: post.title },
          new: { slug: newSlug, title: newTitle },
          status: "error",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const updated = results.filter((r) => r.status === "updated");
    const errors = results.filter((r) => r.status === "error");

    return NextResponse.json({
      success: true,
      summary: {
        total: posts.length,
        updated: updated.length,
        skipped: results.filter((r) => r.status === "skipped").length,
        errors: errors.length,
      },
      updated,
      errors,
    });
  } catch (error: unknown) {
    console.error("Slug migration error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
