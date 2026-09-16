---
title: 命令行小工具集
description: 一组解决日常重复劳动的 shell 脚本，从整理文件到批量压缩图片。
startDate: 2025-11-01
endDate: 2026-03-20
status: archived
stack: ['Bash', 'Python']
repo: https://github.com/yourname/tools
order: 2
---

一个存放日常小脚本的仓库。都是些十几行到几十行的东西，解决的问题小到不值得单独开项目，但积少成多确实省了不少时间。

## 里面的东西

- `img-shrink`：递归压缩目录里的图片，保留原图备份
- `mkpost`：生成带 frontmatter 的文章模板文件
- `git-sweep`：清理已经合并的本地分支
- `port-who`：查某个端口被哪个进程占用

## 体会

写脚本最大的收获不是省下的那点时间，而是**强迫自己把常见操作流程化**。一个操作如果每次都要临时想命令，说明它值得被写成脚本。

## 为什么归档

这些脚本现在基本都被更好的方案替代了：图片压缩和文章模板直接放进了博客仓库的 npm scripts，分支清理用上了 git 自带的配置。原仓库留着当参考，不再维护。
