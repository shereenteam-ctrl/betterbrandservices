globalThis.__nitro_main__ = import.meta.url;
import { N as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, t as toEventHandler, a as defineLazyEventHandler, b as H3Core } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/__forms.html": {
    "type": "text/html; charset=utf-8",
    "etag": '"307-8h32RXCgqnbrVMYnKR7qd0+BmgA"',
    "mtime": "2026-08-11T00:49:01.370Z",
    "size": 775,
    "path": "../public/__forms.html"
  },
  "/BBS logo 48x48.jpg": {
    "type": "image/jpeg",
    "etag": '"143d-iB8Sz4alopqO3vRDS17mu9usiMI"',
    "mtime": "2026-08-11T00:49:01.372Z",
    "size": 5181,
    "path": "../public/BBS logo 48x48.jpg"
  },
  "/compact-logo.png": {
    "type": "image/png",
    "etag": '"1d0c9-hfnWaMrUcxH3jcoTSKnUBsZt2y0"',
    "mtime": "2026-08-11T00:49:01.372Z",
    "size": 118985,
    "path": "../public/compact-logo.png"
  },
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": '"85-eYRVBmCKUbckiBFcZhcjdVl9+Rw"',
    "mtime": "2026-08-11T00:49:01.371Z",
    "size": 133,
    "path": "../public/favicon.svg"
  },
  "/assets/builder-CcocYF3G.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e178-qgS0Oh34+QlZiXobc+M2YES69vw"',
    "mtime": "2026-08-11T00:48:59.893Z",
    "size": 57720,
    "path": "../public/assets/builder-CcocYF3G.js"
  },
  "/assets/index-CHIuTmYe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"816e-gf9z5dNKQuUWdm3GihuiWl1xlGk"',
    "mtime": "2026-08-11T00:48:59.894Z",
    "size": 33134,
    "path": "../public/assets/index-CHIuTmYe.js"
  },
  "/assets/index-CNROTpLh.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"12967-zhw9JPT/RoPQMRhHCe/H4sOXuVU"',
    "mtime": "2026-08-11T00:48:59.893Z",
    "size": 76135,
    "path": "../public/assets/index-CNROTpLh.css"
  },
  "/assets/index-DSchI0Uy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4f425-BxeCXuNXHABkHPrQASAhZ6kuORg"',
    "mtime": "2026-08-11T00:48:59.893Z",
    "size": 324645,
    "path": "../public/assets/index-DSchI0Uy.js"
  },
  "/assets/zap-FEeBWzoN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10fd-E5r4TJhINNYM6QC65quzkE5MrUk"',
    "mtime": "2026-08-11T00:48:59.894Z",
    "size": 4349,
    "path": "../public/assets/zap-FEeBWzoN.js"
  },
  "/auth-emails/confirmation.html": {
    "type": "text/html; charset=utf-8",
    "etag": '"4a0-AQUmylVA5fCDPY/CSkARfpGWZx4"',
    "mtime": "2026-08-11T00:49:01.365Z",
    "size": 1184,
    "path": "../public/auth-emails/confirmation.html"
  },
  "/auth-emails/recovery.html": {
    "type": "text/html; charset=utf-8",
    "etag": '"496-Kvd2ocEO5pHi7YwxfrSW8R3R0lI"',
    "mtime": "2026-08-11T00:49:01.366Z",
    "size": 1174,
    "path": "../public/auth-emails/recovery.html"
  },
  "/samples/card-aurora.svg": {
    "type": "image/svg+xml",
    "etag": '"433-KHStuu7abyToS2xzaAFXUwbVLEo"',
    "mtime": "2026-08-11T00:49:01.367Z",
    "size": 1075,
    "path": "../public/samples/card-aurora.svg"
  },
  "/samples/card-northline.svg": {
    "type": "image/svg+xml",
    "etag": '"3de-6XFc0Dr//O4kMPV8J7Un/5k50rw"',
    "mtime": "2026-08-11T00:49:01.371Z",
    "size": 990,
    "path": "../public/samples/card-northline.svg"
  },
  "/samples/card-sable.svg": {
    "type": "image/svg+xml",
    "etag": '"377-2Kxbm6CYCKb2qJoxFvQCCCfCqNQ"',
    "mtime": "2026-08-11T00:49:01.369Z",
    "size": 887,
    "path": "../public/samples/card-sable.svg"
  },
  "/samples/card-tide.svg": {
    "type": "image/svg+xml",
    "etag": '"3ce-yhgsyDCrDqENHDsl/ZBDkq1I/Q0"',
    "mtime": "2026-08-11T00:49:01.371Z",
    "size": 974,
    "path": "../public/samples/card-tide.svg"
  },
  "/samples/flyer-aurora.svg": {
    "type": "image/svg+xml",
    "etag": '"4ca-H3V3qOxT0XorEKkYHVxnH2lafGM"',
    "mtime": "2026-08-11T00:49:01.367Z",
    "size": 1226,
    "path": "../public/samples/flyer-aurora.svg"
  },
  "/samples/flyer-northline.svg": {
    "type": "image/svg+xml",
    "etag": '"47e-cwHiI3km8WcpVX6VsyaRqm8q888"',
    "mtime": "2026-08-11T00:49:01.368Z",
    "size": 1150,
    "path": "../public/samples/flyer-northline.svg"
  },
  "/samples/flyer-sable.svg": {
    "type": "image/svg+xml",
    "etag": '"3be-22vq2nYOnQ6wS3oPS4eurgwnrjQ"',
    "mtime": "2026-08-11T00:49:01.369Z",
    "size": 958,
    "path": "../public/samples/flyer-sable.svg"
  },
  "/samples/flyer-tide.svg": {
    "type": "image/svg+xml",
    "etag": '"425-RlDDJ4QlCV0W5Va9hBGgcXQhwQE"',
    "mtime": "2026-08-11T00:49:01.369Z",
    "size": 1061,
    "path": "../public/samples/flyer-tide.svg"
  },
  "/samples/logo-aurora.svg": {
    "type": "image/svg+xml",
    "etag": '"303-mp6P77RtPh97WR6ZCb5lauSjKKg"',
    "mtime": "2026-08-11T00:49:01.369Z",
    "size": 771,
    "path": "../public/samples/logo-aurora.svg"
  },
  "/samples/logo-northline.svg": {
    "type": "image/svg+xml",
    "etag": '"259-7uwxdHrfa/KZkdFdEblrrMj1F6A"',
    "mtime": "2026-08-11T00:49:01.369Z",
    "size": 601,
    "path": "../public/samples/logo-northline.svg"
  },
  "/samples/logo-sable.svg": {
    "type": "image/svg+xml",
    "etag": '"244-XY0N+NimRtzw7D231VC3knlWEXk"',
    "mtime": "2026-08-11T00:49:01.369Z",
    "size": 580,
    "path": "../public/samples/logo-sable.svg"
  },
  "/samples/logo-tide.svg": {
    "type": "image/svg+xml",
    "etag": '"2b3-UUbUhKHMarnaCQ5kLdRft4hCbeU"',
    "mtime": "2026-08-11T00:49:01.370Z",
    "size": 691,
    "path": "../public/samples/logo-tide.svg"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _i7G81M = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_9wcZDG = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_9wcZDG };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_i7G81M)
].filter(Boolean);
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    middleware.push(...h3App["~middleware"]);
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const tracingSrvxPlugins = [];
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch,
  plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};
