import connectToDB from "./db.js";

async function test() {
  try {
    await connectToDB();
    console.log("Database connection successful ✅");
  } catch (err) {
    console.error("Database connection failed ❌", err);
  } finally {
    process.exit();
  }
}

test();
