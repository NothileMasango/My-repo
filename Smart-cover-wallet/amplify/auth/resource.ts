import { defineAuth } from "@aws-amplify/backend";

/**
 * Cognito authentication for Smart Cover Wallet app
 * Users authenticate with email and password
 * Custom attributes track OM Bank account and policy linkage
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to Smart Cover Wallet - Verify your email",
      verificationEmailBody: (createCode) =>
        `Welcome to Smart Cover Wallet by OM Bank! Your verification code is ${createCode()}`,
    },
  },
  userAttributes: {
    preferredUsername: {
      required: false,
      mutable: true,
    },
  },
});
