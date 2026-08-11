import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, O as Outlet, S as Scripts } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const Route$2 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Better Brand Services"
      }
    ],
    links: [
      {
        rel: "icon",
        href: "/BBS%20logo%2048x48.jpg",
        type: "image/jpeg"
      }
    ]
  }),
  component: RootDocument
});
function RootDocument() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$1 = () => import("./index-DlViSvw4.mjs");
const Route$1 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Better Brand Services | Branding, Websites, Logos & Creative Solutions"
    }, {
      name: "description",
      content: "Better Brand Services helps businesses grow with premium branding, websites, logo design, marketing graphics, and creative digital solutions."
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:url",
      content: "https://betterbrandservices.com/"
    }, {
      property: "og:site_name",
      content: "Better Brand Services"
    }, {
      property: "og:title",
      content: "Better Brand Services — Build a Brand People Remember"
    }, {
      property: "og:description",
      content: "Premium logos, websites, marketing visuals, branding, and professional content for growing businesses."
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }],
    links: [{
      rel: "canonical",
      href: "https://betterbrandservices.com/"
    }, {
      rel: "icon",
      href: "/favicon.svg",
      type: "image/svg+xml"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./builder-BYM2mJm0.mjs");
const Route = createFileRoute()({
  head: () => ({
    meta: [{
      title: "BBS AI Builder | Better Brand Services"
    }, {
      name: "description",
      content: "Build, manage, and prepare websites for deployment in the BBS AI Builder workspace."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$2
});
const BuilderRoute = Route.update({
  id: "/builder",
  path: "/builder",
  getParentRoute: () => Route$2
});
const rootRouteChildren = {
  IndexRoute,
  BuilderRoute
};
const routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
};
export {
  getRouter
};
