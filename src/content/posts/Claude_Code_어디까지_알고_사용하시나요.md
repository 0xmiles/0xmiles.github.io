---
title: "Claude Code 어디까지 알고 사용하시나요?"
description: "Claude Code를 사용할 때 유용한 다양한 확장 기능에 대해서 기록합니다."
date: 2025-12-27
category: ai
tags:
  - ai
  - Claud Clode
draft: false
featured: true
author: 박용준
---

시간이 지날수록 AI 기술이 발달하고 있습니다. 특히 Claude Code는 터미널 기반의 AI 도구로 많은 개발자에게 사랑받고 있습니다. (개발자에겐 GPT보다 인기가 많네요)

이제는 많은 분들이 Claude Code를 효과적으로 사용하고 있겠지만, 한번 정리하는 느낌으로 Claude Code를 맛있게 사용하는 법을 정리해보려고 합니다.

## 1. CLAUDE.md

개인적으로 조금 마음에 들지는 않지만…
Claude Code는 다른 AI Agent와 다르게 CLAUDE.md라는 양식을 사용해서 프로젝트의 핵심 정보를 파악합니다. (다른 AI Agent는 대부분 AGENTS.md를 사용합니다.)

CLAUDE.md는 프로젝트의 전반적인 구조, 주요 라이브러리, 스타일 등을 한번에 Claude Code에게 전달할 수 있는 파일입니다.

### 예시

```markdown
## Project Overview

**Tech Stack:**
- Spring Boot 4.0.1 + Java 21 + Virtual Threads
- PostgreSQL 12+ (dual database: OPS + Product)
- QueryDSL + JOOQ for type-safe queries
- Flyway for migrations
- TestContainers for integration testing

~~

---

## Architecture & Code Organization

### Domain-Driven Design (DDD) Structure

The codebase follows DDD with clear separation into domains:

~~
```

저는 보통 다음과 같은 내용을 포함하여 CLAUDE.md를 작성합니다.

- 프로젝트 설명
- 주요 라이브러리 및 스펙
- 유저의 특징
- 폴더 구조
- 대표적인 코드 컨벤션

## 2. SubAgents

기본적으로 Claude Code를 사용하면 메인 컨텍스트에서 동작을 이어갑니다.

만약 독립적인 컨텍스트에서 특정 작업 및 도구를 실행하기를 원한다면, SubAgents 를 사용하면 됩니다.

공식 Docs를 참고하면 SubAgents는 다음과 같은 특징이 있습니다.

- **컨텍스트 보존** - 탐색 및 구현을 주 대화에서 분리하여 유지
- **제약 조건 적용** - 서브에이전트가 사용할 수 있는 도구 제한
- **구성 재사용** - 사용자 수준 서브에이전트를 통해 프로젝트 간 재사용
- **동작 특화** - 특정 도메인을 위한 집중된 시스템 프롬프트
- **비용 제어** - Haiku와 같은 더 빠르고 저렴한 모델로 작업 라우팅

Claude Code 내에는 기본적으로 Explore, Plan, general-purpost와 같은 기본 서브에이전트가 포함되어 있습니다. 이 에이전트들은 아마 많은 분들이 한번 쯤은 사용해보셨을 겁니다.

### 예시

**code-reviewer.md**

```markdown
---
name: code-reviewer
description: Expert Spring Boot/Java code reviewer.
tools: Read, Write, Edit, Bash, Glob, Grep
---

# Agent Name

## Instructions

## Checklists
```

SubAgents는 위와 같은 파일을 `.claude/agents` 또는 `~/.cluade/agents` 아래에 생성하면 사용이 가능합니다.

그리고 꼭 기입해야 하는 필드와 그렇지 않은 필드가 있습니다.

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| name | O | 고유 식별자 |
| description | O | Claude Code가 SubAgent에게 작업을 위임하는 조건 |
| tools | X | SubAgent가 사용할 수 있는 도구 (생략 시 모두 상속) |
| disallowedTools | X | 사용 거부된 도구 |
| model | X | 사용할 모델 |
| permissionMode | X | 권한 모드 : default, acceptEdits, dontAsk, bypassPermissions, plan |
| skills | X | SubAgent에게 할당할 스킬 |
| hooks | X | 라이프사이클 훅 |

<aside>
💡

**권한 모드**

default : 표준 권한 확인

acceptEdits : 파일 편집 자동 수락

dontAsk : 권한 프롬프트 자동 거부 (명시적으로 허용한 도구는 작동합니다.)

bupassPermissions : 모든 권한 확인 건너뛰기

plan : 계획 모드 (읽기 전용)

</aside>

## 3. Skills

위의 SubAgents 의 필드에서 만났던 Skills 입니다.

