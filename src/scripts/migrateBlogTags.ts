import connectToDatabase from "@/lib/dbConnect";
import Post from "@/models/Posts";
import Tag from "@/models/Tag";
import { makeSlug } from "@/utils/blog";
import mongoose from "mongoose";

const defaultTagColor = "#4F46E5";

const normalizeTagName = (value: string) => value.trim();
const normalizeTagKey = (value: string) => normalizeTagName(value).toLowerCase();

const migrateBlogTags = async () => {
  await connectToDatabase();

  const posts = await Post.find({ postType: "blog" }).select("title slug tags");
  const uniqueTagNames = Array.from(
    new Set(
      posts.flatMap((post) =>
        Array.isArray(post.tags)
          ? post.tags
              .filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim()))
              .filter((tag) => !mongoose.Types.ObjectId.isValid(tag))
              .map(normalizeTagName)
          : []
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  const tagMap = new Map<string, mongoose.Types.ObjectId>();
  const tagsCreated: string[] = [];

  for (const tagName of uniqueTagNames) {
    const existingTag = await Tag.findOne({
      name: { $regex: `^${tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (existingTag) {
      tagMap.set(normalizeTagKey(tagName), existingTag._id as mongoose.Types.ObjectId);
      continue;
    }

    const createdTag = await Tag.create({
      name: tagName,
      slug: makeSlug(tagName),
      color: defaultTagColor,
    });

    tagMap.set(normalizeTagKey(tagName), createdTag._id as mongoose.Types.ObjectId);
    tagsCreated.push(tagName);
  }

  let postsUpdated = 0;
  const unmatchedTags: { postId: string; tag: string }[] = [];

  for (const post of posts) {
    const nextTags = (post.tags || [])
      .filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim()))
      .map((tag) => {
        if (mongoose.Types.ObjectId.isValid(tag)) {
          return new mongoose.Types.ObjectId(tag);
        }

        const tagId = tagMap.get(normalizeTagKey(tag));
        if (!tagId) unmatchedTags.push({ postId: String(post._id), tag });
        return tagId;
      })
      .filter(Boolean);

    await Post.collection.updateOne(
      { _id: post._id },
      { $set: { tags: nextTags } }
    );
    postsUpdated += 1;
  }

  console.log(
    JSON.stringify(
      {
        blogPostsScanned: posts.length,
        uniqueStringTags: uniqueTagNames,
        tagsCreated,
        postsUpdated,
        unmatchedTags,
      },
      null,
      2
    )
  );
};

migrateBlogTags()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to migrate blog tags:", error);
    process.exit(1);
  });
