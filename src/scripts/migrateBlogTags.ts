import mongoose from "mongoose";
import { makeSlug } from "../utils/blog";

const defaultTagColor = "#4F46E5";

const canonicalizeTagName = (value: string) => {
  const trimmed = value.trim();
  return trimmed.toLowerCase() === "programing" ? "Programming" : trimmed;
};

const normalizeTagName = (value: string) => canonicalizeTagName(value);
const normalizeTagKey = (value: string) => normalizeTagName(value).toLowerCase();
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
};

const migrateBlogTags = async () => {
  await connectToDatabase();

  const postsCollection = mongoose.connection.collection("posts");
  const tagsCollection = mongoose.connection.collection("tags");

  const posts = await postsCollection
    .find({ postType: "blog" }, { projection: { title: 1, slug: 1, tags: 1 } })
    .toArray();

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
    const existingTag = await tagsCollection.findOne({
      name: { $regex: `^${escapeRegex(tagName)}$`, $options: "i" },
    });

    if (existingTag) {
      tagMap.set(normalizeTagKey(tagName), existingTag._id as mongoose.Types.ObjectId);
      continue;
    }

    const tagId = new mongoose.Types.ObjectId();

    await tagsCollection.insertOne({
      _id: tagId,
      name: tagName,
      slug: makeSlug(tagName),
      color: defaultTagColor,
      postCount: 0,
      createdAt: new Date(),
    });

    tagMap.set(normalizeTagKey(tagName), tagId);
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

    await postsCollection.updateOne(
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
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Failed to migrate blog tags:", error);
    await mongoose.disconnect();
    process.exit(1);
  });
