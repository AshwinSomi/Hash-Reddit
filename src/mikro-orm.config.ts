import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";
import { defineConfig } from "@mikro-orm/postgresql";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "./entities/User";

export default defineConfig({
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pathTs: undefined,
    glob: "!(*.d).{js,ts}",
    // pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "hashReddit",
  driver: PostgreSqlDriver,
  //   type: "postgresql",
  //   clientUrl: "postgresql://postgres:3479@localhost:5432/hashReddit",
  debug: !__prod__,
  user: "postgres",
  password: "3479",
  allowGlobalContext: true, // Add this line
});
