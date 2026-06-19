import mongoose from "mongoose";

const defaultTagColor = "#4F46E5";
const shouldRun = process.argv.includes("--run");

const makeSlug = (sentence: string) =>
  sentence
    .trim()
    .toLowerCase()
    .replace(/\s*&\s*/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

const canonicalizeTagName = (value: string) => {
  const trimmed = value.trim();
  return trimmed.toLowerCase() === "develpment" ? "Development" : trimmed;
};

const normalizeTagKey = (value: string) =>
  canonicalizeTagName(value).toLowerCase();

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
};

const migrateServiceTags = async () => {
  await connectToDatabase();

  const servicesCollection = mongoose.connection.collection("services");
  const tagsCollection = mongoose.connection.collection("tags");

  const services = await servicesCollection
    .find({}, { projection: { title: 1, slug: 1, tags: 1 } })
    .toArray();

  const uniqueTagNames = Array.from(
    new Set(
      services.flatMap((service) =>
        Array.isArray(service.tags)
          ? service.tags
              .filter(
                (tag): tag is string =>
                  typeof tag === "string" && Boolean(tag.trim())
              )
              .filter((tag) => !mongoose.Types.ObjectId.isValid(tag))
              .map(canonicalizeTagName)
          : []
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  const tagMap = new Map<string, mongoose.Types.ObjectId>();
  const existingTagsReused: string[] = [];
  const tagsToCreate: string[] = [];
  const tagsCreated: string[] = [];

  for (const tagName of uniqueTagNames) {
    const existingTag = await tagsCollection.findOne({
      name: { $regex: `^${escapeRegex(tagName)}$`, $options: "i" },
    });

    if (existingTag) {
      tagMap.set(normalizeTagKey(tagName), existingTag._id as mongoose.Types.ObjectId);
      existingTagsReused.push(tagName);
      continue;
    }

    tagsToCreate.push(tagName);

    if (!shouldRun) {
      tagMap.set(normalizeTagKey(tagName), new mongoose.Types.ObjectId());
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

  let servicesNeedingUpdate = 0;
  let servicesUpdated = 0;
  const unmatchedTags: { serviceId: string; tag: string }[] = [];
  const serviceUpdates: {
    title?: string;
    slug?: string;
    from: string[];
    to: string[];
  }[] = [];
  const mapping = uniqueTagNames.map((tagName) => ({
    source: tagName,
    normalized: canonicalizeTagName(tagName),
    action: existingTagsReused.includes(tagName) ? "reuse existing Tag" : "create Tag",
  }));

  for (const service of services) {
    const originalTags = Array.isArray(service.tags) ? service.tags : [];
    const nextTags = originalTags
      .filter(
        (tag): tag is string =>
          typeof tag === "string" && Boolean(tag.trim())
      )
      .map((tag) => {
        if (mongoose.Types.ObjectId.isValid(tag)) {
          return new mongoose.Types.ObjectId(tag);
        }

        const tagId = tagMap.get(normalizeTagKey(tag));
        if (!tagId) unmatchedTags.push({ serviceId: String(service._id), tag });
        return tagId;
      })
      .filter(Boolean);

    const originalTagKeys = originalTags.map(String).join("|");
    const nextTagKeys = nextTags.map(String).join("|");
    const needsUpdate = originalTagKeys !== nextTagKeys;

    if (needsUpdate) {
      servicesNeedingUpdate += 1;
      serviceUpdates.push({
        title: service.title,
        slug: service.slug,
        from: originalTags.map(String),
        to: originalTags
          .filter(
            (tag): tag is string =>
              typeof tag === "string" && Boolean(tag.trim())
          )
          .map(canonicalizeTagName),
      });
    }

    if (shouldRun && needsUpdate) {
      await servicesCollection.updateOne(
        { _id: service._id },
        { $set: { tags: nextTags } }
      );
      servicesUpdated += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: shouldRun ? "run" : "dry-run",
        servicesScanned: services.length,
        uniqueStringTags: uniqueTagNames,
        mapping,
        existingTagsReused,
        tagsToCreate,
        tagsCreated,
        servicesNeedingUpdate,
        servicesUpdated,
        unmatchedTags,
        serviceUpdates,
      },
      null,
      2
    )
  );
};

migrateServiceTags()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Failed to migrate service tags:", error);
    await mongoose.disconnect();
    process.exit(1);
  });
