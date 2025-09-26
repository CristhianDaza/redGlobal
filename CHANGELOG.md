# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Got you, Cris. I reworked everything into a clean, English-only **CHANGELOG** (no dates), grouped, de-duplicated, and with consistent tone and formatting.

---

# [1.7.1] - 25/09/2025
### ♻️ Changed
- Carousel replaced with a custom implementation for better control and customization.
- Removed colors from admin icons.
- Fixed propagation of the main button.
- Removed download button from catalogs.
- Removed description from the product call modal.
- Changed the title of our clients section.
- Improved API calls.

## [1.7.0] - 23/09/2025

### 🚀 Added

* **Admin Styling Modernization (Global)**

  * Unified visual system across all admin sections with consistent headers, cards, badges, spacing, rounded corners, shadows, and responsive grids.
  * Shared UX patterns: clear hierarchy, semantic colors, informative empty states, hover feedback, and mobile-first layouts.

* **Admin Sections – Visual Overhauls**

  * **Users** (`/src/components/Admin/sections/UsersSection.vue`): descriptive header, gradient stat cards, avatar table with role/status badges, full responsiveness.
  * **Categories** (`…/CategoriesSection.vue`): table → visual card grid, dynamic counters for active/inactive, larger previews, clearer grouping.
  * **Color** (`…/ColorSection.vue`): large preview with overlay, HEX/RGB in monospace, UI samples (buttons/links/badges), theme coverage stats.
  * **Menu** (`…/MenuSection.vue`): auto icons by route type, position badges, internal vs external links, navigation stats.
  * **Catalogs** (`…/CatalogsSection.vue`): gallery cards with large images, overlays, link classification badges, empty state.
  * **Carousel** (`…/CarouselSection.vue`): slide preview, position badges, optional links, playback/link stats.
  * **Our Clients** (`…/OurClientsSection.vue`): logo gallery with grayscale filters, status badges, trust stats.
  * **Advisors** (`…/AdvisorsSection.vue`): contact cards, WhatsApp integration, gradient avatars, support stats.

* **Products Page Modernization**

  * **`/products`**: hero with gradient, live stats for categories/subcategories/products, popular-categories section, and a fully modernized `CategoryList.vue` (dynamic Material icons, interactive headers, smooth transitions).

* **Catalogs Page Modernization**

  * **`/catalogs`**: premium hero, glassmorphism stats, elevated catalog cards with overlays, separate **View** vs **Download** actions, persuasive features section (quality, variety, advisory).

* **Contact Page Modernization**

  * **`/contact`**: structured contact info cards, modernized form (keeps `RgFormField`), improved validation/feedback, success messaging, two-column responsive layout.

* **Search Page Modernization**

  * **`/search`**: descriptive header, results summary card, modern product grid container, improved pagination with icons and contextual info, polished empty/loading states.

* **Mission & Vision Image Management**

  * Admin-only management (role-gated) with Cloudinary storage, drag-and-drop uploads, validation, placeholders fallback, audit trail, real-time updates, and `useGlobalMissionVision` state.

* **Privacy Policy Management**

  * Admin-only PDF management (role-gated) migrated to Cloudinary; strict validation, replacements, audit trail, global state (`useGlobalPrivacyPolicy`), user modal with download and loading states.

* **Code Quality & Performance**

  * TypeScript errors resolved; strict mode passes cleanly.
  * Unused imports/variables removed; duplicate imports consolidated.
  * Enums standardized across the app.
  * `AdminView.vue` and `AdminHeader.vue` cleaned and correctly typed.

* **Enhanced Loading Experience**

  * New global loader (`RgLoaderGlobal.vue`) with multi-layer animations and dynamic messages; updated local loader (`RgLoader.vue`) with concentric rings; responsive and performant.

* **Advisor Role**

  * New `ADVISOR` role with restricted admin scope (quotations only), enforced 0% price increase, disabled logo/color customization, improved role selection UX and automatic field cleanup.

* **Quote Tracking Enhancements**

  * `QuoteStatusHistory` now records `changedByName` and `changedByRole`; full audit trail shown in quote detail.

* **Role-Based Access Control**

  * Router `meta.allowedRoles`, role-aware sidebar, post-login redirection by role, and auth store helpers (`isAdvisor`, `canAccessQuotes`).

* **Centralized Price Formatting**

  * `/src/utils/formatNumber.ts` with `es-CO` locale.
  * Business logic: `calculatePriceWithIncrease`, `calculatePriceWithIva`, `formatPriceWithBusinessLogic`.
  * Validation: `isValidPrice`, `parseFormattedNumber`.
  * Unified display: `$1.095.300` (COP with thousand separators).

