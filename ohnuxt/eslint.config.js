import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['.nuxt', '.output', '.data', 'node_modules', 'public'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { extraFileExtensions: ['.vue'] },
    },
    rules: {
      // Auto-imports (useThemeStore, NuxtLink, …) are not statically in scope;
      // vue-tsc validates them instead.
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        // vue-eslint-parser delegates <script lang="ts"> to this parser.
        parser: tseslint.parser,
      },
    },
    rules: {
      // Vue 2-era stylistic rules from flat/recommended that conflict with
      // this codebase's established formatting.
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/attributes-order': 'off',
      'vue/order-in-components': 'off',
      'vue/require-default-prop': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/require-v-for-key': 'warn',
    },
  },
)
