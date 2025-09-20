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

```
cd backend/functions
npm install // install dependencies of functions

cd../   //return to backend folder
npm run start // start the functions of the  firebase emulations
npm run serve // start all the server of the firebase emulations
```