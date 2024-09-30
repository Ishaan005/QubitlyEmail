"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var local_1 = require("next/font/local");
require("./globals.css");
var react_hot_toast_1 = require("react-hot-toast");
var nextjs_1 = require("@clerk/nextjs");
var Header_1 = require("@/components/Header");
require("prismjs/themes/prism.css");
var react_1 = require("@vercel/analytics/react");
var next_1 = require("@vercel/speed-insights/next");
var geistSans = local_1["default"]({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900"
});
var geistMono = local_1["default"]({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900"
});
exports.metadata = {
    title: "AI Email HTML Generator | Qubitly Email",
    description: "Create stunning emails effortlessly with Qubitly's AI Email HTML Generator. Perfect for marketers and business owners."
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement(nextjs_1.ClerkProvider, null,
        React.createElement("html", { lang: "en", className: geistSans.variable + " " + geistMono.variable },
            React.createElement("body", null,
                React.createElement(Header_1.Header, { className: "h-16" }),
                React.createElement("main", null, children),
                React.createElement(react_hot_toast_1.Toaster, null),
                React.createElement(react_1.Analytics, null),
                React.createElement(next_1.SpeedInsights, null)))));
}
exports["default"] = RootLayout;
