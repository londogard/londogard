---
description: "'The Badass Runtime Plugin' is a plugin that allows you to package a stripped down JRE and modules from your program into a 'native' installable program which doesn't require the user to have Java installed. It takes help of JPackage & JLink to achieve this, my own small program ended up at 35 MB including JRE, which is pretty crazy. This is like Electron, but better! ;)"
categories: [jvm, TIL]
title: "TIL: 'The Badass Runtime Plugin', jpackage & jlink - create a 'native' installable executable from your JVM-app that isn't huge"
author: Hampus Londögård
date: "2020-09-03"
---
# JPackage, JLink and how to pack a modern Java App
JPackage is a way to package a modern JVM-program as a installable binary, in a small format.
<!--truncate-->

### What
JPackage was finally included in the JDK by JDK-14, originally from the JavaFX-world (to bundle your desktop apps).
JPackage combines itself with JLink, which builds upon '[project jigsaw](https://openjdk.java.net/projects/jigsaw/)', and together they form a way to create \"native\" binaries for JVM-projects.

#### What is JLink?

[JLink](https://docs.oracle.com/javase/9/tools/jlink.htm) is a way to assemble and optimize a set of modules and their dependencies into a custom runtime image (JRE). 
In other words we can take a ordinary JRE, ~200 MB, and chop it down to a total size of 25-40 MB for smaller project.

JLink is only possible thanks to 'project jigsaw' which introduced modules and modularized the whole JRE starting from JDK-9. The Java standard library (stdlib) was modularized into 75 modules.
As you might guess it is even better if your own code is also modularized, but not enforced.

#### What is JPackage

 JPackage is the packaging suite that allows you to package your code, dependencies and the JLink-created JRE. I ended up with installation files, with a natively executable file on 60 MB for one of my smaller projects, which is really good in comparison to Electron!
In comparison to a C-program this might not be amazing, but you've to remember that this is completely cross-platform!

_Side-note_ all sized discussed is without any major optimizations - and there exists a lot! Finally, if you exclude the JRE you can reach sizes of KB rather than MB! But excluding the JRE enforces the user to have it locally, which might not be good UX.


### How
JPackage & JLink is made easy thanks to [The Badass Runtime Plugin](https://badass-runtime-plugin.beryx.org/releases/latest/) or [The Badass JLink Plugin](https://badass-jlink-plugin.beryx.org/releases/latest/) where the latter require a modular project and the former works with any project! :happy:

#### Installation

Make sure you use & target JDK 14 or higher, JPackage was first included in this version. I recommend SDKMan to install & swap JDKs.

Then to add the `Badass Runtime Plugin` I recommend using `gradle`, which makes it as simple as the following.

```kotlin
plugins {
    ...
    id(\"org.beryx.runtime\") version \"1.11.3\" // latest version August 2020
    ...
}
runtime {
    options.set(listOf(\"--strip-debug\", \"--compress\", \"2\", \"--no-header-files\", \"--no-man-pages\"))
    jpackage {
        installerType = \"deb\" // https://badass-runtime-plugin.beryx.org/releases/latest/
    }
}
```

This addition now creates the tasks required to build & bundle your app. The options added make sure that you reduce the total size by _a lot_.
I highly recommend reading the documentation, there's so many incredibly useful options - I only provide the minimum!

#### Usage

By editing our `building.gradle.kts` to include everything from the [Installation](#Installation) we can run the `./gradlew jpackage` task to build our installer! 

I want to note again, please make sure to read the homepage - a ton of optimizations and customization exist. There exists a lot of low hanging fruit for sure, so make sure to grab it! :wink:


### Why
It's really cool to see your JVM application installable using a `.msi`, `.deb` or even a `.dmg` while retaining a decent enough size.
By using JPackage rather than GraalVM you make sure that you don't loose anything in the form of performance or functionality. As a cherry on the top, it's not just a executable file, but also includes a installer which is much better UX in my opinion. GraalVM will be discussed a bit more in [Alternatives](#Alternatives).

I want to re-iterate about the UX and size, which are the two main points of this.

1. We bundle a JRE with the JVM-app, allowing executables without requiring Java, of your version, to be installed on the user computer already.
2. The JRE is minified to only contain required modules, about 30-40 MB on a smaller project.
3. All required dependencies are bundled also
4. Installer which makes the whole JVM program really like any program on the computer 
5. Basically a download, install run program that isn't huge in size!
 
### Alternatives
I see two alternatives that are worth mentioning

1. FAT-JAR / Uber-JAR / Shadow-JAR 
2. GraalVM Native Image

#### \"Fat-JAR\"
A FAT-jar is a jar that bundles all dependencies and also includes a shell script, or `.bat` if Windows, to run the whole JVM-application. 
It's pretty small in size, even though called FAT, as it doesn't include a JRE to run the JVM.

This means that if your JVM-app requires Java 11 but the user only has Java 8 you need to have them download the JRE required, which sucks.

 #### GraalVM
 The probably best alternative, it's even smaller in size as SubstrateVM (their runtime) is really small and GraalVM allows AOT compile.
 
 GraalVM has _much_ faster startup-times than a JPackage program, but GraalVM is not as good when running for a long duration as there isn't the incredibly good JIT from JVM.

I'd say something along the following - for long running apps choose JPackage, for lambda etc certainly choose GraalVM.

But GraalVM has further negatives, you can't just code as you usually do. Reflection etc is not supported as usual, meaning there comes a lot of caveats using GraalVM.

_Extra:_ I managed to end up with, after some minor trial-and-error, a binary file on ~ 12 MB for my file-sending program - pretty darn amazing!

  _I'll write more about GraalVM and its SubstrateVM which is used to create the native binaries in a new TIL._

-Hampus Londögård