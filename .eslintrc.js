module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:deprecation/recommended',
    'plugin:prettier/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-await-in-loop': 'error',
    'no-return-await': 'error',
    'no-console': 'error',
    '@typescript-eslint/no-throw-literal': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'import', next: 'export' },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'MemberExpression > Identifier[name="findOne"]',
        message: 'Using TypeORM findOne method is not allowed.',
      },
      {
        selector: 'MemberExpression > Identifier[name="findOneOrFail"]',
        message: 'Using TypeORM findOneOrFail method is not allowed.',
      },
      {
        selector: 'MemberExpression > Identifier[name="findOneBy"]',
        message: 'Using TypeORM findOneBy method is not allowed.',
      },
      {
        selector: 'MemberExpression > Identifier[name="findOneByOrFail"]',
        message: 'Using TypeORM findOneByOrFail method is not allowed.',
      },
    ],
  },
  overrides: [
    {
      files: ['src/entities/**/*.ts'],
      rules: {
        'import/no-cycle': 'off',
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: ['migrations/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-underscore-dangle': 'off',
        'deprecation/deprecation': 'error',
      },
    },
  ],
};
