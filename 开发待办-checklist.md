# 开发待办 Checklist

> 对应文档：[开发需求与设计文稿说明书.md](D:/CodexWorkspace/Codex-0526/开发需求与设计文稿说明书.md)

## 1. 项目初始化

- [ ] 初始化 `Next.js + TypeScript` 项目
- [ ] 安装并配置 `Tailwind CSS`
- [ ] 创建基础目录结构：
  - [ ] `src/app`
  - [ ] `src/components`
  - [ ] `src/hooks`
  - [ ] `src/lib`
  - [ ] `src/types`
- [ ] 配置全局样式文件
- [ ] 启动本地开发环境并确认首页可访问

## 2. 类型与基础常量

- [ ] 创建 [focus-record.ts](D:/CodexWorkspace/Codex-0526/src/types/focus-record.ts)
- [ ] 定义 `FocusRecord` 类型
- [ ] 创建时长选项常量文件
- [ ] 配置默认专注时长 `25 分钟`

建议完成后应具备：

- 明确的记录数据结构
- 明确的默认时长与快捷时长选项

## 3. 时间工具函数

- [ ] 创建 [format-date.ts](D:/CodexWorkspace/Codex-0526/src/lib/time/format-date.ts)
- [ ] 创建 [format-time.ts](D:/CodexWorkspace/Codex-0526/src/lib/time/format-time.ts)
- [ ] 创建 [format-duration.ts](D:/CodexWorkspace/Codex-0526/src/lib/time/format-duration.ts)
- [ ] 创建 [calculate-duration.ts](D:/CodexWorkspace/Codex-0526/src/lib/time/calculate-duration.ts)
- [ ] 创建 [get-today-records.ts](D:/CodexWorkspace/Codex-0526/src/lib/time/get-today-records.ts)

检查点：

- [ ] 能把时间格式化成 `14:00`
- [ ] 能把日期格式化成 `2026年5月26日 周二`
- [ ] 能根据开始时间和结束时间计算分钟数
- [ ] 能正确过滤出今天的记录

## 4. 本地存储模块

- [ ] 创建 [focus-records-storage.ts](D:/CodexWorkspace/Codex-0526/src/lib/storage/focus-records-storage.ts)
- [ ] 实现读取全部记录方法
- [ ] 实现保存单条记录方法
- [ ] 实现覆盖写入记录列表方法
- [ ] 处理 `localStorage` 不存在或数据为空的情况

检查点：

- [ ] 新增记录后可以正确写入本地
- [ ] 刷新页面后记录仍然存在
- [ ] 本地存储异常时页面不直接崩溃

## 5. 通用 UI 组件

- [ ] 创建 [page-header.tsx](D:/CodexWorkspace/Codex-0526/src/components/common/page-header.tsx)
- [ ] 创建 [primary-button.tsx](D:/CodexWorkspace/Codex-0526/src/components/common/primary-button.tsx)
- [ ] 创建 [secondary-button.tsx](D:/CodexWorkspace/Codex-0526/src/components/common/secondary-button.tsx)
- [ ] 创建 [empty-state.tsx](D:/CodexWorkspace/Codex-0526/src/components/common/empty-state.tsx)

检查点：

- [ ] 按钮风格统一
- [ ] 标题区样式统一
- [ ] 空状态组件可复用

## 6. 今日记录页组件

- [ ] 创建 [daily-summary.tsx](D:/CodexWorkspace/Codex-0526/src/components/today/daily-summary.tsx)
- [ ] 创建 [timeline-record-item.tsx](D:/CodexWorkspace/Codex-0526/src/components/today/timeline-record-item.tsx)
- [ ] 创建 [record-timeline.tsx](D:/CodexWorkspace/Codex-0526/src/components/today/record-timeline.tsx)

检查点：

- [ ] 单条记录能展示任务名称、开始时间、结束时间、时长
- [ ] 多条记录能按顺序显示
- [ ] 时间轴视觉上有“今日轨迹”的感觉

## 7. 今日记录页

- [ ] 创建 [page.tsx](D:/CodexWorkspace/Codex-0526/src/app/page.tsx)
- [ ] 渲染今日日期
- [ ] 渲染说明文案
- [ ] 渲染累计专注时长
- [ ] 渲染今日专注次数
- [ ] 渲染记录时间轴
- [ ] 渲染空状态
- [ ] 添加“开始记录这段时间”按钮
- [ ] 接入跳转到开始专注页

检查点：

- [ ] 无记录时显示空状态
- [ ] 有记录时显示时间轴
- [ ] 数据区域层级清楚

## 8. 开始专注页组件

- [ ] 创建 [task-input.tsx](D:/CodexWorkspace/Codex-0526/src/components/focus/task-input.tsx)
- [ ] 创建 [duration-picker.tsx](D:/CodexWorkspace/Codex-0526/src/components/focus/duration-picker.tsx)

检查点：

- [ ] 输入框清晰易用
- [ ] 时长选择默认值正确
- [ ] 可切换快捷时长

## 9. 开始专注页

