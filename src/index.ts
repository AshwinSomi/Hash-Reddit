import "reflect-metadata";
// import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
// import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HellResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import { DataSource } from "typeorm";

import cors from "cors";

// import connectRedis from "connect-redis";
import session from "express-session";
// import { createClient } from "redis";
// import redis from "redis";
// import { MyContext } from "./types";
import Redis from "ioredis";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const main = async () => {
  const dataSource = new DataSource({
    type: "postgres",
    database: "hashReddit2",
    username: "postgres",
    password: "3479",
    logging: true,
    synchronize: true, //automaticaly create the tables if not created
    entities: [Post, User],
  });
  dataSource
    .initialize()
    .then(() => {
      console.log("Data source has been initialized");
    })
    .catch((err) => {
      console.log("Error during data source initializing, ", err);
    });

  // const orm = await MikroORM.init(mikroConfig);
  // const em = orm.em.fork();

  // orm.getMigrator().up();
  //   const post = em.create(Post, { title: "my first post" });
  //   await em.persistAndFlush(post);

  //   const posts = await em.find(Post, {});
  //   console.log(posts);

  const app = express();

  const RedisStore = require("connect-redis").default;
  // const redisClient = createClient();
  const redis = new Redis();
  // redisClient.on("error", (err) => console.log("Redis Client Error", err));

  // redisClient.on("error", (err) => console.error("Redis Client Error", err));

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    })
  );

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redis, //redisClient,
        //TTL touch makes your session alive for set of time
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: __prod__ ? "none" : "lax", // "lax", //csrf
        secure: __prod__,
      },
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "tgwhrhlfvbfbkjzdnsfoirfu",
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HellResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ session: req.session, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app: app as any,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("sever started on localhost:4000");
  });
};

main().catch((e) => {
  console.log(e);
});

console.log("hello #ash");
