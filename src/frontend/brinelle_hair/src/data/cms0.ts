//import "dotenv/config";
import { cms0 } from "@cms0/cms0";

type RootSchema = {
  HomePage: {
    heroTitle: string;
  };
};

function getRequiredEnv(key: 'VITE_CMS0_API_BASEURL' | 'VITE_CMS0_API_KEY') {
  const value = import.meta.env[key]

  if (!value) {
    throw new Error(`Missing required Vite env variable: ${key}`)
  }

  return value
}

export const data = cms0<RootSchema>({
  apiConfig: {
    baseUrl: getRequiredEnv('VITE_CMS0_API_BASEURL'),
    key: getRequiredEnv('VITE_CMS0_API_KEY'),
  },
});
