/* eslint-disable */
/**
 * Generated DataModel types - Run `npx convex dev` to regenerate
 */

import type { DataModelFromSchemaDefinition } from "convex/server";
import type schema from "../schema";

export type DataModel = DataModelFromSchemaDefinition<typeof schema>;
export type Id<TableName extends keyof DataModel> = DataModel[TableName]["_id"];