* **Quote Detail Page Migration**

  * Route `/admin/quotes/:id`, full-page tabs (Details/Comments/History), unique URLs, real-time history, breadcrumb/back to admin.

* **Advanced Quote Management**

  * Statuses: Pending, In Review, Quoted, Negotiating, Approved, Completed, Cancelled, Expired.
  * Fields: priority, assignees, due dates, estimated/actual values, tags, source, follow-up.
  * Internal/client comments, full audit trail, advanced filters, table & card views, real-time stats, inline edits, CSV export.
  * Firebase integration (caching/logging/errors), `useAdvancedQuotes`, extended `useQuoteStore`, new admin UI & sidebar, docs included.

* **Admin User Enhancements**

  * Hidden users via `isHidden`, last-login tracking with relative time, copy-email action with toasts, admin password reset via Firebase Auth.

### ♻️ Changed

* **Privacy Policy Storage**

  * Fully migrated PDFs from Firebase Storage to Cloudinary; removed all Storage references; modern confirm modals; global state updates.

* **User Management UX**

  * Role selection moved to the top; automatic field cleanup on role switch; better display/validation for advisor restrictions.

* **Admin Navigation**

  * Sidebar adapts to role (Admin vs Advisor); improved breadcrumbs and role-based UI.

* **Price Display Standardization**

  * All product/quotation/modal components use centralized formatting while preserving auth checks, per-user price increases, IVA toggles, stock rules.

* **Advanced Quotes UI**

  * Simplified header and compact action bar; removed obsolete “Complete/Delete” (now on detail page); admin redirects to `/admin?tab=advanced-quotes`; code cleanup.

* **Quote Navigation**

  * Router navigation replaces modal emits; default view: **cards**; “Cotizaciones Avanzadas” renamed to **“Cotizaciones”** (single entry point).

* **User & Auth Normalization**

  * All emails normalized to lowercase; Firestore validations now use Auth UID; comparisons consistently lowercased across app.

* **Quantity Table**

  * Columns reordered: **Estimated Date** before **Last Update**.

### 🛠 Fixed

* **Privacy Policy Flow**

  * Corrected Cloudinary endpoints/params; resolved “Access control – Blocked for delivery” via proper preset; fixed query-param routing to admin tab; live modal refresh; removed leftover Firebase Storage imports; TypeScript fixes.

* **TypeScript & Linting**

  * Fixed `AdminHeader.vue` tab typings; duplicate `QuoteStatus` imports; unused handler params; standardized enum usage; removed stray logs; resolved type inconsistencies across components/composables.

* **Role Handling**

  * Correct role comparisons; form cleanup on role switch; route permissions; auth redirects by role.

* **Quote Tracking**

  * Added missing user info to history; proper attribution on status updates; consistent Firestore doc IDs.

* **Price Formatting**

  * Fixed `$3356` vs `$3.356`; removed browser-dependent locale variance; consolidated logic into utilities.

* **Admin Navigation Consistency**

  * Correct post-login redirect to advanced quotes; navbar admin link; back/error flows in `QuoteDetailView`; hide `AdminHeader` in advanced quotes to avoid duplication.

* **Quote Comments & Status**

  * Fixed quoteID↔docID mismatches; correct subcollection access; auto-reload comments; reliable history saves and cache invalidation; chronological history loading.

* **Advanced Quote Modal**

  * Replaced missing icons (`close` → `cancel`); comment reactivity fixed; ESC to close with cleanup; simplified header; select casting issues resolved; URL-based navigation via `&quoteId=`.

* **Admin Session/Theme**

  * Creating a user no longer swaps sessions (secondary Auth instance); primary color reacts to user changes; admin routing respects `?tab=`; lowercased email comparisons in App, Navbar, Footer, ProductView, QuoteModal, QuoteCart, AdminSidebar, AdminView, and router guard.

### 📁 Touched Files (high level)

* `src/views/ProductsView.vue`, `CatalogsView.vue`, `ContactView.vue`, `SearchView.vue`
* `src/components/Admin/sections/*` (Users, Categories, Color, Menu, Catalogs, Carousel, OurClients, Advisors)
* `src/components/UI/*` (loaders, cards, buttons, badges)
* `src/utils/formatNumber.ts`
* Stores/composables for quotes, auth, mission/vision, privacy policy
* Router meta/guards and admin navigation

