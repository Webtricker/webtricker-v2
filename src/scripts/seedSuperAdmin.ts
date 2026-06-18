import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/dbConnect";
import User from "@/models/User";

const seedSuperAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASS;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASS are required.");
  }

  await connectToDatabase();

  const existingSuperAdmin = await User.findOne({ role: "superAdmin" });
  if (existingSuperAdmin) {
    console.log("Super admin already exists. Skipping seed.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    name: "Mosharaf",
    email,
    passwordHash,
    role: "superAdmin",
    isActive: true,
  });

  console.log("Super admin seeded successfully.");
};

seedSuperAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed super admin:", error);
    process.exit(1);
  });
