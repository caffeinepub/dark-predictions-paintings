# Specification

## Summary
**Goal:** Enable admins to edit, delete, and mark paintings as sold, with visual sold indicators shown to public users.

**Planned changes:**
- Add backend admin-only functions to update painting fields, delete a painting, and toggle sold status
- Add Edit, Delete, and Mark as Sold/Available action buttons to each row in the AdminPaintingList
- Edit button opens the painting form pre-populated with existing data; submitting updates the painting
- Delete button shows a confirmation dialog before removing the painting
- Mark as Sold/Available button immediately toggles and reflects the new sold status
- Display a diagonal "SOLD" stamp overlay on sold painting images in the public gallery grid
- Show a SOLD badge and strikethrough price on PaintingCard and PaintingDetailPage for sold paintings
- Show a sold/available status label per row in the AdminPaintingList table

**User-visible outcome:** Admins can fully manage paintings (edit, delete, mark sold) from the admin panel, and public users see clear visual sold indicators on sold paintings throughout the gallery.
