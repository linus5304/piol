/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_mtnMomo from "../actions/mtnMomo.js";
import type * as actions_orangeMoney from "../actions/orangeMoney.js";
import type * as actions_payments from "../actions/payments.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as properties from "../properties.js";
import type * as reviews from "../reviews.js";
import type * as savedProperties from "../savedProperties.js";
import type * as seed_index from "../seed/index.js";
import type * as seed_properties from "../seed/properties.js";
import type * as seed_users from "../seed/users.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";
import type * as verifications from "../verifications.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/mtnMomo": typeof actions_mtnMomo;
  "actions/orangeMoney": typeof actions_orangeMoney;
  "actions/payments": typeof actions_payments;
  files: typeof files;
  http: typeof http;
  messages: typeof messages;
  notifications: typeof notifications;
  properties: typeof properties;
  reviews: typeof reviews;
  savedProperties: typeof savedProperties;
  "seed/index": typeof seed_index;
  "seed/properties": typeof seed_properties;
  "seed/users": typeof seed_users;
  transactions: typeof transactions;
  users: typeof users;
  verifications: typeof verifications;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
