import { cleanDatabase } from "./utils-tests-e2e";

export default async function globalSetup() {
  await cleanDatabase();
}
