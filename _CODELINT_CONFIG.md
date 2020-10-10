eslint 和 prettier 代码质量和风格统一 配置文件说明。参考自：
https://segmentfault.com/a/1190000021803437
https://www.jianshu.com/p/dd07cca0a48e
https://blog.csdn.net/weixin_33724059/article/details/91369223

1. 前序。eslint 在项目中做代码质量检查。 prettier 统一管理代码风格，两种不同的代码风格在质量校验中可通过，风格不一的代码可以认为都是没有问题的，所以应用 prettier 统一风格。

2.名词:
eslint: 项目中安装的 eslint 插件
prettier: 项目中安装的 prettier 插件
eslintVS: vscode 编辑器中安装的 eslint 插件， 用于编辑器编写代码时做质量校验。
prettierVS: vscode 编辑器中安装的 prettier 插件 ，用于编辑器编写代码时做格式化。

3.vscode 安装插件 eslint、 prettier, setting.json 文件 添加配置项
{
...,
"[javascript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnType": true,
"editor.formatOnSave": true
},
...
}

4.package.json 添加提交前校验当前所修改文件。
{
...,
"husky": {
"hooks": {
"pre-commit": "npm run lint-staged"
}
},
"lint-staged": {
"src/\*_/_.{js,jsx,tsx,ts,md,json}": [
"eslint --fix",
"git add"
]
},
"scripts": {
...
"lintfix": "eslint --fix --ext .js src",
"lint": "eslint --ext .js src",
"lint-staged": "lint-staged"
},
}

5.项目根目录添加 .eslintrc.js 文件
module.exports = {
root: true,
extends: ['umi', 'prettier', 'prettier/react'],
globals: {},
parser: 'babel-eslint',
plugins: ['react', 'prettier'],
env: {
browser: true,
node: true,
es6: true,
mocha: true,
jest: true,
jasmine: true
},
rules: {
'prettier/prettier': ['warn', {}, {}],
},
parserOptions: {
ecmaVersion: 7,
sourceType: 'module',
ecmaFeatures: {
legacyDecorators: true,
experimentalObjectRestSpread: true
}
},
settings: {
polyfills: ['fetch', 'Promise'],
react: {
version: 'detect'
}
}
}

6.项目根目录添加 .eslintignore 文件
**/dist/**
**/node_modules/**

7.项目根目录添加 .prettierrc.json 文件
{
"semi": false,
"singleQuote": true,
"tabWidth": 2,
"endOfLine": "auto"
}

8.npm 包依赖项：
npm install babel-eslint eslint-config-prettier eslint-config-umi eslint-plugin-compat eslint-plugin-jsx-a11y eslint-plugin-react lint-staged husky --save-dev

9.problem && resolve:
(1)crlf 和 lf 的冲突 <!-- https://blog.csdn.net/qq_36727756/article/details/105164225  -->
mac ==> git config --global core.autocrlf true。
windows ==> git config --global core.autocrlf input 。
(2)git bash 中找不到 node。
升级 node 至最新。

10.FAQ: ---
