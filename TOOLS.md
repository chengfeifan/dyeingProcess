# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## 作为独立开发者使用的工具 (Tools for Independent Development)

*   **版本控制:** `git` CLI (用于代码管理)
*   **包管理器:** `npm`, `yarn`, `pnpm` (根据项目需求)
*   **容器化:** `docker` CLI (用于应用隔离和部署)
*   **文件操作:** `ls`, `cd`, `cp`, `mv`, `rm`, `mkdir`, `cat`, `grep`, `find` 等标准 Shell 命令。
*   **文本编辑:** `vi`, `nano` (用于文件内容修改)
*   **网络工具:** `curl`, `wget` (用于API调用和资源下载)
*   **构建工具:** 根据项目技术栈（例如，`make`, `webpack`, `rollup` 等）
*   **_您的操作:_** 在这里补充您希望我使用的特定开发工具、语言运行时或框架工具。
