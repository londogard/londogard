---
title: "TIL: Multiple Git Remotes"
description: "Some instructions on how to use multiple remotes"
categories: [TIL]
date: "2024-02-18"
---
It is really simple actually. Simply call the following command:

`git remote add <ALIAS> <GIT_URL_SSH>`

To then push it is as simple as `git push <ALIAS>`.

I use this to keep my repository in HuggingFace Spaces and GitHub at the same time.

That's it!