Claude Code에서 Skills에 어떻게 설명하는지 확인해보겠습니다.

> Agent Skills는 Claude의 기능을 확장하는 모듈식 기능입니다. 각 Skill은 지침, 메타데이터 및 선택적 리소스(스크립트, 템플릿)를 패키징하며, Claude는 관련이 있을 때 자동으로 이를 사용합니다.
> 

이렇게만 봐서는 이해하기가 조금 어렵습니다. 

쉽게 설명하자면 Skills는 **특정 워크플로를 재사용할 수 있도록 만들어둔 시스템** 이라고 생각하시면 편합니다.

예를 들어, 

- 특정 기능에 대한 문서를 작성
- Github pr 업데이트

등과 같이 반복적으로 사용하는 복잡한 작업을 Skills로 만들어두면 워크플로우를 확장해서 사용할 수 있습니다.

```markdown
.claude
- skills
	- pdf-generator
		- SKILL.md
```

Skills는 `.claude/skills` 또는 `~/.cluade/skills` 에 작성합니다. 이때 SubAgents와 다른 점은 폴더 > SKILL.md 형태로 작성해야 합니다.

### 예시

```markdown
---
name: image-enhancer
description: Improves the quality of images, especially screenshots, by enhancing resolution, sharpness, and clarity. Perfect for preparing images for presentations, documentation, or social media posts.
---

# Image Enhancer

This skill takes your images and screenshots and makes them look better—sharper, clearer, and more professional.

## When to Use This Skill

- Improving screenshot quality for blog posts or documentation
- Enhancing images before sharing on social media
- Preparing images for presentations or reports
- Upscaling low-resolution images
- Sharpening blurry photos
- Cleaning up compressed images

## What This Skill Does

1. **Analyzes Image Quality**: Checks resolution, sharpness, and compression artifacts
2. **Enhances Resolution**: Upscales images intelligently
3. **Improves Sharpness**: Enhances edges and details
4. **Reduces Artifacts**: Cleans up compression artifacts and noise
5. **Optimizes for Use Case**: Adjusts based on intended use (web, print, social media)

## How to Use

### Basic Enhancement

```
Improve the image quality of screenshot.png
```

```
Enhance all images in this folder
```

### Specific Improvements
```

유용한 스킬들을 모아둔 페이지도 있으니, 참고해서 사용하시면 됩니다.

https://github.com/ComposioHQ/awesome-claude-skills

## 4. Hooks

Hooks는 Claude Code의 라이프 사이클에서 특정 시점에 실행시킬 동작을 의미합니다.

<aside>
💡

**Claude Code의 라이프 사이클**

**PreToolUse**: 도구 호출 전에 실행됩니다(차단 가능).

**PermissionRequest**: 권한 대화상자가 표시될 때 실행됩니다(허용 또는 거부 가능).

**PostToolUse**: 도구 호출 완료 후 실행됩니다.

**UserPromptSubmit**: 사용자가 프롬프트를 제출할 때 Claude가 처리하기 전에 실행됩니다.

**Notification**: Claude Code가 알림을 보낼 때 실행됩니다.

**Stop**: Claude Code가 응답을 마칠 때 실행됩니다.

**SubagentStop**: 서브에이전트 작업이 완료될 때 실행됩니다.

**PreCompact**: Claude Code가 컴팩트 작업을 실행하려고 할 때 실행됩니다.

**SessionStart**: Claude Code가 새 세션을 시작하거나 기존 세션을 재개할 때 실행됩니다.

**SessionEnd**: Claude Code 세션이 종료될 때 실행됩니다.

</aside>

Hook은 `/hooks` 커맨드를 실행하거나, `~/.claude/settings.json 또는 .claude/settings.json` 에 세팅하여 설정할 수 있습니다.

Hooks는 특정 시점에 특정 작업을 실행하고 싶을 때 사용하면 좋습니다.

저는 보통 API를 만든 뒤 관련 Docs나 정책에 대한 문서를 작성할 때 사용하는 편입니다.

### 예시

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"\\(.tool_input.command) - \\(.tool_input.description // \"No description\")\"' >> ~/.claude/bash-command-log.txt"
          }
        ]
      }
    ]
  }
}
```

이렇게 설정하면, Claude Code를 실행하고 Bash 명령어를 사용하면 해당 Hook이 호출됩니다.

---

오늘은 이렇게 Claud Code에서 사용 가능한 여러 확장 기능을 살펴봤습니다.

이런게 있구나~ 하면서, 테스트를 하다보면 어떻게 사용하는지 감이 잡히실거라 생각합니다.

다음에는 제가 실제로 Claude Code를 사용하면서 적용하고 있는 기능들에 대해서도 공유해보도록 하겠습니다.