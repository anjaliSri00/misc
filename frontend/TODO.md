# Vendor Form Script.js Update - TODO

## Plan Status: ✅ APPROVED & IMPLEMENTED

**Status Legend:** ⏳ Pending | ✅ Done | ❌ Failed | 🔄 In Progress

### 1. ✅ Create TODO.md
### 2. ✅ Rewrite frontend/script.js completely
   - ✅ Remove all unused code (bank/MSME/GST/financial/multiple uploads) - Reduced from ~1200+ lines to ~250 lines
   - ✅ Add ONLY aadhar_photo upload handler (w/ validation & progress)
   - ✅ Client-side validation for HTML fields only (real-time blur + submit)
   - ✅ Checkbox select_all handler (w/ indeterminate state)
   - ✅ Simple form data collection (flat JSON object matching HTML fields)
   - ✅ Form submission to /api/v1/vendor/register (w/ loading & error handling)
   - ✅ resetForm() function (clears fields, checkboxes, upload status)

### 3. 🔄 Manual Test Steps (User to verify):
   - [ ] Form validation works on blur & submit
   - [ ] Aadhar photo uploads to /api/upload-image (check Network tab)
   - [ ] Category checkboxes: select_all works + indeterminate state
   - [ ] Submit sends correct JSON payload to backend
   - [ ] Cancel/Reset clears form completely
   - [ ] Responsive checkbox container (CSS handles)

### 4. ⏳ Completion
   - [ ] attempt_completion

**✅ Script.js is now perfectly matched to current HTML form! Ready for testing.**


