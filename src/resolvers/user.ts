import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";
// import { error } from "console";

@InputType()
class UserPasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

//--------------READ ME---------
//  replacing req.session.userId with req.userId

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { session }: MyContext): Promise<User | null> {
    console.log("Session object in `me` query:", session);
    console.log("session userID (qid): ", session.userId);
    if (session.userId) {
      //
      const user = await User.findOne({ where: { id: session.userId } });
      return user;
    }
    return Promise.resolve(null);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UserPasswordInput) options: UserPasswordInput,
    @Ctx() { session }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username length should be at least 3",
          },
        ],
      };
    }

    if (options.password.length <= 5) {
      return {
        errors: [
          {
            field: "password",
            message: "password length should be al least 6",
          },
        ],
      };
    }
    //  if (err.details.includes("already exists")) {
    // if (err.code=="23505") {
    if (await User.findOne({ where: { username: options.username } })) {
      return {
        errors: [
          {
            field: "username",
            message: "username already taken",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = User.create({
      username: options.username,
      password: hashedPassword,
    });
    await user.save();

    session.userId = user.id;
    console.log("session userID (qid): ", session.userId);
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UserPasswordInput) options: UserPasswordInput,
    @Ctx() { session }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username: options.username } });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "password doesn't match",
          },
        ],
      };
    }
    console.log("before session");

    session.userId = user.id;
    console.log("session userID (qid): ", session.userId);
    console.log("Session object after setting userId:", session);

    console.log("after session");

    return {
      user,
    };
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }
}
