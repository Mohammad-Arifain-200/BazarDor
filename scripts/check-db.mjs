import { MongoClient } from "mongodb";
if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is missing in .env.local"); process.exit(1); }
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
try { await client.connect(); await client.db(process.env.MONGODB_DB || "bazardor").command({ ping: 1 }); console.log("MongoDB connection successful"); }
catch { console.error("MongoDB connection failed. Check the URI, database user and Atlas network access."); process.exitCode = 1; }
finally { await client.close(); }
