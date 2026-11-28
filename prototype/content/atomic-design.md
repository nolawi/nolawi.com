---
title: How small components become a design system
description: An atomic design walkthrough with a working component directory, my
  Slides.com talk, and an example from Delano.
format: Essay
topics:
  - design-systems
  - accessibility
featured: false
demos:
  - id: dPWQWXJ
    title: Design systems playground
    height: 790
afterDemo: I’d reuse the filter if another screen needed the same job done. If
  that screen needs a different layout, I can still reuse the field and button.
  That’s the part I like about atomic design. I can choose how much of the
  pattern to carry forward.
---

When I’m building a screen, I like to ask which parts I’ll need again on the next one. A button is an easy answer. Then I notice I’m using the same label, input, and button together in a few places. That’s where I start asking whether the whole group should be reusable.

I gave a talk on [building a design system the atomic design way](https://slides.com/nolawipetros/deck-3). Here’s a small version you can play with.

## Put the pieces together

Start with a label, a field, and a button. Those are the atoms. Put them together and you have a filter with one job. That’s the molecule. Add a heading and results, and now the whole directory is an organism. A template gives that directory a place in the page. A page lets me check what happens when it has real content, including long names and zero results.

[[illustration:atomic-assembly]]

[Brad Frost’s atomic design chapter](https://atomicdesign.bradfrost.com/chapter-2/) goes through all five levels.

## Where this showed up in my work

[Delano](delano.html) was my Angular UI kit. I wanted teams to have a place to start when they built another screen. Say two teams use the same text field. I want the label and focus behavior to feel familiar in both apps. One team can search a directory and the other can filter a table. The pieces are still doing the same jobs.

[[illustration:atomic-reuse]]

## Try assembling it

Start with the separate pieces, then watch the same controls become part of a working directory. At the last step, search for “alert.” Then try something that isn’t in the directory and see how it handles zero results.