## [1.6.0] - 11/09/2025
### Added
- **Enhanced quantity table with estimated date**: Added "Fecha Estimada" column to the product quantity table using existing `dataTracking` field to display estimated arrival dates for products in transit
- **Mobile-optimized quantity table**: Implemented responsive card-based layout for mobile devices that eliminates horizontal scrolling and improves readability on small screens

### Fixed
- **Fixed admin API call frequency issue**: Corrected logic where admin users were calling APIs multiple times per day instead of once daily
- **Fixed timezone-based date comparison**: Modified `getDay()` function to use local timezone instead of UTC for proper daily update validation
- **Optimized admin API calling logic**: Added explicit `shouldUpdate()` check in `App.vue` before calling `callServices()` for admin users
- Admin users now properly respect the once-per-day API update schedule, preventing unnecessary API calls within the same day

## [1.5.0] - 11/09/2025
### Added
- **CataProm API Proxy**: Implemented PHP proxy server to handle CataProm API calls from server-side, resolving IP/URL validation issues when calling from SPA
- **StockSur API Proxy**: Implemented PHP proxy server to handle StockSur API calls from server-side, eliminating CORS issues and external proxy dependencies
- Added `VITE_API_CATAPROM_PROXY_URL` environment variable for CataProm proxy configuration
- Added `VITE_API_STOCKSUR_PROXY_URL` environment variable for StockSur proxy configuration
- Created fallback system in `apiConfig.ts` to use proxy URLs with direct APIs as backup

### Fixed
- Fixed admin automatic daily API refresh functionality
- Corrected `getDay()` function to properly compare full dates (YYYY-MM-DD) instead of just day numbers
- Optimized admin API calling logic in App.vue to respect daily update schedule
- Admin users now get automatic API updates once per day without manual intervention
- Fixed carousel navigation arrows not being visible or functional
- Added proper styling and positioning for carousel navigation buttons
- Improved carousel navigation accessibility and responsive design
- **Fixed product image carousel navigation buttons being disabled incorrectly** when multiple images are available
- Corrected thumbnail carousel navigation logic to properly enable/disable buttons based on available images
- **Fixed vue-snap carousel renderSlot error** that occurred when carousel data was not properly loaded
- Added proper conditional rendering and null checks for carousel component to prevent crashes
- Implemented carousel placeholder state when no content is available
- **Resolved CataProm API connectivity issues** by implementing server-side proxy to bypass browser CORS restrictions
- **Resolved StockSur API CORS issues** by replacing external proxy dependency (`allorigins.win`) with internal PHP proxy for better reliability and performance

### Enhanced
- Modernized login modal with contemporary design and improved UX
- Added company logo to login modal header for better brand recognition
- Enhanced login modal with gradient backgrounds and glassmorphism effects
- Improved form inputs with better focus states and animations
- Enhanced ESC key functionality with multiple capture methods and focus management
- Redesigned close button with modern styling and hover effects
- Standardized login button to use app's consistent RgButton component
- Increased company logo size from 80px to 120px for better visibility
- Adjusted login button text size and styling for improved readability
- Ensured button uses app's primary color scheme consistently

## [1.4.0] - 11/09/2025
### Added
- Add lazy loading to imagen.
- Optimize call products.
- Add advisor admin configuration support.

### Changed
- Update menu items to be hidden on small screens.

## [1.3.0] - 04/08/2025
### Dependencies
- Add `vue-snap` to `^1.0.0`

### Added
- Main color functionality with admin configuration support.
- carousel functionality with admin configuration support.

### Changed
- Removed the hero section.
- Refactored the Firebase integration.
- Improved homepage structure to prevent layout shifting (page jumps).
- Visually redesigned the About Us section.
- Visually redesigned the Categories section.

### Fixed
- Fixed a crash in the ourClients section when only one item was present.
- Fixed key mismatch issues in the ourClients component.

## [1.2.0] - 30/07/2025
### Dependencies
- Updated `firebase` to `^12.0.0`
- Updated `@vitejs/plugin-vue` to `^6.0.0`
- Updated `vite` to `^7.0.0`
- Updated `vue-tsc` to `^3.0.0`

### Added
- Maintenance page added for when the site is under maintenance.
- Option to change the main image from the admin panel.
- "Our Clients" section added to the home page and its configuration in admin.

### Changed
- Updated styles for the main menu.
- Updated sidebar styles in the admin panel.
- Changed the color of the global loader.

### Fixed
- Fixed export issues in composables.
- Prevented a navigation crash by ensuring product ID is defined before routing.

