import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Smart Cover Wallet - Verify your email",
      verificationEmailBody: (createCode) =>
        `Welcome to Smart Cover Wallet! Your code is ${createCode()}`,
    },
  },
  userAttributes: {
    preferredUsername: { required: false, mutable: true },
  },
});
