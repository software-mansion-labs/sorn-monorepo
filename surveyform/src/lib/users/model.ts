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

export type UserDocument = any & {
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
