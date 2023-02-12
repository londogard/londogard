---
description: SDKMan is a tool to make JDK swapping, and installation, simple. It's really good!
tags: [jvm, TIL]
title: "TIL: SDKMan - The Software Development Kit Manager"
date: "2020-09-04"
author: Hampus Londögård
---
# SDKMan - Swapping JDK made simple
I've decided to not only write blogs but also small snippets, here comes the first one.
<!--truncate-->

### What
[SDKMan](https://sdkman.io/) is a tool to install, set and swap JDK.  
SDKMan actually supports more than the Java JDK, among supported tooling is Java, Groovy, Scala, Kotlin and Ceylon. Ant, Gradle, Grails, Maven, SBT, Spark, Spring Boot, Vert.x and many others also supported.  

It's written in Bash, only requires curl & zip/unzip.

So what SDKMan simplifies is
1. Installation of different JDKs, Gradle versions and so on
2. Swapping between JDKs
3. Allowing local (by folder basis) JDK-versions


### How
We start by installation
#### Installation
If you need a more detailed guide go to [this](https://sdkman.io/install) page.  
**Downloading SDKMan**  
`$ curl -s \"https://get.sdkman.io\" | bash`

**Installing**
`$ source \"$HOME/.sdkman/bin/sdkman-init.sh\"`

**Verification**
`$sdk version` - should return something along `sdkman X.Y.Z`

#### Usage
| What                     | Command                                                             | Comment                                                                             |
|--------------------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| Install JDK              | `$sdk install java`                                                 | Installs the **latest stable** version of Java JDK                                  |
| Install specific version | `$sdk install scala 2.12.1`                                         | Install scala 2.12.1                                                                |
| Install local version    | `$sdk install groovy 3.0.0-SNAPSHOT /path/to/groovy-3.0.0-SNAPSHOT` | Installs a JDK you have locally to the SDKMan. The version name **must** be unique! |
|Remove version|`$sdk uninstall scala 2.11.6`
|List candidates|`$sdk list java`|Lists all java candidates that are installable through SDKMan|
|Use version|`$sdk use scala 2.12.1`|Use the version said, this **only changes the current shell**|
|Default version|`$sdk default scala 2.11.1`|Changes version for all subsequent shells|
|Current version|`$sdk current`|Lists all currently selected versions|

Remember to point your JDK to the `./sdkman/candidates/java/current` path. Do the same for your IDE, such as IntelliJ-IDEA.

### Why
I've got different projects where I need to use different java versions. In one project I need JDK 14 to include `jpackage` and another one I'm forced to use JDK 8 (legacy system), to swap between these has never been simpler!


### Alternatives
[jEnv](https://www.jenv.be) is a great alternative. According to some more JDK versions exists (haven't checked myself), but overall it seems that SDKMan is the preferred alternative.  
Looking at GitHub one can clearly see that SDKMan is more popular, both by stars, latest commit and forks - which should be a decent enough to make a choice.

One thing I've learned both through work and my personal projects is that often it's better to make an non-optimal decision rather than trying to find the perfect solution, because diving into the pile of research to perfection will take much more time than just getting started.

-Hampus Londögård
