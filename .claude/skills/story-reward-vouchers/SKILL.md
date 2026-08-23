---
name: story-reward-vouchers
description: Idea (not yet designed/built) for giving approved community-story tellers a 150₪ BuyMe gift voucher (sport category), funded from a ~15,000₪ budget Leah is spending on BuyMe. Use whenever asked about BuyMe, story rewards/gifts, or thanking approved storytellers.
---

# Story reward vouchers (BuyMe) - EXPLORATORY, not yet designed

## Status: raised 2026-08-23, still undecided - do not build yet

Leah raised this idea in chat (2026-08-23) but explicitly said she doesn't yet know how she wants it to work ("אני לא יודעת עוד מה לעשות"). This file exists so the idea itself isn't lost, not because there's an agreed plan to implement.

## The idea, as she described it

- She's buying ~15,000₪ worth of gift vouchers from **BuyMe** (buyme.co.il), all in the "sport" category.
- Each person whose community story is approved and goes live on the site (per the existing `story_submissions` approval flow, see `stories.html`/`register.html`) should get a **150₪ BuyMe voucher** as a thank-you.
- **Hard requirement she was clear about:** the BuyMe link/voucher must only reach someone *after* their story is actually approved and live - never before, never during submission. She was explicit that someone who hasn't been approved gets nothing.
- **Open, undecided:** whether to also let the person preview which specific gifts/products are available on BuyMe before they redeem, or just hand them the voucher and let them choose freely on BuyMe's own site. She raised it as a question, not a decision.
- **Open, undecided:** the actual delivery mechanism - how does an approved person receive their link. Not specified by her yet.

## Claude's read on the delivery-mechanism question (recommendation, not yet approved)

The site has no login/account system - `story_submissions` docs aren't tied to a way for a visitor to "prove" they're the approved person on a public page, so a fully automated "your gift is here" flow would need real new infrastructure (auth, or a unique per-story claim link/token). That's a real build, not a small tweak.

The simpler path: every story submission already collects a phone number (see `register.html`'s form fields). When Leah approves a story in the admin flow, she (or a scheduled skill, later) sends the BuyMe voucher **directly to that phone number** (WhatsApp/SMS) as a personal thank-you - no new site feature needed, works immediately, and keeps her in full control of timing and eligibility. A public/automated on-site claim flow could be a later upgrade once volume justifies the engineering, but isn't needed to start.

## Next steps (waiting on Leah)

Before building anything:
1. Does she want the simple manual/phone-based approach above, or does she want something automated on the site?
2. Preview of available gifts beforehand - yes or no?
3. Does the BuyMe purchase (the 15,000₪ / ~100 vouchers) already exist, or is generating individual voucher codes part of what needs figuring out?

Don't propose a specific technical build until at least question 1 is answered.
