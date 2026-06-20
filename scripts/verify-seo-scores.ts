import mongoose from "mongoose";

const PostModel =
  mongoose.models.Post ||
  mongoose.model(
    "Post",
    new mongoose.Schema(
      { title: String, slug: String, postType: String, seoScore: Number },
      { timestamps: true }
    )
  );

const ServiceModel =
  mongoose.models.Service ||
  mongoose.model(
    "Service",
    new mongoose.Schema({ title: String, seoScore: Number }, { timestamps: true })
  );

const PortfolioModel =
  mongoose.models.Portfolio ||
  mongoose.model(
    "Portfolio",
    new mongoose.Schema({ title: String, seoScore: Number }, { timestamps: true })
  );

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const [blog, svc, port] = await Promise.all([
    PostModel.findOne({ postType: "blog", seoScore: { $exists: true, $ne: null } }).lean(),
    ServiceModel.findOne({ seoScore: { $exists: true, $ne: null } }).lean(),
    PortfolioModel.findOne({ seoScore: { $exists: true, $ne: null } }).lean(),
  ]);

  const [blogNull, svcNull, portNull, blogTotal, svcTotal, portTotal] = await Promise.all([
    PostModel.countDocuments({ postType: "blog", seoScore: null }),
    ServiceModel.countDocuments({ seoScore: null }),
    PortfolioModel.countDocuments({ seoScore: null }),
    PostModel.countDocuments({ postType: "blog" }),
    ServiceModel.countDocuments({}),
    PortfolioModel.countDocuments({}),
  ]);

  console.log("\n── Verification ───────────────────────────────────────────");
  console.log(`Blog sample:      "${(blog as any)?.title}"  →  seoScore: ${(blog as any)?.seoScore}`);
  console.log(`Service sample:   "${(svc as any)?.title}"  →  seoScore: ${(svc as any)?.seoScore}`);
  console.log(`Portfolio sample: "${(port as any)?.title}"  →  seoScore: ${(port as any)?.seoScore}`);
  console.log("───────────────────────────────────────────────────────────");
  console.log(`Blogs:      ${blogTotal - blogNull}/${blogTotal} have seoScore (${blogNull} still null)`);
  console.log(`Services:   ${svcTotal - svcNull}/${svcTotal} have seoScore (${svcNull} still null)`);
  console.log(`Portfolios: ${portTotal - portNull}/${portTotal} have seoScore (${portNull} still null)`);
  console.log("───────────────────────────────────────────────────────────\n");

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
