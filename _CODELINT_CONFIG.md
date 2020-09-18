eslint 和 prettier 配置文件说明

<!-- https://segmentfault.com/a/1190000021803437 -->
<!-- https://www.jianshu.com/p/dd07cca0a48e -->
<!-- https://blog.csdn.net/weixin_33724059/article/details/91369223 -->

1.名词:
eslint: 项目中安装的 eslint 插件
prettier: 项目中安装的 prettier 插件
eslintVS: vscode 编辑器中的 eslint 插件， 用于编辑器编写代码时做质量校验。
prettierVS: vscode 编辑器中的 prettier 插件 ，用于编辑器编写代码时做格式化。

2. eslint 在项目中做代码质量检查， prettier 统一管理代码风格。两种不同的代码风格在质量校验中可通过，风格不一的代码可以认为都是没有问题的，

3.vscode 添加配置项
{
...,
"[javascript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnType": true,
"editor.formatOnSave": true
},
...
}

finally: problem && resolve
1.crlf 和 lf 的冲突 <!-- https://blog.csdn.net/qq_36727756/article/details/105164225  -->
mac ==> git config --global core.autocrlf true。
windows ==> git config --global core.autocrlf input 。
