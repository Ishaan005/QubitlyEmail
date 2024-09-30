"use client";
"use strict";
exports.__esModule = true;
exports.Header = void 0;
var react_1 = require("react");
var link_1 = require("next/link");
var nextjs_1 = require("@clerk/nextjs");
function Header(_a) {
    var className = _a.className;
    var isSignedIn = nextjs_1.useAuth().isSignedIn;
    return (react_1["default"].createElement("header", { className: "flex justify-between items-center p-4 bg-background border-b " + className },
        react_1["default"].createElement("div", { className: "flex items-center" },
            react_1["default"].createElement(link_1["default"], { href: isSignedIn ? "/dashboard" : "/", className: "text-2xl font-bold" }, "Qubitly")),
        react_1["default"].createElement("nav", { className: "flex items-center space-x-4" },
            react_1["default"].createElement(link_1["default"], { href: "/blog", className: "text-foreground hover:text-primary" }, "Blog"),
            isSignedIn ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(link_1["default"], { href: "/dashboard", className: "text-foreground hover:text-primary" }, "Dashboard"),
                react_1["default"].createElement(link_1["default"], { href: "/editor/new", className: "text-foreground hover:text-primary" }, "Editor"),
                react_1["default"].createElement(link_1["default"], { href: "/settings", className: "text-foreground hover:text-primary" }, "Settings"),
                react_1["default"].createElement(link_1["default"], { href: "/feedback", className: "text-foreground hover:text-primary" }, "Support"),
                react_1["default"].createElement(nextjs_1.UserButton, { afterSignOutUrl: "/" }))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(link_1["default"], { href: "/sign-in", className: "text-foreground hover:text-primary" }, "Sign In"),
                react_1["default"].createElement(link_1["default"], { href: "/sign-up", className: "text-foreground hover:text-primary" }, "Sign Up"))))));
}
exports.Header = Header;