## [1.1.0] - 26/05/2025
### Dependencies
- Dependencies are updated to their major versions

### Added
- Global loader added `RgGlobalLoader.vue`
- Added button to delete completed quotes
- Sorting is added to the table that lists quotes
- Added functionality to download the list of quotes
- The `About Us` page is added
- Added functionality to view the modal by URL from an external link
- An email is now sent when a new quote is created
- Build is optimized

### Fixed
- Local images are optimized
- The color displayed in the quotes modal is corrected
- Fixed the styles of the quote modal
- The table class in the admin section is corrected
- Fixed redirection to catalogs when no products exist
- Fixed login with credentials that redirects to the home and not to the admin when the user was authenticated
- The data sent to the email that was not received by the email is corrected.
- Corrected data type from the `lastUpdate`

### Changed
- The status of the quote is better displayed
- Secondary color is removed from user creation
- The button to update quotes from the admin has been removed and can now only be used from the modal
- The text in the footer about us is changed
- The home image and its size are changed
- Contact information is changed
- Unused imports from Firebase such as analytics and storage are removed
- When you enter the admin page, only the necessary information is updated and only if you are an admin

## [1.0.4] - 12/05/2025

### Dependencies
- Change dependencies to use `^` versioning for all packages in `package.json`
- Update `@todovue/tvbutton` to `@todovue/tv-button`
- Updated `firebase` to `11.7.1`
- Updated `vite` to `6.3.5`
- Updated `@vitejs/plugin-vue` to `5.2.4`

### Added
- Added `TvRelativeTime` component to display relative time in product view and admin quote details modal

### Fixed
- Fixed image responsiveness in `ProductView.vue`
- Fixed image responsiveness in `RgCard.vue`

## [1.0.3] - 02/05/2025

### Fixed
- Added null checks for product properties to prevent runtime errors
- Adjusted grid layout for product display and improved responsiveness

### Added
- Added loading indicator and improved catalog loading state management
- Added `calculateTotalQuantity` function to compute total stock quantity based on conditions

### Changed
- Updated titles and meta-tags to use singular form for consistency across views

### Dependencies
- Updated `axios` from `1.8.4` to `1.9.0`
- Updated `firebase` from `11.6.0` to `11.6.1`
- Updated `vue-router` from `4.5.0` to `4.5.1`
- Updated `vite` from `6.3.2` to `6.3.4`

## [1.0.2] - 26/04/2025

### Fixed
- Fixed visual issues on mobile devices in home products.
- Fixed visual issues on mobile devices in `RgScrollToTop.vue`.
- Fixed visual issues on mobile devices in `RgNavBar.vue`.
- Fixed visual issues on mobile devices in `RgHero.vue`.
- Fixed button in `RgScrollToTop.vue` to correctly scroll to the top of the page.
- Updated footer image sizes and adjusted padding for better responsiveness.
- Added responsive visibility rules for menu items on small screens.
- Adjusted grid layout and image height for improved responsiveness.
- Updated image dimensions for a better layout and responsiveness.
- Updated layout and responsiveness of product details and gallery.
- Improved zoom functionality and enhanced image responsiveness for a better user experience.

### Added
- Added a WhatsApp composable to enable reuse across the entire website.
- Integrated `useIsMobile` composable for improved responsive design.

## [1.0.1] - 25/04/2025

### Fixed
- Contact information is corrected

## [1.0.0] - 24/04/2025

### Added

- 🎉 Initial stable release.

[1.7.0]: https://github.com/CristhianDaza/redGlobal/pull/11/files
[1.6.0]: https://github.com/CristhianDaza/redGlobal/pull/10/files
[1.5.0]: https://github.com/CristhianDaza/redGlobal/pull/9/files
[1.4.0]: https://github.com/CristhianDaza/redGlobal/pull/8/files
[1.3.0]: https://github.com/CristhianDaza/redGlobal/pull/7/files
[1.2.0]: https://github.com/CristhianDaza/redGlobal/pull/6/files
[1.1.0]: https://github.com/CristhianDaza/redGlobal/pull/5/files
[1.0.4]: https://github.com/CristhianDaza/redGlobal/pull/
[1.0.3]: https://github.com/CristhianDaza/redGlobal/pull/4/files
[1.0.2]: https://github.com/CristhianDaza/redGlobal/pull/3/files
[1.0.1]: https://github.com/CristhianDaza/redGlobal/pull/2/files
[1.0.0]: https://github.com/CristhianDaza/redGlobal/pull/1/files
