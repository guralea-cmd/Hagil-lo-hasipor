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

## Direction as of 2026-08-23 (leaning, not locked)

Leah rejected the manual/per-person approach once she thought about scale - if ~100-150 people end up getting a voucher, sending each one by hand (even a one-click "message prepared, you press send") is "a whole saga" for her. She also doesn't want to rely on BuyMe's own site/dashboard to do the sending. This points toward **full automation (WhatsApp Business API, no manual step per recipient)** as the only realistic option at that volume - the semi-automated "Claude drafts it, Leah clicks send" idea doesn't scale for her. Not yet formally locked as the decision, but it's the direction she's leaning after hearing the tradeoff.

If this gets built: same shape as the existing Facebook Graph API / Metricool setups (business account verification, message template pre-approval through Meta, credentials stored the same gitignored-secrets-file way as `.claude/skills/facebook-teaser/secrets.json`) - a real one-time setup investment, not a quick add.

## WhatsApp Business API - what setup actually requires (researched 2026-08-23)

Confirmed against Meta's own developer docs (`developers.facebook.com/documentation/business-messaging/whatsapp`) plus current third-party setup guides - not guessed:

1. **A dedicated business phone number.** Must be able to receive an SMS/voice OTP for verification, and must NOT currently be active on the regular WhatsApp or WhatsApp Business consumer app (delete it from there first if it is). Can be a new number or a landline. **This is Leah's decision/action - she needs to pick or get a number.**
2. **Meta business verification.** Upload official business documents (Israeli business registration/tax ID, proof of address) through Meta Business Manager. Takes roughly 2-10 business days. Without this, sending is capped at 250 conversations/24h - fine to start, but worth doing properly given the 100-150 recipient scale here.
3. **A WhatsApp Business Account (WABA)** created inside a Meta Business Portfolio - can likely reuse the same Meta developer app already set up for Facebook publishing (**"Hagil Lo Hasipur", App ID `1635110611525724`**, see [[project_facebook_teaser_no_connector]]) by adding the WhatsApp product to it, rather than starting from zero.
4. **Message template pre-approval.** The actual voucher message text needs to be submitted to Meta and approved before it can be sent (category: likely "Utility," since it's a post-approval reward notice, not marketing). Approval is separate from business verification and needs the final Hebrew wording decided first.
5. **Recipient opt-in.** Meta requires people receive template messages only after opting in with clear disclosure of the business name/intent - the story-submission form's existing consent checkbox (register.html) likely needs a line covering this specifically; needs review once the flow is designed.
6. **API credentials once approved:** an OAuth access token, the WABA ID, and a phone number ID - same secrets-file pattern as `metricool-secrets.json`/`secrets.json` (gitignored).

**Realistic timeline: 1-2 weeks**, mostly waiting on Meta's verification and template approval, not build time.

Sources: [Meta for Developers - About the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/about-the-platform), [WhatsApp API Prerequisites (Wati)](https://www.wati.io/en/blog/whatsapp-api-prerequisites/), [WhatsApp Business API 2026 Guide (Message Central)](https://www.messagecentral.com/blog/whatsapp-business-api-complete-guide)

## Decided so far (2026-08-23)

- **Delivery mechanism: full WhatsApp Business API automation**, not manual sending and not through BuyMe's own site - Leah ruled out manual (100-150 recipients is "a saga" for her) and doesn't want to use BuyMe's own dispatch.
- **Dedicated business phone number supplied and stored** in `.claude/skills/story-reward-vouchers/secrets.json` (gitignored, never commit - this repo is public). Number is unregistered anywhere else, reserved for this WhatsApp-only, no calls.

## Next step - PAUSED, waiting on Leah to resume (2026-08-23)

She asked to pause here and come back when she has time - **don't proceed on your own, wait for her to say go.**

When she resumes, the next action is: verify the number with Meta (one-time SMS/voice OTP) and add the WhatsApp product to the existing Meta developer app ("Hagil Lo Hasipur", App ID `1635110611525724`) rather than creating a new app from scratch.

Still open/undecided, revisit when picking this back up:
1. Preview of available BuyMe gifts beforehand - yes or no? (not yet decided)
2. Does the BuyMe purchase (15,000₪ / ~100 vouchers) already exist, or does generating individual voucher codes still need figuring out?
3. Exact Hebrew wording for the WhatsApp message template (needed before Meta template approval can even be submitted).
