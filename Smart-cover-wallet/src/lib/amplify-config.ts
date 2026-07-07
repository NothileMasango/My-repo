/**
 * Amplify Configuration
 * 
 * In production, this imports from the auto-generated amplify_outputs.json.
 * For hackathon demo, we use mock configuration.
 * 
 * After running `npx ampx sandbox` or deploying via Amplify Console,
 * replace this with:
 * 
 * import outputs from '../../amplify_outputs.json';
 * import { Amplify } from 'aws-amplify';
 * Amplify.configure(outputs);
 */

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: "REPLACE_AFTER_DEPLOY",
      userPoolClientId: "REPLACE_AFTER_DEPLOY",
      loginWith: {
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: "REPLACE_AFTER_DEPLOY",
      region: "us-east-1",
      defaultAuthMode: "userPool" as const,
    },
  },
};

/**
 * Initialize Amplify (call this in your layout or _app)
 * 
 * Usage:
 * ```
 * import { Amplify } from 'aws-amplify';
 * import outputs from '../amplify_outputs.json';
 * Amplify.configure(outputs);
 * ```
 */
export function configureAmplify() {
  // In production, uncomment:
  // import { Amplify } from 'aws-amplify';
  // import outputs from '../../amplify_outputs.json';
  // Amplify.configure(outputs);
  console.log("Amplify configured for demo mode");
}
