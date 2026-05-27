# Today Trajectory

一个围绕“今天做了哪些事”展开的专注记录桌面应用。

它不是传统意义上只盯着番茄钟的工具，而是希望通过一段段可回看的专注记录，帮用户重新获得对时间的掌控感。每一次开始专注，都会留下任务名称、开始时间、结束时间与持续时长；等一天结束时，你可以清楚地看见，这一天究竟去向了哪里。

## 项目形态

- 前端：Next.js 16 + React 19 + TypeScript
- 桌面端：Tauri 2
- 数据存储：本地 `records.json`
- 当前主平台：Windows 桌面端

## 当前功能

- 首页聚焦两个核心动作：开始专注、查看完整记录
- 专注开始页支持任务填写、时长选择、自定义时长
- 专注进行中页面显示倒计时与当前任务信息
- 桌面悬浮圆形桌宠显示倒计时
- 桌宠支持拖动
- 桌宠支持长按结束当前任务
- 倒计时自然结束时自动完成记录、自动隐藏桌宠
- 结束时播放四段式清脆铃声提醒
- 记录页支持查看当天完整时间轨迹
- 记录页支持删除单条记录
- 支持桌宠形象切换
- 数据以明确的 `records.json` 文件持久化保存

## 安装包

仓库内已包含 Windows 安装包：

- [release/Today Trajectory_0.1.0_x64-setup.exe](./release/Today%20Trajectory_0.1.0_x64-setup.exe)

双击即可安装。

说明：

- 当前安装包为轻量化 NSIS 安装包
- `WebView2` 安装模式为 `skip`
- 目标 Windows 环境需要已安装 `WebView2 Runtime`

## 本地开发

### 1. 安装依赖

```powershell
npm install
```

### 2. 启动 Web 开发模式

```powershell
npm run dev
```

启动后访问：

- [http://localhost:3000](http://localhost:3000)

### 3. 启动桌面开发模式

```powershell
npm run desktop:dev
```

这个模式会同时启动：

- Next.js 开发服务
- Tauri 桌面壳
- 悬浮桌宠窗口

## 构建

### Web 构建

```powershell
npm run build
```

### 桌面安装包构建

```powershell
npm run desktop:build
```

构建完成后，安装包默认输出到：

- `src-tauri/target/release/bundle/nsis/`

## 代码质量检查

```powershell
npm run lint
```

## 数据存储位置

桌面端数据文件保存为本地 `records.json`。

Windows 下一般位于：

```text
C:\Users\你的用户名\AppData\Roaming\com.todaytrajectory.app\records.json
```

## 推荐使用流程

1. 打开应用
2. 点击开始专注
3. 输入当前要做的事
4. 选择专注时长
5. 开始专注，桌宠显示倒计时
6. 倒计时结束后自动生成记录
7. 进入记录页回看今天做了哪些事

## 项目目录

```text
src/                 Next.js 前端页面与组件
src/lib/             业务逻辑、存储、桌宠控制、音频逻辑
src/app/pet/         悬浮桌宠页面
src-tauri/           Tauri 桌面端配置与 Rust 命令
release/             仓库内提供的安装包
```

## 当前状态

这是一个可运行的 MVP 版本，核心链路已经完整：

- 可以开始专注
- 可以生成记录
- 可以查看记录
- 可以删除记录
- 可以通过桌宠查看和结束任务

后续还可以继续扩展：

- 多种铃声可选与试听
- 删除后的撤销能力
- 更完整的设置页
- 更丰富的数据统计
- 更完整的移动端适配

