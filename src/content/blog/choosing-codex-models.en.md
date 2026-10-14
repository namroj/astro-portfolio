---
title: "Choosing Between Codex Models: Sol, Luna, Terra, and Astra"
author: Jorman Espinoza & ChatGPT
description: A practical comparison of Codex model families and reasoning levels, from low to xhigh, with guidance on when each setting makes sense.
image:
  url: "/images/posts/codex-model-comparison.png"
  alt: "A sun, crescent moon, blue-green planet, and bright star connected by a constellation on a dark background."
pubDate: 2026-10-13
tags: ["AI", "Codex", "models", "reasoning"]
draft: false
lang: en
slug: choosing-codex-models
---

Codex offers several model families with different tradeoffs. **Sol**, **Luna**, **Terra**, and **Astra** can all handle coding work, but they are positioned differently: some favor speed, some balance everyday work, and one targets the hardest reasoning tasks. Each also has a reasoning-effort setting that controls how much time and compute the model can spend thinking through a request.

This is a practical selection guide, not a benchmark. A higher effort setting can help with a difficult task, but it does not guarantee a correct answer, and model names alone do not tell you which model will win on your particular codebase.

<figure class="article-illustration">
  <img src="/images/posts/codex-reasoning-spectrum.png" alt="Four connected reasoning stages grow from a single simple node into a dense, interconnected network." />
  <figcaption>A visual progression from a light reasoning pass to deeper, more connected analysis.</figcaption>
</figure>

## The four model families

| Model | Catalog positioning | A sensible starting point |
| --- | --- | --- |
| **GPT-5.6-Sol** | Older-generation workhorse | General coding tasks when you want a capable, familiar default |
| **GPT-5.6-Luna** | Older-generation fast and efficient model | Short edits, explanations, and routine tasks where latency matters |
| **GPT-5.6-Terra** | Older-generation balanced model for straightforward work | Everyday implementation and maintenance with a balance of speed and depth |
| **GPT-6-Astra** | Frontier intelligence for the most demanding work | Ambiguous, difficult, or high-impact tasks that benefit from deeper reasoning |

These labels are catalog descriptions, not a promise that one model is always faster or more accurate in every situation. Context size, task type, tools, and the quality of the prompt all affect the result.

## What reasoning effort changes

Reasoning effort is a dial within a model family. Lower effort generally favors quicker responses and lighter analysis. Higher effort gives the model more room to examine alternatives, trace dependencies, and check a complicated plan. It can increase latency and usage, so it is usually unnecessary for a tiny, well-scoped change.

The four models share **low**, **medium**, **high**, and **xhigh**. Their catalogs also show **max** for all four, and **ultra** for Sol, Terra, and Astra. Luna's listed range ends at max. This article focuses on low through xhigh, which is a useful progression for most coding sessions.

### Low

Choose **low** for bounded requests with an obvious outcome: explain a small function, make a mechanical rename, adjust a short snippet, or draft a concise message. It is the speed-oriented choice when extensive planning is unlikely to change the answer.

### Medium

Choose **medium** as the everyday setting. It gives the model room to understand a normal feature request, inspect a few related files, or fix a straightforward bug without spending as much effort as a deeply nested investigation.

### High

Choose **high** when a task crosses several files, has meaningful edge cases, or needs careful tradeoff analysis. Examples include diagnosing a subtle regression, designing an API change, or reviewing a migration plan.

### Xhigh

Choose **xhigh** for unusually demanding work: a hard-to-reproduce bug, a broad architectural decision, or a change where a missed interaction could be costly. It is a request for deeper analysis, not a substitute for tests, code review, or checking the evidence.

## Comparing the models at each level

The effort setting and the model family answer different questions. The family chooses the model's general capabilities and speed profile; effort sets how deeply that model should reason on this request. A useful way to choose is to pick the family first, then raise effort only as the task warrants.

| Effort | Sol | Luna | Terra | Astra |
| --- | --- | --- | --- | --- |
| **Low** | Quick workhorse response for clear tasks | Best fit when a quick, lightweight response is the priority | Fast pass on a straightforward task | Fast pass using the frontier-positioned family; keep the task small to avoid unnecessary depth |
| **Medium** | General-purpose coding and explanations | Routine work with an efficiency-oriented profile | Balanced setting for day-to-day implementation | A capable default when you want Astra's profile without asking for deep analysis |
| **High** | More careful handling of multi-step work | More analysis while retaining Luna's efficiency-oriented positioning | Extra care for moderate complexity and edge cases | Strong choice for complex tasks that need careful exploration |
| **Xhigh** | Deeper analysis for difficult work | Deepest setting in this comparison for Luna; useful when its speed-oriented profile is still preferred | More thorough reasoning for a difficult implementation or investigation | Best aligned with Astra's positioning for demanding reasoning tasks |

The table describes how to think about the combinations, not measured rankings. For example, xhigh Astra is not automatically the right choice for every coding request, and low Luna is not limited to trivial work if the request is clear and well constrained.

## A simple selection workflow

1. **Start with the task.** If it is short and explicit, use low or medium. If it spans components or has uncertain causes, consider high.
2. **Pick the family by your priority.** Favor Luna when a quick, efficient interaction matters; use Terra for straightforward balanced work; choose Sol as a general workhorse; reserve Astra for work that benefits from its demanding-task positioning.
3. **Increase effort when the reasoning is the hard part.** Use xhigh for complex analysis, not just because the task is important or long.
4. **Verify the result.** Run the relevant tests, inspect the diff, and confirm assumptions against the repository. More reasoning does not replace these checks.

## Takeaway

For many everyday coding requests, **medium** is a good place to start, with Luna or Terra when speed and routine work are central and Sol as a general workhorse. Use **high** when there are several interacting concerns, and **xhigh** for the hardest investigations or design decisions. Astra is positioned for demanding work, but the best choice still depends on the task and should be judged by the result—not by the model name or effort label alone.
