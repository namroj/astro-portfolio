---
title: Guard pattern
author: Jorman Espinoza
description: "Guard pattern simplifies and improve code reading!"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "The Astro logo on a dark background with rainbow rays."
pubDate: 2025-03-23
tags: ["java", "desing-patter", "guard", "clean-code"]
draft: false
---

```java
public boolean legalAge(int age) {
    if (age <= 18) {
        return false;
    }
    return true;
}
```
