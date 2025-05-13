import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, Meta, Links, ScrollRestoration, Scripts, Outlet, createCookieSessionStorage, redirect, Form, Link, NavLink, useLocation, useFetcher, useNavigation, useSubmit } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import React__default, { createElement, createContext, useState, useEffect, StrictMode, forwardRef, useId, useRef, Suspense } from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader, User2, ShoppingCart, ServerCrash, Trash2, Minus, Plus, X } from "lucide-react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
const initialState = {
  theme: "system",
  setTheme: () => null
};
const ThemeProviderContext = createContext(initialState);
function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "fullstock-ui-theme",
  ...props
}) {
  console.log("ThemeProvider", { defaultTheme, storageKey });
  const [theme, setTheme] = useState(defaultTheme);
  useEffect(() => {
    const userTheme = localStorage.getItem(storageKey);
    setTheme(userTheme || defaultTheme);
  }, [defaultTheme, storageKey]);
  useEffect(() => {
    const root2 = window.document.documentElement;
    root2.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root2.classList.add(systemTheme);
      return;
    }
    root2.classList.add(theme);
  }, [theme]);
  const value = {
    theme,
    setTheme: (theme2) => {
      localStorage.setItem(storageKey, theme2);
      setTheme(theme2);
    }
  };
  return /* @__PURE__ */ jsx(ThemeProviderContext.Provider, { ...props, value, children });
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "UTF-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }), /* @__PURE__ */ jsx("title", {
        children: "FullStock | Inicio"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/svg+xml",
        href: "/fullstock.svg"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function Root() {
  return /* @__PURE__ */ jsx(StrictMode, {
    children: /* @__PURE__ */ jsx(ThemeProvider, {
      storageKey: "fullstock-ui-theme",
      children: /* @__PURE__ */ jsx(Outlet, {})
    })
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const API_URL = "http://localhost:3000/api";
const TOKEN_KEY = "auth_token";
const LOCAL_CART_KEY = "cart";
function isApiError(data) {
  return typeof data === "object" && data !== null && "error" in data && typeof data.error === "object" && data.error !== null && "message" in data.error;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}
async function client(endpoint, { body, headers: customHeaders, ...customConfig } = {}) {
  const token = getToken();
  const config = {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : void 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...customHeaders
    },
    ...customConfig
  };
  try {
    const response = await fetch(API_URL + endpoint, config);
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    if (response.status === 401 && token) {
      removeToken();
      window.location.assign("/login");
    }
    if (isApiError(data)) throw new Error(data.error.message);
    throw new Error("Unknown error");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
function debounceAsync(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(func(...args));
      }, timeout);
    });
  };
}
const Button = React.forwardRef(
  ({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const defaultClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:w-4 [&>svg]:h-4 [&>svg]:flex-shrink-0";
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary-hover",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
      outline: "text-muted-foreground border border-border bg-background hover:bg-muted",
      ghost: "text-muted-foreground bg-transparent hover:bg-muted"
    };
    const sizeClasses = {
      default: "h-8 py-1.5 px-2.5",
      sm: "h-6 rounded-md py-1 px-2",
      lg: "h-10 rounded-lg py-2.5 px-3.5",
      xl: "h-12 rounded-lg py-3 px-8 text-base [&>svg]:w-5 [&>svg]:h-5",
      "sm-icon": "h-7 w-7 cursor-pointer [&>svg]:w-5 [&>svg]:h-5",
      icon: "h-8 w-8 [&>svg]:w-5 [&>svg]:h-5",
      "lg-icon": "h-9 w-9 [&>svg]:w-5 [&>svg]:h-5",
      "xl-icon": "h-10 w-10 [&>svg]:w-6 [&>svg]:h-6"
    };
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(
          defaultClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
function Container({
  children,
  className
}) {
  return /* @__PURE__ */ jsx("div", { className: cn(`mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl`, className), children });
}
function ContainerLoader({ className }) {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full grow items-center justify-center", children: /* @__PURE__ */ jsx(
    Loader,
    {
      className: cn("h-8 w-8 animate-spin", className),
      "aria-label": "Loading"
    }
  ) });
}
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-xl border border-solid border-border bg-background py-2 px-3 text-base focus-visible:outline-2 focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-2 [&::file-selector-button]:border-0 [&::file-selector-button]:bg-transparent [&::file-selector-button]:text-sm [&::file-selector-button]:font-medium [&::file-selector-button]:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva("text-sm font-medium leading-none", {
  variants: {
    variant: {
      default: "text-foreground",
      error: "text-destructive",
      muted: "text-muted-foreground",
      disabled: "cursor-not-allowed opacity-70"
    },
    size: {
      default: "text-sm",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const Label = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      ref,
      className: cn(labelVariants({ variant, size, className })),
      ...props
    }
  )
);
Label.displayName = LabelPrimitive.Root.displayName;
const InputField = forwardRef(
  ({ label, id: providedId, error, className, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const hasError = Boolean(error);
    const inputClasses = cn(className, {
      "border-red-500": hasError
    });
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: id, children: label }),
      /* @__PURE__ */ jsx(Input, { ref, id, className: inputClasses, ...props }),
      hasError && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm mt-1 leading-none", children: /* @__PURE__ */ jsx("p", { children: error }) })
    ] });
  }
);
InputField.displayName = "InputField";
const sectionVariants = cva("", {
  variants: {
    padding: {
      default: "py-12 md:py-16",
      none: "py-0",
      sm: "py-6 md:py-8",
      lg: "py-16 md:py-20"
    }
  },
  defaultVariants: {
    padding: "default"
  }
});
function Section({
  className,
  children,
  padding,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      className: cn(sectionVariants({ padding, className })),
      ...props,
      children
    }
  );
}
const Select = React__default.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  "select",
  {
    ref,
    className: cn(
      "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props,
    children
  }
));
Select.displayName = "BasicSelect";
const Option = React__default.forwardRef(({ children, ...props }, ref) => /* @__PURE__ */ jsx("option", { ref, ...props, children }));
Option.displayName = "BasicOption";
const SelectField = forwardRef(
  ({ label, id: providedId, error, className, options, placeholder, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const hasError = Boolean(error);
    const selectClasses = cn(
      "block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
      hasError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600",
      className
    );
    return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: id, children: label }),
      /* @__PURE__ */ jsxs(Select, { ref, id, className: selectClasses, ...props, children: [
        /* @__PURE__ */ jsx("option", { value: "", children: placeholder || "Seleccione una opción" }),
        options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
      ] }),
      hasError && /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-red-600 dark:text-red-400", children: /* @__PURE__ */ jsx("p", { children: error }) })
    ] });
  }
);
SelectField.displayName = "SelectField";
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "bg-gray-200 dark:bg-gray-700",
        orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__session",
    // all of these are optional
    // domain: "/",
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: true
  }
});
async function serverClient(endpoint, request, { body, headers: customHeaders, ...customConfig } = {}) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");
  const config = {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : void 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...customHeaders
    },
    ...customConfig
  };
  try {
    const response = await fetch(API_URL + endpoint, config);
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    if (response.status === 401 && token) {
      throw new Error("Unauthorized");
    }
    if (isApiError(data)) throw new Error(data.error.message);
    throw new Error("Unknown error");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getCurrentUser$1(request) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("token");
  if (!token) return null;
  try {
    return serverClient("/users/me", request);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
async function login(request, email, password) {
  const data = await serverClient("/auth/login", request, {
    body: { email, password }
  });
  return data;
}
async function signup(request, email, password) {
  const data = await serverClient("/auth/signup", request, {
    body: { email, password }
  });
  return data;
}
async function redirectIfAuthenticated(request, redirectTo = "/") {
  const user = await getCurrentUser$1(request);
  if (user) {
    throw redirect(redirectTo);
  }
  return null;
}
function AuthNav({ user }) {
  return /* @__PURE__ */ jsx("div", { className: "bg-black text-white text-sm font-medium", children: /* @__PURE__ */ jsx(Container, { className: "h-10 flex justify-end items-center", children: /* @__PURE__ */ jsx("nav", { "aria-label": "Autenticación de usuario", children: /* @__PURE__ */ jsx("ul", { className: "flex items-center gap-4", children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("li", { children: [
      "Bienvenido ",
      user.name || user.email
    ] }),
    /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Form, { method: "post", action: "/logout", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "text-white", children: "Cerrar sesión" }) }) })
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/login",
        className: "hover:underline hover:decoration-white hover:underline-offset-2",
        children: "Iniciar sesión"
      }
    ) }),
    /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/signup",
        className: "hover:underline hover:decoration-white hover:underline-offset-2",
        children: "Crear una cuenta"
      }
    ) })
  ] }) }) }) }) });
}
const logo = "/assets/fullstock-logo-D2omHfT8.svg";
function HeaderActions({
  user,
  totalItems
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
    user && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Link, { to: "/account", children: /* @__PURE__ */ jsx(
        Button,
        {
          size: "xl-icon",
          variant: "ghost",
          "aria-label": "Cuenta de usuario",
          children: /* @__PURE__ */ jsx(User2, {})
        }
      ) }),
      /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6" })
    ] }),
    /* @__PURE__ */ jsx(
      Button,
      {
        size: "xl-icon",
        variant: "ghost",
        "aria-label": "Carrito de compras",
        asChild: true,
        className: "relative",
        children: /* @__PURE__ */ jsxs(Link, { to: "/cart", children: [
          /* @__PURE__ */ jsx(ShoppingCart, {}),
          totalItems > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center", children: totalItems })
        ] })
      }
    )
  ] });
}
function MainNav({ items }) {
  return /* @__PURE__ */ jsx(
    "nav",
    {
      "aria-label": "Navegación principal",
      className: "static sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
      children: /* @__PURE__ */ jsx("ul", { className: "flex justify-center h-12", role: "menubar", children: items.map((item) => /* @__PURE__ */ jsx("li", { className: "flex justify-center", role: "none", children: /* @__PURE__ */ jsx(
        NavLink,
        {
          to: item.to,
          role: "menuitem",
          className: ({ isActive }) => cn(
            "inline-flex justify-center items-center p-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent",
            isActive && "text-accent-foreground"
          ),
          children: item.label
        }
      ) }, item.to)) })
    }
  );
}
const navigation = [
  { to: "polos", label: "Polos" },
  { to: "tazas", label: "Tazas" },
  { to: "stickers", label: "Stickers" }
];
function HeaderMain({
  user,
  totalItems
}) {
  return /* @__PURE__ */ jsxs(Container, { className: "relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-12", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("img", { src: logo, alt: "FullStock inicio", width: "128", height: "32" }) }),
      /* @__PURE__ */ jsx(HeaderActions, { user, totalItems })
    ] }),
    /* @__PURE__ */ jsx(Separator, { className: "block sm:hidden" }),
    /* @__PURE__ */ jsx(MainNav, { items: navigation })
  ] });
}
const VALID_SLUGS = ["polos", "stickers", "tazas"];
function isValidCategorySlug(categorySlug) {
  return typeof categorySlug === "string" && VALID_SLUGS.includes(categorySlug);
}
async function deleteRemoteCart() {
  return client("/cart", {
    method: "DELETE"
  });
}
function deleteLocalCart() {
  localStorage.removeItem(LOCAL_CART_KEY);
}
async function clientAction$2({
  request
}) {
  const data = await request.formData();
  try {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    return {
      ok: true,
      message: `Suscripción exitosa con email: ${data.get("email")}`
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Hubo un error al procesar tu solicitud"
    };
  }
}
async function loader$4({
  request
}) {
  const user = await getCurrentUser$1(request);
  return user ? {
    user,
    totalItems: 0
  } : {
    totalItems: 0
  };
}
const index$b = withComponentProps(function Root2({
  loaderData
}) {
  var _a;
  const {
    totalItems,
    user
  } = loaderData;
  const location = useLocation();
  const fetcher = useFetcher();
  const emailRef = useRef(null);
  const isSubmitting = fetcher.state === "submitting";
  useEffect(() => {
    var _a2;
    if (((_a2 = fetcher.data) == null ? void 0 : _a2.ok) && emailRef.current) {
      emailRef.current.value = "";
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-rows-[auto_1fr_auto] min-h-screen bg-background",
    children: [/* @__PURE__ */ jsxs("header", {
      className: "sticky top-0 bg-background border-b border-border z-50",
      children: [/* @__PURE__ */ jsx(AuthNav, {
        user
      }), /* @__PURE__ */ jsx(HeaderMain, {
        user,
        totalItems
      })]
    }), /* @__PURE__ */ jsx("main", {
      children: /* @__PURE__ */ jsx(Suspense, {
        fallback: /* @__PURE__ */ jsx(ContainerLoader, {}),
        children: /* @__PURE__ */ jsx(Outlet, {})
      }, location.key)
    }), /* @__PURE__ */ jsx("footer", {
      className: "border-t border-border",
      children: /* @__PURE__ */ jsxs(Container, {
        children: [/* @__PURE__ */ jsxs(Section, {
          className: "flex flex-col gap-8 lg:flex-row",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap gap-y-4 gap-x-8 flex-grow",
            children: [/* @__PURE__ */ jsxs("ul", {
              className: "flex-1 basis-40 flex flex-col gap-6 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsx("li", {
                className: "font-medium text-foreground",
                children: "Tienda"
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "/polos",
                  children: "Polos"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "/tazas",
                  children: "Tazas"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "/stickers",
                  children: "Stickers"
                })
              })]
            }), /* @__PURE__ */ jsxs("ul", {
              className: "flex-1 basis-40 flex flex-col gap-6 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsx("li", {
                className: "font-medium text-foreground",
                children: "Compañía"
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "/quienes-somos",
                  children: "Quienes somos"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "/terminos",
                  children: "Términos y condiciones"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "/privacidad",
                  children: "Privacidad"
                })
              })]
            }), /* @__PURE__ */ jsxs("ul", {
              className: "flex-1 basis-40 flex flex-col gap-6 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsx("li", {
                className: "font-medium text-foreground",
                children: "Conecta"
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "/contacto",
                  children: "Contáctanos"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "https://www.facebook.com/",
                  target: "_blank",
                  children: "Facebook"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(Link, {
                  to: "https://www.instagram.com/",
                  target: "_blank",
                  children: "Instagram"
                })
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "text-sm max-w-md",
            children: [/* @__PURE__ */ jsx("p", {
              className: "font-medium mb-6",
              children: "Suscríbete a nuestro boletín"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-muted-foreground mb-2",
              children: "Recibe las últimas ofertas y descuentos en tu correo semanalmente."
            }), /* @__PURE__ */ jsxs(fetcher.Form, {
              method: "post",
              className: "flex gap-2",
              children: [/* @__PURE__ */ jsx(Input, {
                type: "email",
                ref: emailRef,
                "aria-label": "email",
                required: true,
                name: "email",
                disabled: isSubmitting,
                placeholder: "ejemplo@mail.com"
              }), /* @__PURE__ */ jsx(Button, {
                size: "lg",
                variant: "secondary",
                type: "submit",
                disabled: isSubmitting,
                children: isSubmitting ? "Enviando..." : "Suscribirse"
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-muted-foreground my-2",
              children: (_a = fetcher.data) == null ? void 0 : _a.message
            })]
          })]
        }), /* @__PURE__ */ jsx(Separator, {
          orientation: "horizontal",
          decorative: true
        }), /* @__PURE__ */ jsx("small", {
          className: "block text-center text-sm text-muted-foreground py-6",
          children: "Todos los derechos reservados © Full Stock"
        })]
      })
    }), /* @__PURE__ */ jsx(ScrollRestoration, {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientAction: clientAction$2,
  default: index$b,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
function Truck(props) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 64,
      height: 64,
      fill: "none",
      ...props,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fill: "currentColor",
          d: "M8 41H7v1h1v-1Zm32-27a1 1 0 1 0 0 2v-2Zm20 31v1h1v-1h-1Zm-5 0v-1h-1v1h1Zm5-9a1 1 0 0 0 0-2v2Zm0 6a1 1 0 0 0 0-2v2ZM2 15a1 1 0 1 0 0 2v-2Zm12 2a1 1 0 0 0 0-2v2Zm6-2a1 1 0 1 0 0 2v-2Zm4 2a1 1 0 0 0 0-2v2Zm-11 2a1 1 0 1 0 0 2v-2Zm22 2a1 1 0 0 0 0-2v2ZM6 25a1 1 0 1 0 0 2v-2Zm22 2a1 1 0 0 0 0-2v2ZM12 10h24V8H12v2Zm27 3v28h2V13h-2Zm1 27H8v2h32v-2ZM9 41V13H7v28h2Zm27-31a3 3 0 0 1 3 3h2a5 5 0 0 0-5-5v2ZM12 8a5 5 0 0 0-5 5h2a3 3 0 0 1 3-3V8Zm28 8h13.046v-2H40v2Zm15.913 2.118 2.778 9.026 1.911-.588-2.777-9.026-1.912.588ZM59 29.203V45h2V29.203h-2ZM49.172 40H40v2h9.172v-2ZM60 44h-5.172v2H60v-2Zm-5.879-.293-2.828-2.828-1.414 1.414 2.828 2.828 1.414-1.414ZM49.172 42a.995.995 0 0 1 .707.293l1.414-1.414a3 3 0 0 0-2.121-.88v2Zm9.519-14.856A7 7 0 0 1 59 29.203h2c0-.897-.134-1.79-.398-2.647l-1.911.588ZM54.828 44a1 1 0 0 1-.707-.293l-1.414 1.414a3 3 0 0 0 2.121.879v-2Zm-1.782-28a3 3 0 0 1 2.867 2.118l1.912-.588a5 5 0 0 0-4.78-3.53v2h.001ZM51 50a4 4 0 0 1-4 4v2a6 6 0 0 0 6-6h-2Zm-4 4a4 4 0 0 1-4-4h-2a6 6 0 0 0 6 6v-2Zm-4-4a4 4 0 0 1 4-4v-2a6 6 0 0 0-6 6h2Zm4-4a4 4 0 0 1 4 4h2a6 6 0 0 0-6-6v2Zm-23 4a4 4 0 0 1-4 4v2a6 6 0 0 0 6-6h-2Zm-4 4a4 4 0 0 1-4-4h-2a6 6 0 0 0 6 6v-2Zm-4-4a4 4 0 0 1 4-4v-2a6 6 0 0 0-6 6h2Zm4-4a4 4 0 0 1 4 4h2a6 6 0 0 0-6-6v2Zm5 5h17v-2H25v2Zm-12.172 0H15v-2h-2.172v2Zm-.707-2.293-3.414-3.414-1.414 1.414 3.414 3.414 1.414-1.414Zm.707.293a1 1 0 0 1-.707-.293l-1.414 1.414a3 3 0 0 0 2.121.879v-2ZM52 51h4v-2h-4v2Zm3-5h6v-2h-6v2Zm6 0v3h2v-3h-2Zm0 3h-5v2h5v-2Zm-7-4v4h2v-4h-2Zm2 4h-2a2 2 0 0 0 2 2v-2Zm5 0v2a2 2 0 0 0 2-2h-2Zm0-3h2a2 2 0 0 0-2-2v2Zm-4-10h3v-2h-3v2Zm3 4h-3v2h3v-2Zm-5-4v4h2v-4h-2Zm2 4h-2a2 2 0 0 0 2 2v-2Zm0-6a2 2 0 0 0-2 2h2v-2ZM5 42h5v-2H5v2Zm5 0v3h2v-3h-2Zm0 3H5v2h5v-2Zm-7-3v3h2v-3H3Zm2 3H3a2 2 0 0 0 2 2v-2Zm5 0v2a2 2 0 0 0 2-2h-2Zm0-3h2a2 2 0 0 0-2-2v2Zm-5-2a2 2 0 0 0-2 2h2v-2Zm42 10v2a2 2 0 0 0 2-2h-2Zm0 0h-2a2 2 0 0 0 2 2v-2Zm0 0v-2a2 2 0 0 0-2 2h2Zm0 0h2a2 2 0 0 0-2-2v2Zm-27 0v2a2 2 0 0 0 2-2h-2Zm0 0h-2a2 2 0 0 0 2 2v-2Zm0 0v-2a2 2 0 0 0-2 2h2Zm0 0h2a2 2 0 0 0-2-2v2Zm25-25.438V20h-2v4.562h2ZM52.515 18H45v2h7.515v-2Zm0 2 2.5 8 1.909-.597-2.5-8-1.909.597Zm-3.791 8L45 24.562l-1.357 1.47 3.725 3.438L48.724 28Zm.001 2h6.29v-2h-6.291l.001 2Zm-1.357-.53c.37.34.854.53 1.357.53l-.001-2-1.356 1.47ZM55.015 28v2a2.001 2.001 0 0 0 1.909-2.597L55.015 28Zm-2.5-8 1.909-.597A1.998 1.998 0 0 0 52.515 18v2ZM45 20v-2a2 2 0 0 0-2 2h2Zm-2 4.562a2.001 2.001 0 0 0 .643 1.47L45 24.562h-2ZM2 17h12v-2H2v2Zm18 0h4v-2h-4v2Zm-7 4h22v-2H13v2Zm-7 6h22v-2H6v2Z"
        }
      )
    }
  );
}
function Return(props) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 64,
      height: 64,
      fill: "none",
      ...props,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fill: "currentColor",
          d: "m23.458 4.672.942-.334-.287-.811-.845.163.19.982Zm15.014.192.214-.977-.84-.185-.308.803.934.359ZM53.139 22.89l-.124.993.124-.992v-.001ZM47 47.998a1 1 0 1 0 0 2v-2Zm4 1h1a1 1 0 0 0-1-1v1Zm-6-5a1 1 0 0 0 0-2v2Zm-4-1h-1a1 1 0 0 0 1 1v-1Zm9.93 2.165a1 1 0 0 0 1.973-.332l-1.973.332Zm-9.86 1.668a1 1 0 1 0-1.973.332l1.973-.332ZM50 52.998a1 1 0 0 0 2 0h-2Zm-8-14a1 1 0 0 0-2 0h2ZM16.476 7.83a36.14 36.14 0 0 1 7.171-2.176l-.379-1.964A38.137 38.137 0 0 0 15.7 5.987l.776 1.843Zm-11.28 4.75 11.28-4.75-.776-1.843-11.28 4.75.776 1.843Zm2.54 9.318-2.54-9.318-1.93.526 2.541 9.317 1.929-.525Zm5.982-.747-5.982.747.249 1.984 5.981-.747-.248-1.984Zm1.4 30.764.847-28.72-1.999-.06-.847 28.72 2 .06h-.001ZM31 54.998a55.034 55.034 0 0 1-15.204-2.128l-.552 1.922A57.035 57.035 0 0 0 31 56.998v-2Zm22.264-33.1-5.982-.747-.248 1.984 5.981.748.249-1.985Zm2.54-9.318-2.54 9.318 1.929.526 2.541-9.318-1.93-.526Zm-11.28-4.75 11.28 4.75.777-1.843-11.28-4.75-.777 1.843Zm-6.267-1.99c2.14.47 4.238 1.136 6.267 1.99l.777-1.843a38.15 38.15 0 0 0-6.615-2.1l-.429 1.953ZM31 4.998a31.09 31.09 0 0 1-7.127-.823l-.458 1.947c2.437.573 4.976.876 7.585.876v-2Zm0 4a7.003 7.003 0 0 1-6.437-4.244l-1.838.789A9.002 9.002 0 0 0 31 10.998v-2Zm-6.437-4.244a6.965 6.965 0 0 1-.163-.416l-1.885.668c.065.182.135.36.21.537l1.838-.79Zm13.564-.58A31.092 31.092 0 0 1 31 4.999v2c2.609 0 5.148-.303 7.585-.876l-.458-1.947Zm-.589.33a7.024 7.024 0 0 1-.101.25l1.838.789c.045-.106.089-.213.13-.321l-1.867-.717Zm-.101.25A7.001 7.001 0 0 1 31 8.998v2c3.714 0 6.9-2.25 8.275-5.455l-1.838-.79v.003Zm20.297 8.352a2 2 0 0 0-1.153-2.37l-.777 1.844 1.93.526Zm-4.719 10.777a2 2 0 0 0 2.178-1.46l-1.929-.525-.249 1.985Zm-5.981-.748.248-1.984a2 2 0 0 0-2.247 2.043l1.999-.06Zm-33.915 28.72c-.039 1.334.811 2.56 2.125 2.937l.552-1.922a.954.954 0 0 1-.678-.955l-1.999-.06Zm.847-28.72 1.999.06a2 2 0 0 0-2.247-2.044l.248 1.984Zm-8.159-.71a2 2 0 0 0 2.178 1.457l-.249-1.984-1.929.527Zm-1.388-11.69a2 2 0 0 0-1.153 2.37l1.931-.526-.778-1.843ZM58 45.999c0 6.628-5.373 12-12 12v2c7.732 0 14-6.268 14-14h-2Zm-24 0c0-6.627 5.373-12 12-12v-2c-7.732 0-14 6.268-14 14h2Zm12-12c.1 0 .2 0 .3.004l.049-2a13.537 13.537 0 0 0-.349-.004v2Zm.3.004C52.789 34.16 58 39.47 58 45.998h2c0-7.615-6.08-13.81-13.651-13.996l-.049 2Zm-1.265-10.808.29 9.838 1.999-.06-.29-9.837-1.999.059ZM46 57.998a11.96 11.96 0 0 1-8.04-3.091l-1.34 1.484A13.953 13.953 0 0 0 46 59.998v-2Zm-8.04-3.091a11.967 11.967 0 0 1-3.96-8.91h-2c0 4.125 1.784 7.833 4.62 10.394l1.34-1.484Zm-.781-.252c-2.028.227-4.09.343-6.179.343v2c2.164 0 4.3-.12 6.401-.355l-.222-1.988ZM47 49.998h4v-2h-4v2Zm-2-8h-4v2h4v-2Zm4.536 7.536a5.001 5.001 0 0 1-7.072 0l-1.414 1.414a7.002 7.002 0 0 0 9.9 0l-1.414-1.414Zm-7.072-7.071a4.998 4.998 0 0 1 7.072-.001l1.414-1.414a6.999 6.999 0 0 0-9.9-.001l1.414 1.416Zm7.072-.001a4.976 4.976 0 0 1 1.394 2.7l1.973-.33a6.973 6.973 0 0 0-1.953-3.784l-1.414 1.414Zm-7.072 7.072a4.975 4.975 0 0 1-1.394-2.701l-1.973.33a6.974 6.974 0 0 0 1.953 3.785l1.414-1.414Zm7.703-.771c-.18.272-.39.53-.631.77l1.414 1.415c.33-.33.625-.69.883-1.078l-1.666-1.107Zm-.167.235v.319h2v-.32h-2Zm0 .319v3.68h2v-3.68h-2Zm-8.167-6.084c.18-.271.389-.53.631-.77l-1.414-1.416a7.026 7.026 0 0 0-.883 1.079l1.666 1.107Zm.167-.235v-.32h-2V43h2v-.002Zm0-.32V39h-2v3.679h2Z"
        }
      )
    }
  );
}
function Ribbon(props) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 64,
      height: 64,
      fill: "none",
      ...props,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fill: "currentColor",
          d: "m38.75 61.4-.624.782.625-.78-.001-.001Zm-5.5-4.4.624-.781-.625.78.001.002Zm-2.5 0-.624-.781.625.78-.001.002ZM21.459 6.99l-.08-.997.08.997ZM11.104 20.013l-.761-.65.76.65h.001Zm1.885-4.553-.996-.08.996.08Zm-2.567 15.73.761-.648-.76.649-.001-.001Zm0-10.377.761.648-.76-.648h-.001Zm.682 11.178-.761.648.76-.648h.001Zm26.885 14.907.649.76-.65-.76h.001Zm14.908-26.885.76-.65-.76.65Zm-10.895 25.06-.148-.988.147.99.001-.001Zm-20 0 .146-.988-.147.99.001-.001Zm5.706-18.78a1 1 0 1 0-1.414 1.416l1.414-1.414v-.001ZM31 31.003l-.707.707a1.001 1.001 0 0 0 1.54-.152L31 31v.002Zm6.832-8.446a1 1 0 1 0-1.664-1.11l1.664 1.11ZM40.5 40.724a1 1 0 0 0-1-1.732l1 1.732Zm5.989-10.841a1 1 0 0 0 1.932.518l-1.932-.518Zm.236 4.618a1.002 1.002 0 0 0-1.126-1.474 1 1 0 0 0-.607.476l1.733.998ZM42.61 36.61a1 1 0 0 0 1.413 1.415L42.61 36.61Zm-3.235 24.01-5.5-4.4-1.25 1.56 5.501 4.402 1.249-1.562Zm-9.249-4.401-5.501 4.4 1.249 1.563 5.501-4.4-1.249-1.563Zm3.749 0a3.003 3.003 0 0 0-3.749 0l1.25 1.562a1 1 0 0 1 1.249 0l1.25-1.561Zm-9.25 4.4a1.003 1.003 0 0 1-1.471-.248A1 1 0 0 1 23 59.84h-2c0 2.515 2.91 3.914 4.874 2.342l-1.249-1.562Zm13.501 1.563C40.09 63.754 43 62.355 43 59.84h-2a1 1 0 0 1-1.625.78l-1.249 1.562ZM36.54 5.184l.801.682 1.296-1.523-.8-.681-1.297 1.522Zm5.922 2.803 1.047.084.16-1.994-1.049-.084-.158 1.994Zm7.468 6.505.084 1.047 1.994-.16-.084-1.047-1.994.16Zm2.205 6.169.682.8 1.522-1.298-.682-.8-1.522 1.298Zm.682 9.88-.682.8 1.523 1.297.681-.8-1.522-1.297Zm-2.803 5.92-.084 1.049 1.994.16.084-1.048-1.994-.16Zm-6.505 7.47-1.048.084.16 1.993 1.048-.083-.16-1.994Zm-6.169 2.205-.8.682 1.298 1.522.8-.682-1.298-1.522Zm-9.88.682-.8-.681-1.297 1.52.8.683 1.297-1.522Zm-5.921-2.803-1.048-.084-.16 1.994 1.048.083.16-1.993ZM14.07 37.51l-.084-1.047-1.993.159.083 1.047 1.994-.16Zm-2.205-6.17-.682-.8-1.522 1.298.682.8 1.522-1.297Zm-.682-9.88.682-.8-1.522-1.297-.682.8 1.522 1.297Zm2.803-5.921.084-1.047-1.994-.16-.083 1.048 1.993.16v-.001Zm6.505-7.468 1.047-.084-.159-1.994-1.047.084.159 1.994Zm6.169-2.205.8-.682-1.297-1.522-.8.682 1.297 1.522Zm-5.122 2.12a9 9 0 0 0 5.122-2.12l-1.297-1.522a6.999 6.999 0 0 1-3.984 1.649l.159 1.994Zm-7.468 6.506a7 7 0 0 1 6.421-6.421l-.159-1.994a9 9 0 0 0-8.256 8.255l1.994.16Zm-2.205 6.169a9 9 0 0 0 2.121-5.122l-1.993-.16a7 7 0 0 1-1.65 3.984l1.522 1.298Zm-.682 9.88a7 7 0 0 1 0-9.08l-1.522-1.298a9 9 0 0 0 0 11.675l1.522-1.297Zm2.803 5.922a9 9 0 0 0-2.121-5.122l-1.522 1.297a7 7 0 0 1 1.65 3.984l1.993-.16Zm6.505 7.468a7 7 0 0 1-6.421-6.42l-1.994.158a9 9 0 0 0 8.256 8.256l.159-1.994Zm16.049 2.887a6.998 6.998 0 0 1-9.08 0l-1.297 1.522a9 9 0 0 0 11.675 0l-1.298-1.522Zm13.39-9.308a6.999 6.999 0 0 1-6.421 6.42l.16 1.995a9 9 0 0 0 8.255-8.255l-1.994-.16Zm2.205-6.17a8.997 8.997 0 0 0-2.121 5.122l1.994.16a7 7 0 0 1 1.65-3.984l-1.523-1.297Zm.682-9.88a7 7 0 0 1 0 9.08l1.522 1.298a9 9 0 0 0 0-11.675l-1.522 1.297Zm-2.803-5.921a9 9 0 0 0 2.121 5.122l1.522-1.298a7 7 0 0 1-1.649-3.983l-1.994.16v-.001ZM43.509 8.07a7 7 0 0 1 6.421 6.42l1.994-.16a9 9 0 0 0-8.255-8.254l-.16 1.994Zm-6.168-2.205a8.997 8.997 0 0 0 5.121 2.12l.158-1.993a7 7 0 0 1-3.983-1.65l-1.296 1.523Zm.496-2.204a8.997 8.997 0 0 0-11.674 0l1.297 1.522a7 7 0 0 1 9.08 0l1.297-1.522Zm4.624 40.353c-.204.016-.406.04-.609.07l.295 1.977c.157-.023.315-.041.474-.054l-.16-1.993Zm-.609.07a9 9 0 0 0-4.512 2.05l1.298 1.523a6.997 6.997 0 0 1 3.509-1.596l-.293-1.978h-.002Zm-.852.988V59.84h2V45.073h-2Zm-14.34 1.064a9.001 9.001 0 0 0-4.513-2.053l-.294 1.978a7 7 0 0 1 3.51 1.596l1.297-1.521Zm-4.513-2.053a8.955 8.955 0 0 0-.609-.07l-.159 1.994c.16.013.317.03.474.054l.294-1.978ZM23 59.84V45.073h-2V59.84h2Zm3.293-32.132 4 4 1.414-1.414-3.999-4-1.415 1.414Zm5.54 3.849 5.999-9.001-1.664-1.11-6 9 1.664 1.11h.001ZM39.5 38.99c-7.174 4.142-16.348 1.684-20.49-5.49l-1.732 1c4.694 8.13 15.091 10.917 23.222 6.222l-1-1.732ZM19.01 33.5c-4.142-7.175-1.684-16.348 5.49-20.49l-1-1.733c-8.13 4.695-10.917 15.092-6.222 23.223l1.732-1Zm5.49-20.49c7.174-4.143 16.348-1.685 20.49 5.49l1.732-1C42.028 9.37 31.632 6.584 23.5 11.278l1 1.733Zm20.49 5.49a14.95 14.95 0 0 1 1.499 11.383l1.932.518a16.954 16.954 0 0 0-1.699-12.9l-1.732.999Zm.002 15.003a14.901 14.901 0 0 1-2.382 3.107l1.413 1.414a16.902 16.902 0 0 0 2.702-3.523l-1.733-.998Z"
        }
      )
    }
  );
}
function Idea(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: 52,
      height: 64,
      fill: "none",
      ...props,
      children: [
        /* @__PURE__ */ jsx("g", { clipPath: "url(#a)", children: /* @__PURE__ */ jsx(
          "path",
          {
            fill: "currentColor",
            d: "M19.212 62.412c-.864-.864-1.571-3.076-1.571-4.915 0-1.84-.502-3.512-1.116-3.717-.613-.204-1.48-2.679-1.926-5.499-.516-3.261-2.099-7-4.35-10.272C5.965 31.78 4.94 27.077 6.551 21.05c3.59-13.42 18.614-19.263 30.06-11.688 2.252 1.49 3.826 3.144 3.498 3.675-.331.536-2.205-.26-4.207-1.787C32.8 8.884 31.36 8.498 25.64 8.498c-5.798 0-7.142.372-10.444 2.89C6.78 17.806 5.57 28.015 12.1 37.495c2.38 3.456 3.929 7.06 4.371 10.172l.686 4.82 6.24.298 6.24.297V40.99H21.64v4.44c0 2.442-.514 4.757-1.14 5.145-.839.518-1.004-2.049-.625-9.689.376-7.562.154-11.106-.817-13.012-1.209-2.374-1.066-3.042 1.526-7.129 1.573-2.48 3.373-4.827 4.001-5.215 1.553-.96 3.686.984 6.67 6.078 2.27 3.873 2.37 4.485 1.06 6.578-1.804 2.883-1.167 25.13.701 24.508.616-.205 1.424-2.505 1.797-5.11.432-3.018 2.015-6.68 4.364-10.089 4.437-6.442 5.424-12.249 3.05-17.933-.89-2.13-1.38-4.11-1.089-4.402 1.95-1.95 5.098 8.809 4.113 14.058-.376 2.006-2.32 6.024-4.318 8.93-2.575 3.743-3.77 6.698-4.1 10.144-.272 2.822-1.04 5.081-1.832 5.385-.774.297-1.364 1.961-1.364 3.844 0 1.827-.707 4.028-1.572 4.892-2.117 2.117-10.736 2.117-12.853 0Zm12.239-4.178.313-3.249h-6.062c-3.375 0-6.062.444-6.062 1 0 .55 2.25 1 4.999 1 2.75 0 4.999.45 4.999 1s-2.25 1-5 1c-4.686 0-5.958.705-4.286 2.377.39.391 2.978.579 5.748.417 4.881-.286 5.047-.396 5.35-3.545ZM29.638 37.49c0-1.083-1.111-1.5-4-1.5-2.888 0-3.998.417-3.998 1.5s1.11 1.5 3.999 1.5c2.888 0 3.999-.417 3.999-1.5Zm-2.25-4.188c-.962-.252-2.537-.252-3.499 0-.962.251-.175.457 1.75.457 1.924 0 2.712-.206 1.75-.457Zm2.649-5.114c1.326-2.564 1.264-3.1-.724-6.249l-2.175-3.444-.307 4.249c-.17 2.337-.706 4.249-1.192 4.249-.487 0-1.023-1.912-1.192-4.249l-.308-4.249-2.119 3.357c-1.934 3.064-1.993 3.61-.677 6.248 2.007 4.023 6.635 4.07 8.694.088ZM7.793 44.038c.43-1.288 1.801-1.52 1.925-.325.041.399-.465.905-1.125 1.125-.66.22-1.02-.14-.8-.8Zm33.384.02c-.683-1.105.894-2.298 1.818-1.375.95.95.773 2.306-.302 2.306-.517 0-1.2-.419-1.516-.93ZM.645 25.994c0-.55.424-1 .941-1 .517 0 1.219.45 1.559 1 .34.55-.084 1-.941 1s-1.559-.45-1.559-1Zm47.788-.2c.933-.933 1.466-.933 2.399 0s.666 1.2-1.2 1.2-2.133-.267-1.2-1.2ZM7.643 8.998c0-.55.424-1 .941-1 .518 0 1.219.45 1.559 1 .34.55-.084 1-.941 1s-1.559-.45-1.559-1Zm32.992.622c0-.208.675-.938 1.5-1.622 1.227-1.02 1.499-.951 1.499.377 0 .892-.675 1.622-1.5 1.622s-1.5-.17-1.5-.377ZM24.639 1.5c0-.825.45-1.5 1-1.5s1 .675 1 1.5c0 .824-.45 1.5-1 1.5s-1-.676-1-1.5Z"
          }
        ) }),
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "a", children: /* @__PURE__ */ jsx("path", { fill: "#fff", d: "M.645 0h50.71v64H.644z" }) }) })
      ]
    }
  );
}
async function getAllCategories() {
  return client("/categories");
}
async function getCategoryBySlug(slug) {
  return client(`/categories/${slug}`);
}
function Categories({ categories }) {
  return categories == null ? void 0 : categories.map((category) => /* @__PURE__ */ jsxs(
    Link,
    {
      to: category.title.toLowerCase(),
      className: "flex-1 flex-basis-0",
      children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl overflow-hidden mb-4", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: category.imgSrc,
            alt: category.alt || `${category.title}`,
            className: "w-full aspect-[3/2] md:aspect-[4/5] object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2 group-hover:underline", children: category.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-5 text-muted-foreground", children: category.description })
        ] })
      ]
    },
    category.title
  ));
}
async function clientLoader$6() {
  const features = [{
    Icon: Truck,
    title: "Entrega rápida",
    description: "Recibe tus productos en tiempo récord, directo a tu puerta, para que puedas disfrutar de ellos cuanto antes."
  }, {
    Icon: Return,
    title: "Satisfacción Garantizada",
    description: "Tu felicidad es nuestra prioridad. Si no estás 100% satisfecho, estamos aquí para ayudarte con cambios o devoluciones."
  }, {
    Icon: Ribbon,
    title: "Materiales de Alta Calidad",
    description: "Nos aseguramos de que todos nuestros productos estén hechos con materiales de la más alta calidad."
  }, {
    Icon: Idea,
    title: "Diseños Exclusivos",
    description: "Cada producto está diseñado pensando en los desarrolladores, con estilos únicos que no encontrarás en ningún otro lugar."
  }];
  try {
    const categories = await getAllCategories();
    return {
      features,
      categories
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      features,
      categories: null
    };
  }
}
const index$a = withComponentProps(function Home({
  loaderData
}) {
  const {
    features,
    categories
  } = loaderData;
  const error = !categories;
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("section", {
      className: "text-center bg-cover bg-no-repeat bg-center text-white bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url('/images/hero.jpg')]",
      children: /* @__PURE__ */ jsxs(Container, {
        className: "pt-32 pb-32 max-w-3xl",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-4xl leading-10 font-bold mb-4",
          children: "Nuevos productos disponibles"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-lg mb-8",
          children: ["Un pequeño lote de increíbles productos acaba de llegar.", /* @__PURE__ */ jsx("br", {}), "Agrega tus favoritos al carrito antes que se agoten."]
        }), /* @__PURE__ */ jsx(Button, {
          size: "xl",
          asChild: true,
          children: /* @__PURE__ */ jsx(Link, {
            to: "/polos",
            children: "Compra ahora"
          })
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "py-12 md:py-24",
      children: /* @__PURE__ */ jsxs(Container, {
        children: [/* @__PURE__ */ jsxs("div", {
          className: "max-w-3xl",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-2xl md:text-4xl font-bold mb-4",
            children: "Compra por categoría"
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-muted-foreground mb-10",
            children: ["Explora nuestra selección de productos especialmente diseñados para desarrolladores web. ", /* @__PURE__ */ jsx("br", {
              className: "hidden md:block"
            }), "Encuentra lo que buscas navegando por nuestras categorías de polos, tazas, stickers y más."]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex flex-col md:flex-row gap-8",
          children: error ? /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col justify-center items-center mx-auto",
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-accent-foreground text-2xl font-bold mb-4",
              children: "Hubo un error al cargar las categorías"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-accent-foreground text-2xl font-bold mb-4",
              children: /* @__PURE__ */ jsx(ServerCrash, {})
            })]
          }) : /* @__PURE__ */ jsx(Categories, {
            categories
          })
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "py-12 md:py-24 bg-muted text-center",
      children: /* @__PURE__ */ jsxs(Container, {
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-2xl font-bold mb-12",
          children: "Nuestra Promesa de Calidad"
        }), /* @__PURE__ */ jsx("div", {
          className: "flex flex-col gap-8 sm:grid sm:grid-cols-2 md:grid-cols-4",
          children: features.map(({
            Icon,
            title,
            description
          }) => /* @__PURE__ */ jsxs("div", {
            className: "",
            children: [/* @__PURE__ */ jsx(Icon, {
              className: "inline-block mb-6"
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-sm leading-5 font-medium mb-2",
              children: title
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm leading-5 text-muted-foreground",
              children: description
            })]
          }, title))
        })]
      })
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader: clientLoader$6,
  default: index$a
}, Symbol.toStringTag, { value: "Module" }));
async function getProductsByCategorySlug(categorySlug) {
  const category = await client(`/categories/${categorySlug}`);
  return client(`/products?categoryId=${category.id}`);
}
async function getProductById$1(id) {
  return client(`/products/${id}`);
}
function PriceFilter({
  minPrice,
  maxPrice,
  className
}) {
  return /* @__PURE__ */ jsxs(Form, { className: cn("flex flex-col gap-6", className), children: [
    /* @__PURE__ */ jsxs("fieldset", { children: [
      /* @__PURE__ */ jsx("legend", { className: "text-base font-medium mb-4", children: "Precio" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Min" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              name: "minPrice",
              defaultValue: minPrice,
              min: "0"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Max" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              name: "maxPrice",
              defaultValue: maxPrice,
              min: "0"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Button, { type: "submit", size: "xl", variant: "secondary", className: "w-full", children: "Filtrar Productos" })
  ] });
}
function ProductCard({ product }) {
  return /* @__PURE__ */ jsx(Link, { to: `/products/${product.id}`, className: "block", children: /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col overflow-hidden rounded-xl border border-separator group", children: [
    /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] bg-muted", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: product.imgSrc,
        alt: product.title,
        loading: "lazy",
        className: "h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex grow flex-col gap-2 p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-medium", children: product.title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: product.description }),
      /* @__PURE__ */ jsxs("p", { className: "mt-auto text-base font-medium", children: [
        "$",
        product.price
      ] })
    ] }),
    product.isOnSale && /* @__PURE__ */ jsx("span", { className: "absolute top-0 right-0 rounded-bl-xl bg-primary px-2 py-1 text-sm font-medium text-primary-foreground", children: "🚀 Oferta" })
  ] }) });
}
async function clientLoader$5({
  params,
  request
}) {
  const {
    category: categorySlug
  } = params;
  if (!isValidCategorySlug(categorySlug)) {
    return redirect("/not-found");
  }
  const url = new URL(request.url);
  const minPrice = url.searchParams.get("minPrice") || "";
  const maxPrice = url.searchParams.get("maxPrice") || "";
  try {
    const [category, products] = await Promise.all([getCategoryBySlug(categorySlug), getProductsByCategorySlug(categorySlug)]);
    const filterProductsByPrice = (products2, minPrice2, maxPrice2) => {
      const min = minPrice2 ? parseFloat(minPrice2) : 0;
      const max = maxPrice2 ? parseFloat(maxPrice2) : Infinity;
      return products2.filter((product) => product.price >= min && product.price <= max);
    };
    const filteredProducts = filterProductsByPrice(products, minPrice, maxPrice);
    return {
      category,
      products: filteredProducts,
      minPrice,
      maxPrice
    };
  } catch (e) {
    throw new Response("Error loading category: " + e, {
      status: 500
    });
  }
}
const index$9 = withComponentProps(function Category({
  loaderData
}) {
  const {
    category,
    products,
    minPrice,
    maxPrice
  } = loaderData;
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("section", {
      className: "py-10 border-b border-border",
      children: /* @__PURE__ */ jsx(Container, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "max-w-3xl",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-4xl font-bold mb-4",
            children: category.title
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: category.description
          })]
        })
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "py-10",
      children: /* @__PURE__ */ jsx(Container, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col lg:flex-row gap-8",
          children: [/* @__PURE__ */ jsx(PriceFilter, {
            minPrice,
            maxPrice,
            className: "w-full max-w-sm lg:max-w-xs"
          }), /* @__PURE__ */ jsx("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow",
            children: products.map((product) => /* @__PURE__ */ jsx(ProductCard, {
              product
            }, product.id))
          })]
        })
      })
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader: clientLoader$5,
  default: index$9
}, Symbol.toStringTag, { value: "Module" }));
const NotFound = withComponentProps(function NotFound2() {
  return /* @__PURE__ */ jsx(Container, {
    children: /* @__PURE__ */ jsx(Section, {
      className: "flex justify-center items-center",
      children: /* @__PURE__ */ jsxs("div", {
        className: "text-center",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-base font-semibold text-accent-foreground",
          children: "404"
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-4xl leading-9 font-bold tracking-tight text-foreground mt-4 sm:text-6xl sm:leading-none",
          children: "Página no encontrada"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-lg font-medium text-muted-foreground mt-6 sm:text-xl leading-none",
          children: "No pudimos encontrar la página que estás buscando."
        }), /* @__PURE__ */ jsx(Button, {
          className: "mt-10",
          asChild: true,
          size: "xl",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/",
            children: "Regresar al inicio"
          })
        })]
      })
    })
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NotFound
}, Symbol.toStringTag, { value: "Module" }));
async function clientLoader$4({
  params
}) {
  try {
    const product = await getProductById$1(parseInt(params.id));
    return {
      product
    };
  } catch {
    return {};
  }
}
const index$8 = withComponentProps(function Product({
  loaderData
}) {
  const {
    product
  } = loaderData;
  const navigation2 = useNavigation();
  const cartLoading = navigation2.state === "submitting";
  if (!product) {
    return /* @__PURE__ */ jsx(NotFound, {});
  }
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("section", {
      className: "py-12",
      children: /* @__PURE__ */ jsxs(Container, {
        className: "flex flex-col gap-8 md:flex-row md:items-start",
        children: [/* @__PURE__ */ jsx("div", {
          className: "bg-muted rounded-xl min-w-[min(100%,28rem)] self-center flex-grow max-w-xl md:min-w-fit md:self-start",
          children: /* @__PURE__ */ jsx("img", {
            src: product.imgSrc,
            alt: product.title,
            className: "w-full aspect-square object-contain"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-grow flex-basis-0",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-3xl leading-9 font-bold mb-3",
            children: product.title
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-3xl leading-9 mb-6",
            children: ["$", product.price]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm leading-5 text-muted-foreground mb-10",
            children: product.description
          }), /* @__PURE__ */ jsxs(Form, {
            method: "post",
            action: "/cart/add-item",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "redirectTo",
              value: `/products/${product.id}`
            }), /* @__PURE__ */ jsx(Button, {
              size: "xl",
              className: "w-full md:w-80",
              type: "submit",
              name: "productId",
              value: product.id,
              disabled: cartLoading,
              children: cartLoading ? "Agregando..." : "Agregar al Carrito"
            })]
          }), /* @__PURE__ */ jsx(Separator, {
            className: "my-6"
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-sm font-semibold text-accent-foreground mb-6",
              children: "Características"
            }), /* @__PURE__ */ jsx("ul", {
              className: "list-disc pl-4 text-sm leading-5 text-muted-foreground",
              children: product.features.map((feature, index2) => /* @__PURE__ */ jsx("li", {
                children: feature
              }, index2))
            })]
          })]
        })]
      })
    })
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader: clientLoader$4,
  default: index$8
}, Symbol.toStringTag, { value: "Module" }));
async function getCurrentCart(request2) {
  const cookieHeader = request2.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const cartSessionId = session.get("cartSessionId");
  if (!cartSessionId) return null;
  try {
    return serverClient("/cart", request2);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
async function alterQuantityCartItem(cartId, productId, quantity = 1, request2) {
  return serverClient("/cart/add-item-without-auth", request2, {
    body: { cartId, productId, quantity }
  });
}
async function deleteRemoteCartItem(cartId, itemId, request2) {
  return serverClient(
    `/cart/delete-item-without-auth/${cartId}/${itemId}`,
    request2,
    {
      method: "DELETE"
    }
  );
}
async function getProductById(id, request) {
  return serverClient(`/products/${id}`, request);
}
async function getCart(request) {
  try {
    const cart = await getCurrentCart(request);
    if (!cart) {
      return null;
    }
    return cart;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function addToCart(productId, quantity = 1, request) {
  const [cart, product] = await Promise.all([
    getCurrentCart(request),
    getProductById(productId, request)
  ]);
  try {
    const updatedCart = await alterQuantityCartItem(
      cart.id,
      product.id,
      quantity,
      request
    );
    if (!cart && updatedCart) {
      const session = await getSession();
      session.set("cartSessionId", updatedCart.id);
    }
    return updatedCart;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function removeFromCart(itemId, request) {
  try {
    const cart = await getCurrentCart(request);
    const updatedCart = await deleteRemoteCartItem(cart.id, itemId, request);
    return updatedCart;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function loader$3({
  request
}) {
  const cart = await getCart(request);
  return {
    cart
  };
}
const index$7 = withComponentProps(function Cart({
  loaderData
}) {
  var _a;
  const {
    cart
  } = loaderData;
  return /* @__PURE__ */ jsx(Section, {
    children: /* @__PURE__ */ jsxs(Container, {
      className: "max-w-xl",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl leading-8 font-bold text-center mb-12",
        children: "Carrito de compras"
      }), /* @__PURE__ */ jsxs("div", {
        className: "border-solid border rounded-xl flex flex-col",
        children: [(_a = cart == null ? void 0 : cart.items) == null ? void 0 : _a.map(({
          product,
          quantity,
          id
        }) => /* @__PURE__ */ jsxs("div", {
          className: "flex gap-7 p-6 border-b",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-20 rounded-xl bg-muted",
            children: /* @__PURE__ */ jsx("img", {
              src: product.imgSrc,
              alt: product.alt || product.title,
              className: "w-full aspect-[2/3] object-contain"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex grow flex-col justify-between",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex gap-4 justify-between items-center",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "text-sm",
                children: product.title
              }), /* @__PURE__ */ jsx(Form, {
                method: "post",
                action: "/cart/remove-item",
                children: /* @__PURE__ */ jsx(Button, {
                  size: "sm-icon",
                  variant: "outline",
                  name: "itemId",
                  value: id,
                  children: /* @__PURE__ */ jsx(Trash2, {})
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-2 md:flex-row md:justify-between md:items-center",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "text-sm font-medium",
                children: ["$", product.price.toFixed(2)]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex gap-4 items-center",
                children: [/* @__PURE__ */ jsxs(Form, {
                  method: "post",
                  action: "/cart/add-item",
                  children: [/* @__PURE__ */ jsx("input", {
                    type: "hidden",
                    name: "quantity",
                    value: "-1"
                  }), /* @__PURE__ */ jsx(Button, {
                    name: "productId",
                    value: product.id,
                    variant: "outline",
                    size: "sm-icon",
                    disabled: quantity === 1,
                    children: /* @__PURE__ */ jsx(Minus, {})
                  })]
                }), /* @__PURE__ */ jsx("span", {
                  className: "h-8 w-8 flex justify-center items-center border rounded-md py-2 px-4",
                  children: quantity
                }), /* @__PURE__ */ jsx(Form, {
                  method: "post",
                  action: "/cart/add-item",
                  children: /* @__PURE__ */ jsx(Button, {
                    variant: "outline",
                    size: "sm-icon",
                    name: "productId",
                    value: product.id,
                    children: /* @__PURE__ */ jsx(Plus, {})
                  })
                })]
              })]
            })]
          })]
        }, product.id)), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between p-6 text-base font-medium border-b",
          children: [/* @__PURE__ */ jsx("p", {
            children: "Total"
          }), /* @__PURE__ */ jsxs("p", {
            children: ["$", ((cart == null ? void 0 : cart.total) || 0).toFixed(2)]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "p-6",
          children: /* @__PURE__ */ jsx(Button, {
            size: "lg",
            className: "w-full",
            asChild: true,
            children: (cart == null ? void 0 : cart.items) && cart.items.length > 0 ? /* @__PURE__ */ jsx(Link, {
              to: "/checkout",
              children: "Continuar Compra"
            }) : /* @__PURE__ */ jsx(Link, {
              to: "/",
              children: "Ir a la tienda"
            })
          })
        })]
      })]
    })
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$7,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function action$4({
  request
}) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity")) || 1;
  const redirectTo = formData.get("redirectTo");
  await addToCart(productId, quantity, request);
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  return redirect(redirectTo || "/cart", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
async function action$3({
  request
}) {
  const formData = await request.formData();
  const itemId = Number(formData.get("itemId"));
  const redirectTo = formData.get("redirectTo");
  await removeFromCart(itemId, request);
  return redirect(redirectTo || "/cart");
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    return client("/users/me");
  } catch (error) {
    console.error("Error fetching current user:", error);
    removeToken();
    return null;
  }
}
async function createOrder(items, formData) {
  const shippingDetails = formData;
  const data = await client(`/orders`, {
    body: { items, shippingDetails }
  });
  return { orderId: data.id };
}
async function getOrdersByUser() {
  const orders = await client(`/orders`);
  return orders.map((order) => ({
    ...order,
    createdAt: new Date(order.createdAt)
  }));
}
const countryOptions = [{
  value: "AR",
  label: "Argentina"
}, {
  value: "BO",
  label: "Bolivia"
}, {
  value: "BR",
  label: "Brasil"
}, {
  value: "CL",
  label: "Chile"
}, {
  value: "CO",
  label: "Colombia"
}, {
  value: "CR",
  label: "Costa Rica"
}, {
  value: "CU",
  label: "Cuba"
}, {
  value: "DO",
  label: "República Dominicana"
}, {
  value: "EC",
  label: "Ecuador"
}, {
  value: "SV",
  label: "El Salvador"
}, {
  value: "GT",
  label: "Guatemala"
}, {
  value: "HT",
  label: "Haití"
}, {
  value: "HN",
  label: "Honduras"
}, {
  value: "MX",
  label: "México"
}, {
  value: "NI",
  label: "Nicaragua"
}, {
  value: "PA",
  label: "Panamá"
}, {
  value: "PY",
  label: "Paraguay"
}, {
  value: "PE",
  label: "Perú"
}, {
  value: "PR",
  label: "Puerto Rico"
}, {
  value: "UY",
  label: "Uruguay"
}, {
  value: "VE",
  label: "Venezuela"
}];
const CheckoutFormSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  company: z.string().optional(),
  address: z.string().min(1, "La dirección es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  country: z.string().min(1, "El país es requerido"),
  region: z.string().min(1, "La provincia/estado es requerido"),
  zip: z.string().min(1, "El código postal es requerido"),
  phone: z.string().min(1, "El teléfono es requerido")
});
async function clientAction$1({
  request
}) {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    user = null;
  }
  const formData = await request.formData();
  const shippingDetails = JSON.parse(formData.get("shippingDetailsJson"));
  const cartItems = JSON.parse(formData.get("cartItemsJson"));
  const items = cartItems.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    title: item.product.title,
    price: item.product.price,
    imgSrc: item.product.imgSrc
  }));
  const {
    orderId
  } = await createOrder(items, shippingDetails);
  if (user) deleteRemoteCart();
  else deleteLocalCart();
  return redirect(`/order-confirmation/${orderId}`);
}
async function loader$2(request) {
  const [user, cart] = await Promise.all([getCurrentUser(), getCart(request)]);
  if (!cart) {
    return redirect("/");
  }
  return user ? {
    user,
    cart
  } : {
    cart
  };
}
const index$6 = withComponentProps(function Checkout({
  loaderData
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const {
    user,
    cart
  } = loaderData;
  const navigation2 = useNavigation();
  const submit = useSubmit();
  const loading = navigation2.state === "submitting";
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
    }
  } = useForm({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      email: user == null ? void 0 : user.email,
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      city: "",
      country: "",
      region: "",
      zip: "",
      phone: ""
    },
    mode: "onTouched"
  });
  async function onSubmit(formData) {
    submit({
      shippingDetailsJson: JSON.stringify(formData),
      cartItemsJson: JSON.stringify(cart.items)
    }, {
      method: "POST"
    });
  }
  return /* @__PURE__ */ jsx(Section, {
    className: "bg-muted",
    children: /* @__PURE__ */ jsx(Container, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-12 max-w-2xl mx-auto lg:flex-row lg:max-w-none",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex-grow",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-lg font-medium mb-4",
            children: "Resumen de la orden"
          }), /* @__PURE__ */ jsxs("div", {
            className: "border border-border rounded-xl bg-background flex flex-col",
            children: [(_a = cart == null ? void 0 : cart.items) == null ? void 0 : _a.map(({
              product,
              quantity
            }) => /* @__PURE__ */ jsxs("div", {
              className: "flex gap-6 p-6 border-b border-border",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-20 rounded-xl bg-muted",
                children: /* @__PURE__ */ jsx("img", {
                  src: product.imgSrc,
                  alt: product.title,
                  className: "w-full aspect-square object-contain"
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col justify-between flex-grow",
                children: [/* @__PURE__ */ jsx("h3", {
                  className: "text-sm leading-5",
                  children: product.title
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex text-sm font-medium gap-4 items-center self-end",
                  children: [/* @__PURE__ */ jsx("p", {
                    children: quantity
                  }), /* @__PURE__ */ jsx(X, {
                    className: "w-4 h-4"
                  }), /* @__PURE__ */ jsxs("p", {
                    children: ["$", product.price.toFixed(2)]
                  })]
                })]
              })]
            }, product.id)), /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between p-6 text-base font-medium",
              children: [/* @__PURE__ */ jsx("p", {
                children: "Total"
              }), /* @__PURE__ */ jsxs("p", {
                children: ["$", ((cart == null ? void 0 : cart.total) || 0).toFixed(2)]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("form", {
          className: "flex-grow lg:max-w-4xl lg:order-first",
          onSubmit: handleSubmit(onSubmit),
          children: [/* @__PURE__ */ jsxs("fieldset", {
            children: [/* @__PURE__ */ jsx("legend", {
              className: "text-xl font-medium mb-6",
              children: "Información de contacto"
            }), /* @__PURE__ */ jsx(InputField, {
              label: "Correo electrónico",
              type: "email",
              autoComplete: "email",
              defaultValue: user == null ? void 0 : user.email,
              readOnly: Boolean(user),
              error: (_b = errors.email) == null ? void 0 : _b.message,
              ...register("email")
            })]
          }), /* @__PURE__ */ jsx(Separator, {
            className: "my-6"
          }), /* @__PURE__ */ jsxs("fieldset", {
            children: [/* @__PURE__ */ jsx("legend", {
              className: "text-xl font-medium mb-6",
              children: "Información de envío"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-6",
              children: [/* @__PURE__ */ jsx(InputField, {
                label: "Nombre",
                autoComplete: "given-name",
                error: (_c = errors.firstName) == null ? void 0 : _c.message,
                ...register("firstName")
              }), /* @__PURE__ */ jsx(InputField, {
                label: "Apellido",
                autoComplete: "family-name",
                error: (_d = errors.lastName) == null ? void 0 : _d.message,
                ...register("lastName")
              }), /* @__PURE__ */ jsx(InputField, {
                label: "Compañia",
                autoComplete: "organization",
                error: (_e = errors.company) == null ? void 0 : _e.message,
                ...register("company")
              }), ((_f = errors.company) == null ? void 0 : _f.message) && /* @__PURE__ */ jsx("p", {
                children: (_g = errors.company) == null ? void 0 : _g.message
              }), /* @__PURE__ */ jsx(InputField, {
                label: "Dirección",
                autoComplete: "street-address",
                error: (_h = errors.address) == null ? void 0 : _h.message,
                ...register("address")
              }), /* @__PURE__ */ jsx(InputField, {
                label: "Ciudad",
                autoComplete: "address-level2",
                error: (_i = errors.city) == null ? void 0 : _i.message,
                ...register("city")
              }), /* @__PURE__ */ jsx(SelectField, {
                label: "País",
                options: countryOptions,
                placeholder: "Seleccionar país",
                error: (_j = errors.country) == null ? void 0 : _j.message,
                ...register("country")
              }), /* @__PURE__ */ jsx(InputField, {
                label: "Provincia/Estado",
                autoComplete: "address-level1",
                error: (_k = errors.region) == null ? void 0 : _k.message,
                ...register("region")
              }), /* @__PURE__ */ jsx(InputField, {
                label: "Código Postal",
                autoComplete: "postal-code",
                error: (_l = errors.zip) == null ? void 0 : _l.message,
                ...register("zip")
              }), /* @__PURE__ */ jsx(InputField, {
                label: "Teléfono",
                autoComplete: "tel",
                error: (_m = errors.phone) == null ? void 0 : _m.message,
                ...register("phone")
              })]
            })]
          }), /* @__PURE__ */ jsx(Button, {
            size: "xl",
            className: "w-full mt-6",
            disabled: !isValid,
            children: loading ? "Procesando..." : "Confirmar Orden"
          })]
        })]
      })
    })
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CheckoutFormSchema,
  clientAction: clientAction$1,
  default: index$6,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function clientLoader$3({
  params
}) {
  const orderId = params.orderId;
  return {
    orderId
  };
}
const index$5 = withComponentProps(function OrderConfirmation({
  loaderData
}) {
  const {
    orderId
  } = loaderData;
  return /* @__PURE__ */ jsx("section", {
    className: "pt-12 pb-12 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16",
    children: /* @__PURE__ */ jsxs(Container, {
      children: [/* @__PURE__ */ jsx("h1", {
        className: "font-medium text-accent-foreground mb-2",
        children: "¡Muchas gracias por tu compra!"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-2xl font-bold leading-9 mb-2",
        children: "Tu orden está en camino"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-muted-foreground mb-12",
        children: "Llegaremos a la puerta de tu domicilio lo antes posible"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-sm font-medium mb-2",
        children: "Código de seguimiento"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-sm font-medium text-accent-foreground",
        children: orderId
      })]
    })
  });
});
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader: clientLoader$3,
  default: index$5
}, Symbol.toStringTag, { value: "Module" }));
const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});
async function action$2({
  request
}) {
  const session = await getSession();
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const {
      token
    } = await login(request, email, password);
    session.set("token", token);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message
      };
    }
    return {
      error: "Error desconocido"
    };
  }
}
async function loader$1({
  request
}) {
  await redirectIfAuthenticated(request);
  return null;
}
const index$4 = withComponentProps(function Login({
  actionData
}) {
  var _a, _b;
  const submit = useSubmit();
  const navigation2 = useNavigation();
  const data = actionData;
  const isSubmitting = navigation2.state === "submitting";
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
    }
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onTouched"
  });
  async function onSubmit(data2) {
    submit(data2, {
      method: "post"
    });
  }
  return /* @__PURE__ */ jsx(Section, {
    children: /* @__PURE__ */ jsxs(Container, {
      className: "max-w-sm",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-2xl leading-7 font-bold text-center mb-10",
        children: "Inicia sesión en tu cuenta"
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit(onSubmit),
        className: "flex flex-col gap-6",
        children: [/* @__PURE__ */ jsx(InputField, {
          label: "Correo electrónico",
          type: "email",
          autoComplete: "email",
          error: (_a = errors.email) == null ? void 0 : _a.message,
          ...register("email")
        }), /* @__PURE__ */ jsx(InputField, {
          label: "Contraseña",
          type: "password",
          autoComplete: "current-password",
          error: (_b = errors.password) == null ? void 0 : _b.message,
          ...register("password")
        }), /* @__PURE__ */ jsx(Button, {
          size: "lg",
          className: "w-full",
          disabled: !isValid || isSubmitting,
          children: isSubmitting ? "Iniciando..." : "Iniciar sesión"
        }), (data == null ? void 0 : data.error) && /* @__PURE__ */ jsx("p", {
          className: "text-red-500 text-sm text-center mt-2",
          children: data.error
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex justify-center gap-2 mt-10 text-sm leading-6",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-muted-foreground",
          children: "¿Aún no tienes cuenta?"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/signup",
          className: "text-accent-foreground hover:underline",
          children: "Crea una cuenta"
        })]
      })]
    })
  });
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: index$4,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function findEmail(email) {
  const body = await client("/users/findEmail", {
    body: { email }
  });
  return body;
}
async function updateUser(updatedUser) {
  const body = await client("/users/me", {
    body: { updatedUser },
    method: "PATCH"
  });
  setToken(body.token);
  return body.user;
}
const debouncedFindEmail = debounceAsync(findEmail, 300);
const SignupSchema = z.object({
  email: z.string().email("Correo electrónico inválido").refine(async (email) => {
    if (email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return await debouncedFindEmail(email);
    } else {
      return false;
    }
  }, "El correo no esta disponible"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});
async function action$1({
  request
}) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const session = await getSession();
  try {
    const {
      token
    } = await signup(request, email, password);
    session.set("token", token);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message
      };
    }
    return {
      error: "Error desconocido"
    };
  }
}
async function loader({
  request
}) {
  redirectIfAuthenticated(request);
}
const index$3 = withComponentProps(function Signup({
  actionData
}) {
  var _a, _b;
  const submit = useSubmit();
  const navigation2 = useNavigation();
  const data = actionData;
  const isSubmitting = navigation2.state === "submitting";
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
    }
  } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onTouched"
  });
  async function onSubmit(data2) {
    submit(data2, {
      method: "post"
    });
  }
  return /* @__PURE__ */ jsx(Section, {
    children: /* @__PURE__ */ jsxs(Container, {
      className: "max-w-sm mx-auto",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-2xl font-bold text-center mb-10",
        children: "Crea una cuenta"
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit(onSubmit),
        className: "flex flex-col gap-6",
        children: [/* @__PURE__ */ jsx(InputField, {
          label: "Correo electrónico",
          type: "email",
          required: true,
          autoComplete: "email",
          error: (_a = errors.email) == null ? void 0 : _a.message,
          ...register("email")
        }), /* @__PURE__ */ jsx(InputField, {
          label: "Contraseña",
          type: "password",
          required: true,
          autoComplete: "current-password",
          error: (_b = errors.password) == null ? void 0 : _b.message,
          ...register("password")
        }), /* @__PURE__ */ jsx(Button, {
          size: "lg",
          className: "w-full",
          disabled: !isValid || isSubmitting,
          children: isSubmitting ? "Creando..." : "Crear cuenta"
        }), (data == null ? void 0 : data.error) && /* @__PURE__ */ jsx("p", {
          className: "text-red-500 text-sm text-center mt-2",
          children: data.error
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex justify-center gap-2 mt-10 text-sm",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-muted-foreground",
          children: "¿Ya tienes una cuenta?"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/login",
          className: "text-accent-foreground hover:underline",
          children: "Inicia sesión"
        })]
      })]
    })
  });
});
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: index$3,
  loader
}, Symbol.toStringTag, { value: "Module" }));
async function action({
  request
}) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
async function clientLoader$2() {
  const user = await getCurrentUser();
  if (!user) throw redirect("/login");
}
const index$2 = withComponentProps(function Account() {
  return /* @__PURE__ */ jsx(Section, {
    children: /* @__PURE__ */ jsxs(Container, {
      className: "width-3xl",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "width-3xl mb-10",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-4xl leading-9 font-bold mb-4",
          children: "Mi cuenta"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-muted-foreground",
          children: "Actualiza tu perfil y revisa tus historial pedidos."
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "border-b border-border mb-6",
        children: /* @__PURE__ */ jsxs("nav", {
          className: "flex gap-4",
          children: [/* @__PURE__ */ jsx(NavLink, {
            to: "/account/profile",
            className: ({
              isActive
            }) => cn("pb-2 pl-1 pr-1 text-muted-foreground", isActive && "border-b-2 border-primary font-medium text-foreground"),
            children: "Perfil"
          }), /* @__PURE__ */ jsx(NavLink, {
            to: "/account/orders",
            className: ({
              isActive
            }) => cn("pb-2 pl-1 pr-1 text-muted-foreground", isActive && "border-b-2 border-primary font-medium text-foreground"),
            children: "Historial de Pedidos"
          })]
        })
      }), /* @__PURE__ */ jsx(Outlet, {})]
    })
  });
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader: clientLoader$2,
  default: index$2
}, Symbol.toStringTag, { value: "Module" }));
async function clientLoader$1() {
  const user = await getCurrentUser();
  if (!user) throw redirect("/login");
  return {
    user
  };
}
async function clientAction({
  request
}) {
  const data = await request.formData();
  try {
    await updateUser({
      name: data.get("name"),
      ...data.get("newPassword") ? {
        password: data.get("newPassword")
      } : {}
    });
    return {
      ok: true
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false
    };
  }
}
const index$1 = withComponentProps(function Profile({
  loaderData
}) {
  const {
    user
  } = loaderData;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const handleSubmit = (event) => {
    event.preventDefault();
    fetcher.submit(event.target, {
      method: "post"
    });
    event.target.elements.namedItem("newPassword").value = "";
  };
  return /* @__PURE__ */ jsxs("form", {
    className: "max-w-md flex flex-col gap-6",
    onSubmit: handleSubmit,
    children: [/* @__PURE__ */ jsx(InputField, {
      label: "Correo electrónico",
      name: "email",
      type: "email",
      value: user.email,
      disabled: true
    }), /* @__PURE__ */ jsx(InputField, {
      label: "Nombre",
      name: "name",
      defaultValue: (user == null ? void 0 : user.name) || "",
      minLength: 1,
      disabled: isSubmitting
    }), /* @__PURE__ */ jsx(InputField, {
      label: "Nueva contraseña",
      name: "newPassword",
      type: "password",
      minLength: 6,
      disabled: isSubmitting
    }), /* @__PURE__ */ jsx(Button, {
      type: "submit",
      size: "xl",
      className: "self-stretch",
      disabled: isSubmitting,
      children: isSubmitting ? "Guardando..." : "Guardar cambios"
    })]
  });
});
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientAction,
  clientLoader: clientLoader$1,
  default: index$1
}, Symbol.toStringTag, { value: "Module" }));
async function clientLoader() {
  try {
    const orders = await getOrdersByUser();
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return {
      orders
    };
  } catch {
    return {};
  }
}
const index = withComponentProps(function Orders({
  loaderData
}) {
  const {
    orders
  } = loaderData;
  return /* @__PURE__ */ jsx("div", {
    children: orders.length > 0 ? /* @__PURE__ */ jsx("div", {
      className: "flex flex-col gap-4",
      children: orders.map((order) => /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("div", {
          className: "rounded-lg bg-muted py-4 px-6",
          children: /* @__PURE__ */ jsxs("dl", {
            className: "flex flex-col gap-4 w-full sm:flex-row",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex-shrink-0",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-accent-foreground",
                children: "Fecha del pedido"
              }), /* @__PURE__ */ jsx("dd", {
                className: "mt-1",
                children: /* @__PURE__ */ jsx("time", {
                  dateTime: order.createdAt.toISOString(),
                  children: order.createdAt.toLocaleDateString()
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex-shrink-0 flex-grow",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-accent-foreground",
                children: "Número de orden"
              }), /* @__PURE__ */ jsx("dd", {
                className: "mt-1",
                children: order.id
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex-shrink-0",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-accent-foreground",
                children: "Total"
              }), /* @__PURE__ */ jsx("dd", {
                className: "mt-1 font-medium text-foreground",
                children: order.totalAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD"
                })
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("table", {
          className: "w-full mt-4 text-sm text-muted-foreground",
          children: [/* @__PURE__ */ jsx("caption", {
            className: "sr-only",
            children: "Productos"
          }), /* @__PURE__ */ jsx("thead", {
            className: "not-sr-only text-left",
            children: /* @__PURE__ */ jsxs("tr", {
              children: [/* @__PURE__ */ jsx("th", {
                scope: "col",
                className: "py-3 pl-16",
                children: "Producto"
              }), /* @__PURE__ */ jsx("th", {
                scope: "col",
                className: "py-3 pr-8 text-center hidden sm:table-cell sm:w-1/5",
                children: "Precio"
              }), /* @__PURE__ */ jsx("th", {
                scope: "col",
                className: "py-3 pr-8 text-center hidden sm:table-cell sm:w-1/5",
                children: "Cantidad"
              }), /* @__PURE__ */ jsx("th", {
                scope: "col",
                className: "py-3 pr-8 text-center",
                children: "Total"
              })]
            })
          }), /* @__PURE__ */ jsx("tbody", {
            className: "border-t border-b border-border",
            children: order.items.map((item) => /* @__PURE__ */ jsxs("tr", {
              children: [/* @__PURE__ */ jsx("td", {
                className: "py-6 pl-6",
                children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-16 rounded-xl bg-muted",
                    children: /* @__PURE__ */ jsx("img", {
                      src: item.imgSrc,
                      alt: item.title
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "font-medium text-foreground",
                      children: item.title
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "mt-1 sm:hidden",
                      children: [item.quantity, " × $", item.price.toFixed(2)]
                    })]
                  })]
                })
              }), /* @__PURE__ */ jsxs("td", {
                className: "py-6 pr-8 text-center hidden sm:table-cell",
                children: ["$", item.price.toFixed(2)]
              }), /* @__PURE__ */ jsx("td", {
                className: "py-6 pr-8 text-center hidden sm:table-cell",
                children: item.quantity
              }), /* @__PURE__ */ jsxs("td", {
                className: "py-6 pr-8 whitespace-nowrap text-center font-medium text-foreground",
                children: ["$", (item.price * item.quantity).toFixed(2)]
              })]
            }, item.productId))
          })]
        })]
      }, order.id))
    }) : /* @__PURE__ */ jsx("p", {
      className: "text-muted-foreground",
      children: "No hay pedidos realizados"
    })
  });
});
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader,
  default: index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BpiQhs_r.js", "imports": ["/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-BIC2x-iH.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-BJW5lr5F.js", "imports": ["/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-BIC2x-iH.js", "/assets/with-props-BBqpwT5E.js"], "css": ["/assets/root-Dfh8mSFs.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/root/index": { "id": "routes/root/index", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": true, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-EwhDvKk_.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/utils-CNtvmiS0.js", "/assets/createLucideIcon-BSoWJu4V.js", "/assets/index-D-b6Fp5p.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home/index": { "id": "routes/home/index", "parentId": "routes/root/index", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-CevTZUKe.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/category.service-SbEtRakf.js", "/assets/createLucideIcon-BSoWJu4V.js", "/assets/utils-CNtvmiS0.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/category/index": { "id": "routes/category/index", "parentId": "routes/root/index", "path": "/:category", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-C1CiKc1u.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/category.service-SbEtRakf.js", "/assets/product.service-Cwpiyzog.js", "/assets/utils-CNtvmiS0.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/product/index": { "id": "routes/product/index", "parentId": "routes/root/index", "path": "/products/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-ChUgdiq1.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/product.service-Cwpiyzog.js", "/assets/index-DpJaMrCg.js", "/assets/utils-CNtvmiS0.js", "/assets/index-BIC2x-iH.js", "/assets/index-D-b6Fp5p.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/cart/index": { "id": "routes/cart/index", "parentId": "routes/root/index", "path": "/cart", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-_0CEWJDq.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/index-D-b6Fp5p.js", "/assets/createLucideIcon-BSoWJu4V.js", "/assets/utils-CNtvmiS0.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/cart/add-item/index": { "id": "routes/cart/add-item/index", "parentId": "routes/root/index", "path": "/cart/add-item", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/cart/remove-item/index": { "id": "routes/cart/remove-item/index", "parentId": "routes/root/index", "path": "/cart/remove-item", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-DP2rzg_V.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/checkout/index": { "id": "routes/checkout/index", "parentId": "routes/root/index", "path": "/checkout", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": true, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-DE1tV8U0.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-DudFI82r.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/index-D-b6Fp5p.js", "/assets/auth.service-2jA2gaO1.js", "/assets/utils-CNtvmiS0.js", "/assets/order.service-fFja0B08.js", "/assets/createLucideIcon-BSoWJu4V.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/order-confirmation/index": { "id": "routes/order-confirmation/index", "parentId": "routes/root/index", "path": "/order-confirmation/:orderId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-CK6Nq66Y.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/utils-CNtvmiS0.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login/index": { "id": "routes/login/index", "parentId": "routes/root/index", "path": "/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-DCFc_ih-.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-DudFI82r.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/index-D-b6Fp5p.js", "/assets/utils-CNtvmiS0.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/signup/index": { "id": "routes/signup/index", "parentId": "routes/root/index", "path": "/signup", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-OiIps55X.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-DudFI82r.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/utils-CNtvmiS0.js", "/assets/index-D-b6Fp5p.js", "/assets/user.service-DZA7gS4U.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/logout/index": { "id": "routes/logout/index", "parentId": "routes/root/index", "path": "/logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-K6Dvbx-E.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/account/index": { "id": "routes/account/index", "parentId": "routes/root/index", "path": "account", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-Cn4Ft41K.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/utils-CNtvmiS0.js", "/assets/index-D-b6Fp5p.js", "/assets/auth.service-2jA2gaO1.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/account/profile/index": { "id": "routes/account/profile/index", "parentId": "routes/account/index", "path": "profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": true, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-DIcs-c-T.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/auth.service-2jA2gaO1.js", "/assets/user.service-DZA7gS4U.js", "/assets/utils-CNtvmiS0.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/account/orders/index": { "id": "routes/account/orders/index", "parentId": "routes/account/index", "path": "orders", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-DV4gNNw0.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/order.service-fFja0B08.js", "/assets/utils-CNtvmiS0.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/not-found/index": { "id": "routes/not-found/index", "parentId": "routes/root/index", "path": "/not-found", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-DpJaMrCg.js", "imports": ["/assets/with-props-BBqpwT5E.js", "/assets/chunk-LSOULM7L-OaPJ-Plh.js", "/assets/index-Dbs4k1je.js", "/assets/index-C65Y4aBu.js", "/assets/index-D-b6Fp5p.js", "/assets/utils-CNtvmiS0.js", "/assets/index-BIC2x-iH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-9b675405.js", "version": "9b675405", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/root/index": {
    id: "routes/root/index",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/home/index": {
    id: "routes/home/index",
    parentId: "routes/root/index",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/category/index": {
    id: "routes/category/index",
    parentId: "routes/root/index",
    path: "/:category",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/product/index": {
    id: "routes/product/index",
    parentId: "routes/root/index",
    path: "/products/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/cart/index": {
    id: "routes/cart/index",
    parentId: "routes/root/index",
    path: "/cart",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/cart/add-item/index": {
    id: "routes/cart/add-item/index",
    parentId: "routes/root/index",
    path: "/cart/add-item",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/cart/remove-item/index": {
    id: "routes/cart/remove-item/index",
    parentId: "routes/root/index",
    path: "/cart/remove-item",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/checkout/index": {
    id: "routes/checkout/index",
    parentId: "routes/root/index",
    path: "/checkout",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/order-confirmation/index": {
    id: "routes/order-confirmation/index",
    parentId: "routes/root/index",
    path: "/order-confirmation/:orderId",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/login/index": {
    id: "routes/login/index",
    parentId: "routes/root/index",
    path: "/login",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/signup/index": {
    id: "routes/signup/index",
    parentId: "routes/root/index",
    path: "/signup",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/logout/index": {
    id: "routes/logout/index",
    parentId: "routes/root/index",
    path: "/logout",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/account/index": {
    id: "routes/account/index",
    parentId: "routes/root/index",
    path: "account",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/account/profile/index": {
    id: "routes/account/profile/index",
    parentId: "routes/account/index",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/account/orders/index": {
    id: "routes/account/orders/index",
    parentId: "routes/account/index",
    path: "orders",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/not-found/index": {
    id: "routes/not-found/index",
    parentId: "routes/root/index",
    path: "/not-found",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
