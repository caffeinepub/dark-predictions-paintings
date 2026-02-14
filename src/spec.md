# Specification

## Summary
**Goal:** Update “Dark Predictions Paintings” to be a premium gallery site with no auctions, a direct email-based purchase contact flow, and an authenticated admin dashboard to manage paintings.

**Planned changes:**
- Remove auction/bidding features entirely (UI, routes, copy, backend endpoints, and data models), including any user registration for bidding.
- Build a public gallery: home/gallery page listing paintings from the backend and a painting detail page showing title, description, price, image(s), and purchase contact email.
- Display “offgridsecrets@gmail.com” prominently on painting listings and detail pages with a mailto: call-to-action for purchase inquiries.
- Add a public mission statement section explaining proceeds support building and developing affordable modern housing for the local community.
- Implement an admin dashboard to create/edit/delete paintings (title, description, price, image(s)) and display “offgridsecrets@gmail.com” in the admin UI.
- Add Internet Identity authentication for admin access and restrict backend create/update/delete methods to configured admin identity/identities.
- Apply a cohesive, premium dark/noir gallery theme across public and admin pages, avoiding a blue/purple primary palette.

**User-visible outcome:** Visitors can browse paintings and click an email link to contact the seller to purchase; admins can sign in with Internet Identity to manage painting listings in a consistent premium gallery-styled dashboard.
