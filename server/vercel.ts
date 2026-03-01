import { createConfiguredServer } from "./app";

let appPromise: ReturnType<typeof createConfiguredServer> | null = null;

async function getApp() {
  if (!appPromise) {
    appPromise = createConfiguredServer();
  }
  const { app } = await appPromise;
  return app;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  const app = await getApp();
  return app(req, res);
}
