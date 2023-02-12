---
description: "GitPod is a Cloud IDE where you can run everything from Kotlin to Python/JS. In this TIL how to launch native programs and more is shown in the GitPod IDE."
tags: [jvm, kotlin, TIL]
title: "TIL: GitPod - your editor in the cloud"
authors: hlondogard
date: "2021-01-21"
---

# TIL: GitPod - your editor in the cloud

[GitPod.io](https://gitpod.io/) is a editor in the cloud based on [Theia](https://theia-ide.org/) which is a IDE built for the cloud & desktop. 
It implements the same language servers and allow you to use the same extensions as in VS Code - which is great. 
<!--truncate-->

<img src="https://user-images.githubusercontent.com/7490199/105518849-0bc43a00-5cd9-11eb-9842-813d8f1b5735.png" alt="gitpod" width="50%" height="50%"/>

For more about GitPod and how to combine it with languages such as Kotlin, Java & more, read 👇.

### What

[GitPod.io](https://gitpod.io/) from the start worked for the normal "low-barrier" languages such as JavaScript & Python and still works great, and it really is where it excels. 
Lately though they've stepped up and added more & more targets with further customization. 

You can now:
- Customize your docker build by installing new packages (through `brew` or `apt install`).
- Customize your extensions (majority, if not all, from VS Code available)
- Add VNC (see native desktop programs)
- Prebuilt containers (save a lot of time to not rebuild everything each time)
- ... & more

With a free account you get 50h / month of time to use this (as of 2021-01-22), which is very kind of GitPod!

### How

First of all you need either a GitHub, GitLab or Bitbucket account. Once that is done you need to find a repository that you want to work on, it can be both a private or public repository. 

Once you've got your account & repository set up then head to gitpod.io/#{Repository: e.g. https://github.com/londogard/snake-js-jvm-native} and it will open up. 
This will ask you to create a PR with some new config adding a new file called `.gitpod.yml` and further you can add `.gitpod.Dockerfile` which configures your Docker setup. 

**Setting up `.gitpod.yml`:**  

```yml
image:
  file: .gitpod.Dockerfile # OBS: only use this if you have a custom image

# List the ports you want to expose and what to do when they are served. See https://www.gitpod.io/docs/config-ports/
ports:
  - port: 3000
    onOpen: open-preview

# List the start up tasks. You can start them in parallel in multiple terminals. See https://www.gitpod.io/docs/config-start-tasks/
tasks:
  - init: ./gradlew clean build

vscode:
  extensions:
    - random.extension # (automatically added by adding extensions through interface). 
```

**Setting up `.gitpod.Docker`:**  

```
FROM gitpod/workspace-full-vnc  # For NoVNC to work

USER gitpod

RUN sudo apt-get -q update && \
    sudo apt-get install -y libgtk-3-dev && \ # For NoVNC to work
    sudo apt-get install -yq gcc-multilib && \
    sudo apt install -y libtinfo5 && \ # For Kotlin Native to work
    sudo rm -rf /var/lib/apt/lists/*
```

With this setup you can push the changes to your repo and re-open the GitPod to reload a brand new Docker image with the updated packages.  

This configuration allows you to do all I've mentioned such as running Native Kotlin, run with VNC to view native application windows and more!  
By default you're able to view a in-place/preview browser window so doing web development is working from the get-go and as such also Kotlin/JS worked pretty well without any configuration.

If you're wondering, the NoVNC is on port 6080.

### Why
For me there's actually not just one reason to why I'd like to do this.

1. Be able to do some quick coding / reviewing on my tablet.
2. Workshops at AFRY (no installation required for users)

Just in a few days (2021-01-26) I'll do a workshop at AFRY with Kotlin Multiplatform where GitPod.io will be a great alternative for colleagues who have computers 
where they're not allowed to install their own applications.

### Alternatives

- [GitHub Codespaces](https://github.com/features/codespaces) is coming, but is still in a private BETA.
- VS Code Remote (**obs** this actually require your own computer somewhere to host the vs code server)

I think for now GitPod.io is the simplest and best out of them, unless you have your own computer to use as a server for VS Code Remote!

Thanks  
Hampus
