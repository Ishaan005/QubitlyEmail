"use strict";
exports.__esModule = true;
var react_1 = require("react");
function BlogPage() {
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700" },
        react_1["default"].createElement("div", { className: "container mx-auto px-4 py-8" },
            react_1["default"].createElement("h1", { className: "text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100" }, "Blog Posts"),
            react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [1, 2, 3, 4, 5, 6].map(function (post) { return (react_1["default"].createElement("div", { key: post, className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" },
                react_1["default"].createElement("h2", { className: "text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100" },
                    "Blog Post ",
                    post),
                react_1["default"].createElement("p", { className: "text-gray-600 dark:text-gray-300 mb-4" }, "This is a sample blog post description. Click to read more."),
                react_1["default"].createElement("a", { href: "#", className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" }, "Read more"))); })))));
}
exports["default"] = BlogPage;