- [ ] 创建 [page.tsx](D:/CodexWorkspace/Codex-0526/src/app/focus/start/page.tsx)
- [ ] 渲染页面标题和说明
- [ ] 接入任务名称输入
- [ ] 接入时长选择
- [ ] 校验任务名称必填
- [ ] 添加开始按钮
- [ ] 点击开始后记录开始信息
- [ ] 跳转至专注进行中页

检查点：

- [ ] 任务名为空时不能开始
- [ ] 输入任务后可正常开始
- [ ] 开始后能正确进入下一页

## 10. 专注进行中页组件

- [ ] 创建 [focus-timer.tsx](D:/CodexWorkspace/Codex-0526/src/components/focus/focus-timer.tsx)
- [ ] 创建 [session-info-card.tsx](D:/CodexWorkspace/Codex-0526/src/components/focus/session-info-card.tsx)

检查点：

- [ ] 倒计时展示清晰
- [ ] 当前任务信息清晰

## 11. 专注进行中页逻辑

- [ ] 创建 [use-focus-session.ts](D:/CodexWorkspace/Codex-0526/src/hooks/use-focus-session.ts)
- [ ] 管理剩余秒数
- [ ] 管理开始时间
- [ ] 实现倒计时递减
- [ ] 实现手动结束逻辑
- [ ] 实现取消逻辑
- [ ] 实现倒计时归零自动结束

检查点：

- [ ] 倒计时每秒更新
- [ ] 结束时能正确得到结束时间
- [ ] 取消时不会保存记录
- [ ] 时间归零后可自动流转

## 12. 专注进行中页

- [ ] 创建 [page.tsx](D:/CodexWorkspace/Codex-0526/src/app/focus/session/page.tsx)
- [ ] 显示当前任务名称
- [ ] 显示开始时间
- [ ] 显示倒计时
- [ ] 显示“你正在为今天留下一条新的记录”
- [ ] 添加“结束并保存”按钮
- [ ] 添加“取消这次记录”按钮

检查点：

- [ ] 页面氛围安静清晰
- [ ] 按钮行为明确
- [ ] 进行中页不出现多余干扰元素

## 13. 专注结束反馈页

- [ ] 创建 [page.tsx](D:/CodexWorkspace/Codex-0526/src/app/focus/done/page.tsx)
- [ ] 显示“已记录这段时间”
- [ ] 渲染本次记录卡片
- [ ] 显示“今天的时间轨迹，又多了一段”
- [ ] 添加“查看今天的记录”按钮
- [ ] 添加“开始下一次专注”按钮

检查点：

- [ ] 刚完成的记录信息完整
- [ ] 用户能自然回到今日记录页
- [ ] 用户也可以直接开始下一轮

## 14. 今日记录统计逻辑

- [ ] 创建 [use-today-records.ts](D:/CodexWorkspace/Codex-0526/src/hooks/use-today-records.ts)
- [ ] 读取全部记录
- [ ] 过滤当天记录
- [ ] 计算今日累计分钟数
- [ ] 计算今日专注次数

检查点：

- [ ] 当天记录过滤正确
- [ ] 累计时长统计正确
- [ ] 次数统计正确

## 15. 完整流程打通

- [ ] 从今日记录页进入开始专注页
- [ ] 从开始专注页进入进行中页
- [ ] 从进行中页结束并保存
- [ ] 从结束反馈页返回今日记录页
- [ ] 保存后今日页能立刻看到新记录

检查点：

- [ ] 主流程完整可走通
- [ ] 新记录展示正确
- [ ] 页面跳转无明显断层

## 16. 边界情况处理

- [ ] 处理刷新页面后的记录读取
- [ ] 处理无记录状态
- [ ] 处理非法时长输入
- [ ] 处理本地存储异常
- [ ] 处理用户在进行中页中途离开的情况

建议最低处理方式：

- [ ] 页面不崩溃
- [ ] 给出清晰默认行为

## 17. 样式与体验打磨

- [ ] 统一页面间距和排版
- [ ] 统一按钮样式
- [ ] 调整时间轴视觉层级
- [ ] 调整倒计时视觉重点
- [ ] 调整空状态文案与按钮位置
- [ ] 确保移动端可正常使用

检查点：

- [ ] 首页一眼能看懂
- [ ] 专注流程干净顺畅
- [ ] 不像普通番茄钟，而更像“今日轨迹”

## 18. 自测验收

- [ ] 可以在 5 秒内开始一条新记录
- [ ] 一次专注结束后一定会生成记录
- [ ] 取消记录不会误保存
- [ ] 今日记录页能准确反映当天做过的事
- [ ] 刷新页面后数据仍然存在
- [ ] 核心流程在桌面端正常
- [ ] 核心流程在移动端正常

## 19. MVP 完成标准

当以下条件全部满足时，可认为第一版 MVP 已完成：

- [ ] 用户可以输入任务名称开始专注
- [ ] 用户可以完成一次倒计时专注
- [ ] 系统可以自动保存专注记录
- [ ] 用户可以在今日页看到“今天做了哪些事”
- [ ] 今日累计时长与专注次数显示正确
- [ ] 整体体验清晰、稳定、可回看

