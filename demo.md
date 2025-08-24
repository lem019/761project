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

## 预期结果

- ✅ 正常代码可以成功提交
- ❌ 有语法错误的代码会被阻止提交
- ❌ 格式错误的提交信息会被拒绝
- 🔧 代码会自动格式化（如果可能的话）

## 测试建议

1. 先测试正常情况，确保基本功能正常
2. 再测试错误情况，验证保护机制是否生效
3. 最后测试修复功能，确保问题可以被解决
