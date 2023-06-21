import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFile } from "node:fs/promises";
import { addMocksToSchema } from "@graphql-tools/mock";
import { z } from "zod";
import { buildSchema, parse } from "graphql";

const ENV = z.object({
  PORT: z.string().default("4000"),
  SCHEMA: z.string().default("schema.graphql"),
  IS_SUBGRAPH: z.boolean().optional(),
});

const env = ENV.parse(process.env);

const sdl = await readFile(env.SCHEMA, "utf-8");
const isSubgraph = env.IS_SUBGRAPH ?? sdl.includes("@key");

const schema = isSubgraph
  ? buildSubgraphSchema({ typeDefs: parse(sdl) })
  : buildSchema(sdl);
const schemaWithMocks = addMocksToSchema({ schema });

const server = new ApolloServer({
  schema: schemaWithMocks,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: parseInt(env.PORT) },
});
console.log(`🚀 Server ready at ${url}`);
