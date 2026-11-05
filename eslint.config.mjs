import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const noCommentsPlugin = {
  rules: {
    "no-comments": {
      meta: {
        type: "layout",
        docs: {
          description: "Disallow all comments and remove them with --fix",
        },
        fixable: "code",
        schema: [],
      },
      create(context) {
        const sourceCode = context.sourceCode;
        return {
          Program() {
            const comments = sourceCode.getAllComments();
            for (const comment of comments) {
              context.report({
                loc: comment.loc,
                message: "Comments are not allowed.",
                fix(fixer) {
                  const text = sourceCode.getText();
                  const [start, end] = comment.range;
                  const before = text.slice(0, start);
                  const after = text.slice(end);
                  const jsxMatchBefore = before.match(/\{\s*$/);
                  const jsxMatchAfter = after.match(/^\s*\}/);

                  if (jsxMatchBefore && jsxMatchAfter) {
                    return fixer.removeRange([
                      start - jsxMatchBefore[0].length,
                      end + jsxMatchAfter[0].length,
                    ]);
                  }

                  return fixer.removeRange([start, end]);
                },
              });
            }
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      custom: noCommentsPlugin,
    },
    rules: {
      "custom/no-comments": "error",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
