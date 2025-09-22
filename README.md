# 🧪 代码质量检查演示

## 演示1：正常代码提交

```bash
# 1. 创建一个正常的文件
echo "const test = () => console.log('Hello'); export default test;" > frontend/demo-ok.js

# 2. 添加到git
git add frontend/demo-ok.js

# 3. 提交（应该成功）
git commit -m "feat: add demo file"
```

## 演示2：有语法错误的代码提交

```bash
# 1. 创建一个有语法错误的文件
echo "const test = () => { console.log('Hello' return 'test' }" > frontend/demo-error.js

# 2. 添加到git
git add frontend/demo-error.js

# 3. 提交（应该被阻止）
git commit -m "feat: add demo with error"
```

## 演示3：错误的提交信息格式

```bash
# 1. 使用错误的提交信息格式
git commit -m "just a test message"
# 应该被commit-msg hook阻止
```

## 演示4：手动运行检查

```bash
# 检查代码质量
npm run lint

# 自动修复问题
npm run fix

# 检查代码格式
npm run format:check
```

TODO: 错误的实践方式，使用自动格式化可能会造成大量的代码变动，有些对齐方式是精心调整的

# firebase dependencies

1. npm install -g firebase-tools
2. make sure your java version > 11 // recommend to use openjdk-17(stable version)

# run 

首次运行执行初始化数据

```
# 根目录执行
# 安装依赖
npm install --save-dev firebase-admin
# 在运行初始化脚本之前,需要先启动Firebase模拟器
npm run backend:serve
npm run init:data
# 在页面google登录创建一个邮箱为 raccoon.panda.384@thermoflo.co.nz 的名为 AdminMocker 的用户
# 在浏览器访问 http://127.0.0.1:4000/auth 查看 AdminMocker 的 uid 复制出来
# 转移 mock 数据: 替换后面网址的 uid 并且在浏览器访问 http://localhost:5001/demo-project-id/us-central1/api/admin/transfer-forms?fromUid=admin-mocker-384&toUid={yourUid}
```

正常开发,启动后端本地开发的 firebase 模拟器

```
# 根目录执行
npm run backend:serve
```

# 如何配置新的 form template

todo 我们可以写一份简单文档，让 po 以后去使用 gpt 生成，避免复杂的表单生成引擎
