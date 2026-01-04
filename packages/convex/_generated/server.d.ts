/* eslint-disable */
/**
 * Generated Server types - Run `npx convex dev` to regenerate
 */

import type {
  GenericMutationCtx,
  GenericQueryCtx,
  GenericActionCtx,
  GenericDatabaseReader,
  GenericDatabaseWriter,
  MutationBuilder,
  QueryBuilder,
  ActionBuilder,
  HttpActionBuilder,
  InternalQueryBuilder,
  InternalMutationBuilder,
  InternalActionBuilder,
} from "convex/server";
import type { DataModel } from "./dataModel";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;

export type DatabaseReader = GenericDatabaseReader<DataModel>;
export type DatabaseWriter = GenericDatabaseWriter<DataModel>;

declare const query: QueryBuilder<DataModel, "public">;
declare const mutation: MutationBuilder<DataModel, "public">;
declare const action: ActionBuilder<DataModel, "public">;
declare const httpAction: HttpActionBuilder;
declare const internalQuery: InternalQueryBuilder<DataModel>;
declare const internalMutation: InternalMutationBuilder<DataModel>;
declare const internalAction: InternalActionBuilder<DataModel>;

export {
  query,
  mutation,
  action,
  httpAction,
  internalQuery,
  internalMutation,
  internalAction,
};

