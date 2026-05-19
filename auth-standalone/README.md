# DR圈 登录注册独立页

这是一个从原项目中单独抽出来的登录/注册子项目，只包含认证流程，不包含首页、话题页、消息页等其他业务页面。

## 启动

```bash
npm install
npm run dev
```

默认本地端口是 `3010`。

## 构建

```bash
npm run build
```

构建产物位于 `dist/`，可以直接部署到静态托管平台。

## 部署建议

- Vercel：把 `auth-standalone` 设为 Root Directory，构建命令用 `npm run build`，输出目录用 `dist`
- Netlify：Base directory 设为 `auth-standalone`，Build command 用 `npm run build`，Publish directory 用 `dist`
- 其他静态托管：上传 `dist/` 即可

## 演示流程

- 号码 `15112341263` 会直接进入验证码流程
- 其他手机号会先进入邀请码页
- 演示邀请码是 `332233`
- 验证码输入任意 4 位数字即可继续

## 文件说明

- `src/App.tsx`：完整登录/注册与完成态
- `src/index.css`：认证页所需样式
- `vite.config.ts`：独立构建配置
