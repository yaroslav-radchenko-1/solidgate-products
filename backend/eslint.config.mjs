import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginSonarjs from 'eslint-plugin-sonarjs';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      'eslint.config.mjs',
      'dist/**',
      'node_modules/**',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,

  {
    plugins: {
      unicorn: eslintPluginUnicorn,
      promise: eslintPluginPromise,
      sonarjs: eslintPluginSonarjs,
      prettier: eslintPluginPrettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

    // ======================================================
  // General rules for all code
  // ======================================================
  {
    rules: {
      'newline-before-return': 'error',
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'no-template-curly-in-string': 'error',
      'no-unsafe-negation': 'error',
      eqeqeq: 'error',
      'no-duplicate-case': 'error',
      'no-case-declarations': 'error',
      'no-else-return': 'error',
      'no-useless-call': 'error',
      'array-callback-return': 'error',
      'getter-return': 'error',
      'no-constant-condition': 'off',
      // --------------------------------------------------------
      // Code complexity limits
      // --------------------------------------------------------
      'max-len': [
        'error',
        {
          code: 100,
          ignoreComments: true,
          ignoreTemplateLiterals: true,
          // ignore import statements
          ignorePattern: '^import\\s+\\{[^}]+\\}\\s+from\\s+.*;$',
        },
      ],
      'max-depth': ['error', 4],
      'sonarjs/cognitive-complexity': ['error', 15],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration[params.length>3]',
          message: 'Function declarations should not have more than 3 parameters.',
        },
        {
          selector:
            'FunctionExpression[params.length>3]:not(MethodDefinition[kind="constructor"] > FunctionExpression)',
          message: 'Function expressions should not have more than 3 parameters.',
        },
        {
          selector: 'ArrowFunctionExpression[params.length>3]',
          message: 'Arrow functions should not have more than 3 parameters.',
        },
        {
          selector:
            'MethodDefinition:not([kind="constructor"]) > FunctionExpression[params.length>3]',
          message: 'Class methods should not have more than 3 parameters.',
        },
      ],

      // --------------------------------------------------------
      // TypeScript-specific rules
      // --------------------------------------------------------
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public', // Don't require on constructors
            properties: 'explicit',
            methods: 'explicit',
            accessors: 'explicit',
          },
        },
      ],
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      // --------------------------------------------------------
      // Unicorn plugin rules
      // --------------------------------------------------------
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/catch-error-name': ['error', { name: 'error' }],
      'unicorn/expiring-todo-comments': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-empty-file': 'error',
      // --------------------------------------------------------
      // Promise plugin rules
      // --------------------------------------------------------
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      // --------------------------------------------------------
      // Prettier integration
      // --------------------------------------------------------
      'prettier/prettier': 'error',
    },
  },
  // ======================================================
  // Override rules for database models
  // ======================================================
  {
    files: ['**/*.model.ts'],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
];
