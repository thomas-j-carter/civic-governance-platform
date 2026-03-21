// apps/gov-api/src/types/hono.ts

import type { AppContext } from "../context/app-context";
import type { RequestContextState } from "../context/request-context";

export interface HonoEnv {
  Variables: {
    appContext: AppContext;
    requestContext: RequestContextState;
  };
}