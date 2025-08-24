# 使用 node 构建 React 应用
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 使用 nginx 提供静态文件服务
FROM nginx:alpine

# 拷贝构建好的文件到 nginx 默认网页目录
COPY --from=build /app/dist /usr/share/nginx/html

# 拷贝自定义 nginx 配置（支持前端路由跳转）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
