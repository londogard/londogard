---
title: "Resizing Images: PIL, cv2 and scikit-image"
description: "**TL;DR** Using PIL.resize with LANCOZ and `reducing_gap=2` has some really high speeds and good results all in all, we're talking _multiple magnitudes_ faster."
categories: [python, cv]
date: "2025-09-03"
---

ℹ️ This is a really small piece of "nothing", but it might save you (and future me) some time!

---

Recently I started playing around with [scikit-image](http://scikit-image.org/) library which is really cool. I found that they had a decent resizing tool, but diving deeper it actually turned out to be **really slow**.  
I'd even go as far as to say that the anti-aliasing (AA) of scikit-image might be too agressive, but you can tune it luckily.  
In comparison PIL seems really performant with sane defaults, while OpenCV is a bit low-level and requires a manual gaussian filter to achieve good results.

This is likely not a bottleneck in anyones pipeline, but I love bags of freebies  and when running a server on a Raspberry Pi it's always nice to have some extra performance.

## Quick benchmarks:

> Please note that this benchmark is not scientific, it's a simple `timeit(number=100)`, but it's quite telling anyhow!

|Mode|Timer|Person|Chess Board|
|-|-|-|-|
|Original|N/A|![94dbe4f6-7765-40d5-8dec-46cf479a2aea.jpg](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/94dbe4f6-7765-40d5-8dec-46cf479a2aea.jpg)|![](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/ffa23487-4156-4fb5-a8dd-12e0a4eaad0a.png)|
|PIL.resize(LANCOZ, reducing_gaps=None)|9.18|![2277afbe-3a8b-4380-8a01-f4eff080f7b0.png\|160.03750610351562](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/2277afbe-3a8b-4380-8a01-f4eff080f7b0.png) |![ec46b283-7c5b-4cef-ac33-e7c02cc79d9f.png\|441.0375061035156](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/ec46b283-7c5b-4cef-ac33-e7c02cc79d9f.png) |
|PIL.resize(LANCOZ, reducing_gaps=2)|**0.0003**|![b1959e2a-9ee3-47b0-8c94-42cf8a6eec84.png\|165.03750610351562](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/b1959e2a-9ee3-47b0-8c94-42cf8a6eec84.png) |![4b5441bb-fa02-478d-a9f8-1c709d63fd13.png\|441.0375061035156](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/4b5441bb-fa02-478d-a9f8-1c709d63fd13.png) |
|ski.resize(aa=True)|69.15|![8f9ab362-866b-42a4-9bd1-282f36240684.png\|167.03750610351562](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/8f9ab362-866b-42a4-9bd1-282f36240684.png) |![188cf8f3-d157-4034-98cb-b81c68fa02a0.png\|441.0375061035156](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/188cf8f3-d157-4034-98cb-b81c68fa02a0.png) |
|cv2.resize(INTER_AREA)|5.88|![0d26dab6-389b-48e1-b354-d62deb862ae3.png\|168.03750610351562](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/0d26dab6-389b-48e1-b354-d62deb862ae3.png) |![](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/9693c723-e405-4db6-ba7c-c7716a2291c6.png) |
|cv2.resize(LANCOZ + GaussBlur)|4.25|![1747bfaa-bf53-455d-ba32-f3535bf8585f.png\|174.03750610351562](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/1747bfaa-bf53-455d-ba32-f3535bf8585f.png) |![](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/3a715f42-ff02-465e-bca8-4290c16eeb3d.png) |
|cv2.resize(LANCOZ)|0.033|![a8fa7498-da6c-4881-93fe-a34697b961e1.png\|178.03750610351562](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/a8fa7498-da6c-4881-93fe-a34697b961e1.png) |![](https://images.amplenote.com/8a41f494-8709-11f0-a85e-7b379051e4bb/fb425821-e7a3-4e0c-8b77-11c66dc32245.png) |


~Hampus Londögård