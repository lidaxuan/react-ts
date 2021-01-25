/**
 * @file eslint
 * @author svon.me@gmail.com
 */

module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "commonjs": true
  },
  "globals": {
    "async_com": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "arrowFunctions": true,
      "classes": true,
      "modules": true,
      "defaultParams": true.valueOf,
      "jsx": true
    },
    "sourceType": "module"
  },
  "parser": '@typescript-eslint/parser',
  "plugins": ['@typescript-eslint'],
  "extends": [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "settings": {
    // 根据 react 版本进行代码规范
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  "rules": {
    "jsx-quotes": ["error", "prefer-double"],
    "no-console": "off",
    "semi": [
      "error",
      "always"
    ],
    "indent": [
      "error",
      2
    ],
    "space-infix-ops": [
      "error"
    ],
    "multiline-ternary": [
      "error",
      "never"
    ],
    "no-multi-assign": [
      "error"
    ],
    "no-duplicate-imports": [
      "error"
    ],
    "no-eval": [
      "error"
    ],
    "eqeqeq": [
      "error",
      "smart"
    ],
    "no-obj-calls": [
      "error"
    ],
    "no-empty": [
      "error"
    ],
    "no-duplicate-case": [
      "error"
    ],
    "no-dupe-args": [
      "error"
    ],
    "semi-style": [
      "error",
      "last"
    ],
    "no-delete-var": [
      "error"
    ],
    "no-shadow": [
      "error"
    ],
    "no-cond-assign": [
      "error",
      "always"
    ],
    "comma-dangle": [
      "error",
      "only-multiline"
    ],
    "no-unused-vars": ["off"],
    "@typescript-eslint/no-unused-vars": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-var-requires": ["off"],
    "@typescript-eslint/no-empty-interface": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/explicit-member-accessibility": ['error', { accessibility: 'no-public' }],
  }
};