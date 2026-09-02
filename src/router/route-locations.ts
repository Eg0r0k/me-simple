import type { RouteLocationRaw } from "vue-router";
import { ROUTE_NAMES } from "@/router/route-names";

export const routeLocation = {
  home: (): RouteLocationRaw => ({ name: ROUTE_NAMES.HOME }),
  projects: (): RouteLocationRaw => ({ name: ROUTE_NAMES.PROJECTS }),
  about: (): RouteLocationRaw => ({ name: ROUTE_NAMES.ABOUT }),
} as const;
