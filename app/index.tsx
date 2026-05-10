import { Redirect } from "expo-router";

export default function Index() {
  // V1: redirect to onboarding. Once auth/profile state is in store, branch here.
  return <Redirect href="/(onboarding)/welcome" />;
}
