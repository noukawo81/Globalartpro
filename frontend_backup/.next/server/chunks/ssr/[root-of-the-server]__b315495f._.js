module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[project]/globalartpro/frontend/pages/gapstudio.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GapStudio
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function GapStudio() {
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("create");
    const [prompt, setPrompt] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("image");
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    async function handleGenerate(e) {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        // Appel à ton backend Node.js/Express
        const res = await fetch("https://ton-backend.com/api/gapstudio/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
                type
            })
        });
        const data = await res.json();
        setResult(data);
        setLoading(false);
    }
    async function handleSave() {
        const user = "Visiteur"; // Remplace par l'utilisateur connecté si besoin
        let content = type === "image" ? result.imageUrl : type === "musique" ? result.audioUrl : result.text;
        await fetch("https://ton-backend.com/api/gapstudio/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user,
                type,
                prompt,
                content
            })
        });
        alert("Création sauvegardée !");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "max-w-2xl mx-auto p-6 bg-white bg-opacity-10 rounded-xl mt-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-4 text-yellow-400",
                children: "🎨 GAP Studio IA"
            }, void 0, false, {
                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: `flex-1 py-2 rounded-t-lg font-bold ${tab === "create" ? "bg-yellow-400 text-purple-900" : "bg-white text-purple-700 bg-opacity-80"}`,
                        onClick: ()=>setTab("create"),
                        children: "Créer"
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: `flex-1 py-2 rounded-t-lg font-bold ${tab === "explore" ? "bg-yellow-400 text-purple-900" : "bg-white text-purple-700 bg-opacity-80"}`,
                        onClick: ()=>setTab("explore"),
                        children: "Explorer"
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: `flex-1 py-2 rounded-t-lg font-bold ${tab === "learn" ? "bg-yellow-400 text-purple-900" : "bg-white text-purple-700 bg-opacity-80"}`,
                        onClick: ()=>setTab("learn"),
                        children: "Apprendre"
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            tab === "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleGenerate,
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        className: "w-full p-2 mb-3 rounded",
                        placeholder: "Décris ton idée (ex: Un masque africain futuriste en violet et or)",
                        value: prompt,
                        onChange: (e)=>setPrompt(e.target.value),
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        className: "w-full p-2 mb-3 rounded",
                        value: type,
                        onChange: (e)=>setType(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "image",
                                children: "Image"
                            }, void 0, false, {
                                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "musique",
                                children: "Musique"
                            }, void 0, false, {
                                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "texte",
                                children: "Légende/Poème"
                            }, void 0, false, {
                                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "w-full py-2 bg-yellow-400 text-purple-900 font-bold rounded",
                        children: "Générer"
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                lineNumber: 46,
                columnNumber: 9
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-center text-yellow-300",
                children: "Génération en cours..."
            }, void 0, false, {
                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                lineNumber: 63,
                columnNumber: 19
            }, this),
            result && tab === "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "my-4 text-center",
                children: [
                    type === "image" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                        src: result.imageUrl,
                        alt: "Création IA",
                        className: "mx-auto rounded-lg mb-2",
                        style: {
                            maxWidth: 400
                        }
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 67,
                        columnNumber: 32
                    }, this),
                    type === "musique" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("audio", {
                        controls: true,
                        src: result.audioUrl,
                        className: "mx-auto mb-2"
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 68,
                        columnNumber: 34
                    }, this),
                    type === "texte" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("blockquote", {
                        className: "bg-yellow-100 bg-opacity-10 p-4 rounded text-yellow-300",
                        children: result.text
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 69,
                        columnNumber: 32
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: handleSave,
                        className: "mt-3 py-2 px-4 bg-purple-700 text-yellow-200 rounded",
                        children: "Sauvegarder"
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                lineNumber: 66,
                columnNumber: 9
            }, this),
            tab === "explore" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "mb-2",
                    children: 'Pose une question culturelle à GAP Studio (ex: "Quelle est la signification du masque Bamiléké ?")'
                }, void 0, false, {
                    fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                lineNumber: 75,
                columnNumber: 9
            }, this),
            tab === "learn" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                        className: "text-left max-w-md mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                children: "🖼️ Tutoriel : Générer ton premier NFT avec l’IA"
                            }, void 0, false, {
                                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                children: "🎶 Composer une musique inspirée d’une culture"
                            }, void 0, false, {
                                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                children: "🤝 Co-créer une œuvre avec GAP Studio"
                            }, void 0, false, {
                                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                children: "🎲 Quiz et défis créatifs"
                            }, void 0, false, {
                                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-yellow-400 mt-4",
                        children: "(Fonctionnalités à venir : masterclass, ateliers live, etc.)"
                    }, void 0, false, {
                        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
                lineNumber: 82,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/globalartpro/frontend/pages/gapstudio.js",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b315495f._.js.map