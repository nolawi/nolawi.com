---
title: "When your app gets a chat interface"
description: "Try a Records Explorer that lets chat and filters work on the same table, with a confirmation step before changes."
format: "Essay"
topics: ["ai-integration","accessibility","user-experience"]
featured: true
demos: [{"id":"ogWQBPv","title":"Records Explorer","height":760}]
afterDemo: "If the chat gets me to the right row faster, I’ll use it. If I’m comparing several rows, I’ll probably go back to the table. I want the app to let me do both without making me start over.\n\n[Where Does Chat Belong in the Interface?](https://medium.com/@nolawi/where-does-chat-belong-in-the-interface-47c22c1e0ce3) on Medium goes deeper into when I’d reach for chat and when I’d click."
---

If I ask an app which requests are open, I want to see the rows it found. I might need to open one, check what’s going on, and get back to work. The reply gets me oriented. Then I need somewhere to go.

That’s the part of adding chat to an app I keep thinking about. We spend a lot of time on the answer. What can someone actually do with it?

## I’d keep the table

Say I’m looking for open requests in North. If I know where the filters are, I’ll use them. If I’m new to the app, I might just type “Show open records in North.” Either way, I should land on the same rows. If I meant South, let me change the filter right there.

In a real app, I’d have the model ask the app for those records. The server would check the filters and the user’s permissions, then fetch the rows through the same API the table uses. The reply can show its work in plain language. “I looked in North for open requests. Here are the two I found.” Then give me both links.

[[illustration:chat-source]]

## What if the record doesn’t say?

Say I open a request and ask why it’s still open. The row might only tell us the status. I’d show what the record says and say the reason isn’t recorded. Same thing if I ask what a repair costs and there’s no cost field.

I’d also try the whole thing with a keyboard. Can I submit a question, hear the reply with a screen reader, get to the source row, and find my way back? That’s the kind of test I’d run before shipping it.

## Show me the change first

If I ask to move record 104 to Under review, I want to see the record number, its current status, and the proposed change before I confirm. Cancel should leave the record where it was. If I do confirm, show the saved status on the record. With the Open filter still on, that row should drop out of the results.

[[illustration:chat-confirm]]

## Try it here

Set Region to North and Status to Open. Clear the filters and ask “Show me all open records in the North region.” Both ways land on records 101 and 104. Then open 104 and try requesting a status change. Cancel once, then try again and confirm. The demo uses fictional records and scripted responses, and changes reset on reload.
