import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import FanGroupView from "./pages/FanGroupView";
import FanHome from "./pages/FanHome";
import GroupDashboard from "./pages/GroupDashboard";
import GroupPasscode from "./pages/GroupPasscode";
import GroupSelect from "./pages/GroupSelect";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const groupSelectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/group/select",
  component: GroupSelect,
});

const groupPasscodeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/group/passcode",
  component: GroupPasscode,
});

const groupDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/group/dashboard",
  component: GroupDashboard,
});

const fanHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fan",
  component: FanHome,
});

const fanGroupViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fan/$groupName",
  component: FanGroupView,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  groupSelectRoute,
  groupPasscodeRoute,
  groupDashboardRoute,
  fanHomeRoute,
  fanGroupViewRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
