该项目由dva-cli搭建
初始创建项目配置
// "dva": "^2.3.1",

//递归在文档模块的文件夹移动复制

## hyf_交接说明

### 负责的功能模块

#### 数据层

没有负责独立模块的数据层设计。
只是在个别的 model 中加入一些字段。

基本上是修改页面的某些组件，所以更多的是一个“切图仔”的角色 :)

#### 页面和组件

##### 页面

- src\routes\Technological\components\Project\index.js 项目首页，页面样式和结构调整，数据层封装和引入沿用之前的风格
    - src\routes\Technological\components\Project\ProjectItems.js - 项目 items 组件，样式调整， item 内容沿用之前的
    - src\routes\Technological\components\Project\ProjectMenu.js - 项目菜单组件，渲染项目树 

##### 组件

- src\routes\Technological\components\InviteOthers\index.js - 项目邀请成员加入组件

- src\routes\Technological\components\Project\components\SearchTreeModal.js - 项目树搜索组件

- src\routes\Technological\components\ShareAndInvite\index.js - 只读分享组件

- src\routes\Technological\components\VisitControl\index.js - 访问控制组件

* 这个功能的实现在工作量预估的时候存在巨大的偏差，现在只是实现了这个组件，并没有达到需求所要求的可以实际控制细粒度内容的程度。而且涉及到后端数据的筛选，暂时搁置。

- src\routes\Technological\components\Workbench\CardContent\CheckboxGroup\index.js - 多选 checkbox 组件

- src\routes\Technological\components\Workbench\CardContent\DateRangePicker\index.js - 时间段选择器组件
* 封装之前实现的时间段功能

- src\routes\Technological\components\Workbench\CardContent\DropdownSelectWithSearch\index.js - 带有搜索的下拉多选菜单

- src\routes\Technological\components\Workbench\CardContent\FileFolder\index.js - 文件夹组件

- src\routes\Technological\components\Workbench\CardContent\Modal\AddTaskModal.js - 添加任务 modal

- src\routes\Technological\components\Workbench\UpdateLog\index.js - 新功能提示组件

- src\routes\Technological\components\Workbench\ProjectListBar.js - 工作台项目菜单栏组件

- src\routes\Technological\components\Workbench\ProjectListBarCell.js - 工作台项目菜单栏 cell 组件

- src\components\ZoomPicture\index.js - 图像圈评组件
