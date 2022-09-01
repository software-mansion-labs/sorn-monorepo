// import { VulcanDocument } from "@vulcanjs/schema";
import {
  createGraphqlModel,
  CreateGraphqlModelOptionsShared,
  VulcanGraphqlSchema,
} from "@vulcanjs/graphql";

import type { VulcanDocument } from "@vulcanjs/schema";

/**
 * Temporary user data with unhashed email
 *
 * Must never be stored in the database, we must replace the email by a emailHash
 */
export type NewUserDocument = Omit<UserDocument, "emailHash" | "groups"> & {
  email?: string;
  // groups can be autogenerated on user creation and are optional
  groups?: UserDocument["groups"];
};

export type UserDocument = VulcanDocument & {
  isAdmin?: boolean;
  isVerified?: boolean;
  groups: Array<string>;
} & (
    | {
        /**
         * Legacy password based auth
         */
        authMode: undefined | "password";
        emailHash: string;
      }
    | { authMode: "anonymous"; emailHash?: undefined }
    | {
        authMode: "passwordless";
        emailHash: string;
      }
  );

export type UserType = UserDocument; //UserWithEmailDocument | AnonymousUserDocument;

/**
 * @deprecated
 */
const passwordAuthSchema: VulcanGraphqlSchema = {
  // Temporary field, used only in the frontend, must be deleted on mutations
  password: {
    type: String,
    optional: false,
    canRead: [],
    canCreate: ["guests"],
    canUpdate: ["owners"],
  },
};

/**
 * Previously for password auth, but still relevant for magic link auth
 */
const emailVerificationSchema: VulcanGraphqlSchema = {
  isVerified: {
    type: String,
    default: false,
    optional: true,
    // can be forced by admins/mods
    canRead: ["owners"],
    canCreate: ["admins"],
    canUpdate: ["admins"],
  },
  emailHash: {
    type: String,
    optional: true,
    hidden: true,
    canCreate: [],
    canUpdate: [],
    canRead: ["admins"],
  },
  /*
  Email is not stored anymore, we only store a hash
  email: {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Email,
    // mustComplete: true,
    input: "text",
    canCreate: ["members"],
    canUpdate: ["owners", "admins"],
    canRead: ["owners", "admins"],
    searchable: true,
    unique: true,
    // unique: true // note: find a way to fix duplicate accounts before enabling this
  },*/
};

// TODO: Fields that do not exist anymore in Vulcan Next
const meteorLegacySchema: VulcanGraphqlSchema = {
  // TODO: should we compute display name server-side onCreate ?
  displayName: {
    type: String,
    optional: true,
    canRead: ["owners"],
  },
};
const stateOfSchema: VulcanGraphqlSchema = {
  // TODO: not sure why it's on type "User"
  pagePath: {
    type: String,
    optional: true,
    canRead: ["owners"],
  },
};

export const schema: VulcanGraphqlSchema = {
  // _id, userId, and createdAT are basic field you may want to use in almost all schemas
  _id: {
    type: String,
    optional: true,
    canRead: ["guests"],
  },
  // userId is the _id of the owner of the document
  // Here, it guarantees that the user belongs to group "owners" for his own data
  userId: {
    type: String,
    optional: true,
    canRead: ["guests"],
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ["admins"],
    onCreate: () => {
      return new Date();
    },
  },
  username: {
    type: String,
    optional: true,
    canRead: ["guests"],
    canUpdate: ["admins"],
    canCreate: ["owners"],
    searchable: true,
  },
  isAdmin: {
    type: Boolean,
    label: "Admin",
    input: "checkbox",
    optional: true,
    canCreate: ["admins"],
    canUpdate: ["admins"],
    canRead: ["guests"],
  },

  groups: {
    type: Array,
    optional: true,
    input: "checkboxgroup",
    canCreate: ["admins"],
    canUpdate: ["admins"],
    canRead: ["guests"],
    // TODO: allow to manage custom groups
    // form: {
    //   options: function () {
    //     const groups = _.without(
    //       _.keys(getCollection("Users").groups),
    //       "guests",
    //       "members",
    //       "owners",
    //       "admins"
    //     );
    //     return groups.map((group) => {
    //       return { value: group, label: group };
    //     });
    //   },
    // },
  },
  "groups.$": {
    type: String,
    optional: true,
  },
  authMode: {
    // anonymous | passwordless | password
    type: String,
    optional: true,
    canRead: ["owners", "admins"],
    canUpdate: [],
    canCreate: [],
  },
  ...passwordAuthSchema,
  ...emailVerificationSchema,
  ...meteorLegacySchema,
  ...stateOfSchema,
};

export const modelDef: CreateGraphqlModelOptionsShared = {
  name: "User",
  graphql: {
    // for consistency with Vulcan Meteor, we use "User" as the typename
    typeName: "User",
    multiTypeName: "Users",
    // typeName: "VulcanUser",
    // multiTypeName: "VulcanUsers",
  },
  schema,
  permissions: {
    canCreate: ["guests"], // signup is enabled
    canUpdate: ["owners", "admins"],
    canDelete: ["owners", "admins"],
    canRead: ["members", "admins"],
  },
};
export const User = createGraphqlModel(modelDef);
