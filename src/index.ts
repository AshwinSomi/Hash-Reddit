import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HellResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  // Use forked EntityManager for context-specific actions
  const em = orm.em.fork();

  orm.getMigrator().up();
  //   const post = em.create(Post, { title: "my first post" });
  //   await em.persistAndFlush(post);

  //   const posts = await em.find(Post, {});
  //   console.log(posts);

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HellResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: em }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any });

  app.listen(4000, () => {
    console.log("sever started on localhost:4000");
  });
};

main().catch((e) => {
  console.log(e);
});

console.log("hello #ash");
