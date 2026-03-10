# OpenClaw 介绍、配置与功能

## 1. OpenClaw 简介

OpenClaw 是一个强大且灵活的自主代理框架，旨在帮助用户自动化各种复杂任务。它能够通过集成各种工具（如 shell 命令、文件操作、Web 浏览、GitHub 交互等）来理解、规划并执行任务。OpenClaw 的核心价值在于其能够通过自然语言指令与用户互动，并将这些指令转化为具体的操作步骤，从而实现高效的问题解决和自动化工作流。

## 2. OpenClaw 配置

OpenClaw 的配置通过 `config.yaml` 文件进行管理，用户可以根据需求调整其行为。以下是一些常见的配置项及其说明：

### 2.1. 核心配置

- **`model`**: 指定代理使用的语言模型，例如 `gemini/gemini-2.5-flash` 或 `openai/gpt-4o`。
- **`defaultModel`**: 设置默认的语言模型。
- **`thinking`**: 控制代理的思考模式，可以是 `off` (关闭), `on` (开启), `stream` (流式输出思考过程)。
- **`reasoning`**: 启用或禁用推理模式，影响代理的决策过程。
- **`elevated`**: 允许代理执行高权限命令（需要谨慎配置）。
- **`sandbox`**: 配置沙箱环境，限制代理的文件系统访问和命令执行权限。
- **`workspace`**: 指定代理的工作目录。

### 2.2. 工具配置

OpenClaw 的强大之处在于其可扩展的工具集。工具配置通常在 `config.yaml` 的 `tools` 部分进行。例如：

```yaml
tools:
  read:
    enabled: true
  write:
    enabled: true
  exec:
    enabled: true
    security: allowlist # 允许执行的命令白名单
    allowlist:
      - git
      - ls
      - cd
      - mkdir
      - rm
      - cp
      - mv
      - cat
      - grep
      - find
      - gh # GitHub CLI
      - npm
      - yarn
      - pnpm
      - docker
      - openclaw # OpenClaw CLI
  web_search:
    enabled: true
    provider: brave # 可配置为 Brave, Google, Bing 等
  web_fetch:
    enabled: true
  browser:
    enabled: true
  message:
    enabled: true
  cron:
    enabled: true
  gateway:
    enabled: true
  sessions_spawn:
    enabled: true
    runtime: acp # 或 subagent
  memory_search:
    enabled: true
  memory_get:
    enabled: true
```

### 2.3. 代理与会话配置

- **`agents`**: 定义和管理多个代理实例及其行为。
- **`sessions`**: 管理会话的持久性、隔离性和历史记录。

## 3. OpenClaw 主要功能

### 3.1. 自动化任务执行

OpenClaw 能够接收用户的自然语言指令，并通过以下步骤完成任务：
1.  **理解任务：** 解析用户指令，明确任务目标和约束。
2.  **制定计划：** 根据任务目标，自动规划一系列工具调用步骤。
3.  **执行计划：** 调用相应的工具执行每一步操作。
4.  **结果反馈：** 将执行结果反馈给用户，并根据需要调整计划。

### 3.2. 文件系统操作

- **`read`**: 读取文件内容。
- **`write`**: 创建或覆盖文件。
- **`edit`**: 精确编辑文件内容。

### 3.3. Shell 命令执行

- **`exec`**: 执行 shell 命令，支持后台运行、超时控制和 PTY 模式。
- **`process`**: 管理后台 `exec` 会话，如轮询日志、发送输入等。

### 3.4. 网络与浏览器交互

- **`web_search`**: 通过 Brave API 进行网络搜索。
- **`web_fetch`**: 抓取并提取网页内容（如 HTML 转 Markdown/Text）。
- **`browser`**: 控制 Web 浏览器，进行页面导航、点击、输入、截图等操作。

### 3.5. 任务调度与提醒

- **`cron`**: 管理 cron 作业和唤醒事件，用于设置定时任务和提醒。

### 3.6. 会话管理与协作

- **`sessions_list`**: 列出当前所有会话。
- **`sessions_history`**: 获取指定会话的历史记录。
- **`sessions_send`**: 向其他会话发送消息。
- **`sessions_spawn`**: 孵化独立的子代理或 ACP 编码会话，实现复杂任务的分解和并行处理。
- **`subagents`**: 管理当前会话派生的子代理。

### 3.7. 记忆与学习

- **`memory_search`**: 在 `MEMORY.md` 和 `memory/*.md` 中进行语义搜索，召回历史工作、决策和偏好。
- **`memory_get`**: 从记忆文件中安全读取指定行的内容。

### 3.8. GitHub 集成

通过 `gh` CLI 工具，OpenClaw 可以直接与 GitHub 交互，例如：
- 创建和管理 Issues。
- 提交和审阅 Pull Requests。
- 监控 CI/CD 运行。
- 执行高级 GitHub API 查询。

### 3.9. 实时交互与多模态

- **`tts`**: 将文本转换为语音。
- **`canvas`**: 在 Canvas 上展示 UI、评估 JavaScript 或进行截图。
- **`nodes`**: 控制配对的边缘节点，进行设备状态查询、通知、摄像头控制、屏幕录制等。

## 4. 最佳实践

- **明确指令：** 给出清晰、具体的任务指令，避免模糊不清的表述。
- **逐步迭代：** 对于复杂任务，建议分阶段进行，逐步验证和优化。
- **利用记忆：** 充分利用 `memory` 工具来存储和检索重要信息，提升代理的工作效率。
- **关注安全：** 在配置 `exec` 等高风险工具时，务必设置严格的安全策略（如 `allowlist`），并谨慎开启 `elevated` 权限。
- **善用子代理：** 对于需要长时间运行、并行处理或独立环境的任务，优先考虑 `sessions_spawn` 孵化子代理。

OpenClaw 是一个不断进化的系统，通过合理的配置和指令，可以成为您强大的自动化助手。
