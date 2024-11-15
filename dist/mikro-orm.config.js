"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
const postgresql_1 = require("@mikro-orm/postgresql");
const postgresql_2 = require("@mikro-orm/postgresql");
const User_1 = require("./entities/User");
exports.default = (0, postgresql_1.defineConfig)({
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pathTs: undefined,
        glob: "!(*.d).{js,ts}",
    },
    entities: [Post_1.Post, User_1.User],
    dbName: "hashReddit",
    driver: postgresql_2.PostgreSqlDriver,
    debug: !constants_1.__prod__,
    user: "postgres",
    password: "3479",
    allowGlobalContext: true,
});
//# sourceMappingURL=mikro-orm.config.js.map