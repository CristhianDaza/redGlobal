# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 🚀 Added

* **Privacy Policy Management System**

  * Complete privacy policy PDF management system for administrators.
  * Migrated from Firebase Storage to Cloudinary for better performance and reliability.
  * Real-time updates without page reload - modal automatically reflects changes when admin uploads/deletes policies.
  * Admin-only section accessible via `/admin?tab=privacy-policy` with role-based access control.
  * PDF upload with strict validation (PDF only, max 10MB) and automatic file replacement.
  * Elegant confirmation modals replacing browser alerts for better UX.
  * Toast notifications for upload/delete success feedback.
  * Global state management with `useGlobalPrivacyPolicy` composable for cross-component reactivity.
  * Cloudinary integration with fallback system and proper error handling.
  * User-facing modal in footer with download functionality and loading states.
  * Complete audit trail tracking who uploaded each document and when.
  * Responsive design working on mobile and desktop devices.

* **Code Quality and Performance Improvements**

  * Comprehensive code cleanup removing unnecessary comments and console.log statements.
  * Fixed all TypeScript errors and type inconsistencies across the application.
  * Eliminated unused imports and variables to reduce bundle size.
  * Standardized enum usage replacing local objects with official TypeScript enums.
  * Consolidated duplicate imports and corrected type definitions.
  * Optimized AdminView.vue by removing unused composable properties and functions.
  * Fixed AdminHeader.vue type mappings for complete tabs enum coverage.
  * Corrected useQuoteAdmin.ts to use proper QuoteStatus enum instead of local object.
  * All files now pass TypeScript strict checking without errors.
  * Build process optimized with cleaner, more maintainable codebase.

* **Enhanced Loading Experience**

  * Redesigned global loader (`RgLoaderGlobal.vue`) with modern aesthetic and multiple color animations.
  * Multi-layered circular animations with soft pastel colors (rose, aqua, sky blue, cream).
  * Dynamic loading text that cycles through different messages every 1.5 seconds.
  * Clean backdrop with blur effect and semi-transparent background for professional appearance.
  * Updated local loader (`RgLoader.vue`) with concentric rings and animated dots for consistency.
  * Responsive design optimized for all device sizes.
  * Smooth animations using CSS transforms for optimal performance.

* **Advisor User Role System**

  * New user role `ADVISOR` added to the system with specific permissions and restrictions.
  * Advisors have access only to the quotations section, cannot modify system configurations.
  * Automatic price increase set to 0% for advisors (they see real prices without markup).
  * Logo upload and color customization disabled for advisor users.
  * Enhanced user creation form with role selection moved to the beginning for better UX.
  * Automatic field cleanup when switching between user roles.
  * Role-based navigation and interface adaptation in admin panel.

* **Enhanced Quote Tracking System**

  * Expanded `QuoteStatusHistory` interface with detailed user information tracking.
  * Added `changedByName` and `changedByRole` fields to track who modified quotations.
  * Complete audit trail showing user name and role (Admin/Advisor/Client) in quote history.
  * Real-time tracking of all quote modifications with user attribution.
  * Enhanced quote detail view displaying modification history with user roles.

* **Role-Based Access Control**

  * Updated router with `allowedRoles` meta field for granular route permissions.
  * Admin sidebar dynamically shows/hides sections based on user role.
  * Automatic redirection to appropriate sections based on user role after login.
  * Enhanced authentication store with `isAdvisor` and `canAccessQuotes` computed properties.

* **Centralized Price Formatting System**

  * New utility module (`/src/utils/formatNumber.ts`) with Colombian locale support.
  * Business logic functions: `calculatePriceWithIncrease()`, `calculatePriceWithIva()`, `formatPriceWithBusinessLogic()`.
  * Validation functions: `isValidPrice()` and `parseFormattedNumber()`.
  * All prices now display as `$1.095.300` (Colombian peso format with thousands separators).

* **Quote Detail Page Migration**

  * Added `/admin/quotes/:id` route for direct access to individual quotations.
  * Dedicated full-page interface with tabs for Details, Comments, and History.
  * Unique URLs for bookmarking and sharing.
  * Real-time history updates and improved visual feedback.
  * Breadcrumb navigation with back button to admin panel.

* **Advanced Quote Management System**

  * Expanded statuses: Pending, In Review, Quoted, Negotiating, Approved, Completed, Cancelled, Expired.
  * New fields: priority levels, assigned users, due dates, estimated/actual values, tags, source tracking, follow-up dates.
  * Comments system (internal + client-facing) with timestamps and user attribution.
  * Full audit trail of status changes with notes.
  * Advanced filtering (by client, email, product, status, etc.).
  * Dual view modes (table & cards).
  * Real-time statistics and conversion metrics.
  * Inline editing for quick updates.
  * Export to CSV with filters.
  * Firebase integration with caching, logging, and error handling.
  * New `useAdvancedQuotes` composable and extended `useQuoteStore`.
  * Complete UI integration with sidebar navigation and modal system.
  * Documentation included.

* **Admin User Enhancements**

  * Hidden users (`isHidden` field) that don’t appear in listings but keep authentication.
  * Last login tracking with display in admin user table.
  * Copy email button with clipboard + notifications.
  * Password reset button for admin users via Firebase Auth.

## ♻️ Changed

* **Privacy Policy System Migration**

  * Completely migrated from Firebase Storage to Cloudinary for PDF storage.
  * Removed all Firebase Storage dependencies and references from the codebase.
  * Updated privacy policy modal to use global state management for automatic updates.
  * Enhanced admin interface with modern confirmation modals instead of browser alerts.
  * Streamlined code by removing unnecessary comments and debug statements.

* **User Management Interface**

  * Moved role selection field to the beginning of user creation form for better workflow.
  * Added automatic field cleanup when switching between user roles.
  * Enhanced user list display to show advisor role properly.
  * Improved form validation and user feedback for role-specific restrictions.

* **Admin Panel Navigation**

  * Sidebar navigation now adapts based on user role (Admin vs Advisor).
  * Advisors see only quotations section, admins see all administrative sections.
  * Enhanced breadcrumb navigation and role-based UI elements.

* **Price Display Standardization**

  * All product, quotation, and modal components updated to use centralized formatting.
  * Preserved logic: user authentication, price increases, IVA toggle, and stock validation.

* **Advanced Quotes Interface Optimization**

  * Simplified header in `AdvancedQuotesSection.vue`.
  * Compact actions bar with results count + essential actions.
  * Removed obsolete buttons (“Complete” and “Delete”) now handled in detail page.
  * Consistent navigation: admin redirects to `/admin?tab=advanced-quotes`.
  * Code cleanup: removed unused enums and functions.

* **Quote Navigation Improvements**

  * AdvancedQuotesSection now uses router navigation instead of modal emit.
  * Default view mode changed from table → cards.
  * “Cotizaciones Avanzadas” renamed to “Cotizaciones” (single entry point).

* **User & Authentication Standardization**

  * All user emails normalized to lowercase.
  * Firestore validation now uses Firebase Auth UID instead of email.
  * Safeguards in Auth store, user creation/update, quotes flow, and admin context.
  * Updated comparisons across app to always use lowercase emails.

* **Quantity Table**

  * Reordered columns: “Fecha Estimada” now appears before “Última Actualización”.

## 🛠 Fixed

* **Privacy Policy System Issues**

  * Fixed Cloudinary upload errors by correcting endpoint configuration and parameter handling.
  * Resolved "Access control Blocked for delivery" issues with proper upload preset configuration.
  * Fixed query parameter routing for direct access to privacy policy admin section.
  * Corrected modal update mechanism to reflect changes without page reload.
  * Fixed Firebase Storage import errors after migration to Cloudinary.
  * Resolved TypeScript errors in privacy policy components and composables.

* **TypeScript and Code Quality Issues**

  * Fixed missing 'advanced-quotes' property in AdminHeader.vue type mappings.
  * Corrected duplicate QuoteStatus imports in useQuoteStore.ts.
  * Resolved unused parameter warnings in AdminView.vue event handlers.
  * Fixed inconsistent enum usage in useQuoteAdmin.ts (replaced local object with official enum).
  * Eliminated unused imports: QuotesSection, QuoteComment, and duplicate tabs imports.
  * Removed unused variables: filteredQuotes, totalQuotes, completedQuotes, handleViewQuote, downloadQuoteSummary, canDeleteQuote.
  * Fixed console.log statements in RgVirtualList.vue and PrivacyPolicyModal.vue.
  * Corrected type inconsistencies preventing successful TypeScript compilation.
  * All files now compile without TypeScript errors or warnings.

* **User Role Management**

  * Fixed TypeScript type issues in role comparison logic.
  * Corrected form field cleanup when switching between user roles.
  * Fixed role-based route access and permissions validation.
  * Resolved authentication redirection issues for different user roles.

* **Quote Tracking System**

  * Fixed missing user information in quote modification history.
  * Corrected quote status update tracking with proper user attribution.
  * Fixed role display in quote history (Admin/Advisor/Client labels).
  * Resolved Firebase document ID consistency issues in quote tracking.

* **Price Formatting Issues**

  * Fixed inconsistent formats (`$3356` vs `$3.356`).
  * Removed browser-dependent locale differences.
  * Consolidated duplicate logic into utilities.

* **Admin Navigation**

  * Fixed redirects after login → advanced quotes.
  * Navbar admin link now points to advanced quotes.
  * QuoteDetailView back button and errors return to advanced quotes.
  * AdminHeader hidden on advanced quotes to avoid UI duplication.

* **Quote Comments & Status**

  * Fixed ID mismatches between quote ID and Firebase document ID.
  * Corrected Firebase subcollection access for comments and history.
  * Auto-reload of comments after add/delete.
  * Status updates properly saved to history and cache invalidation improved.
  * History entries load automatically in chronological order.

* **Advanced Quote Modal**

  * Fixed missing icons (`close` → `cancel`) for cancel/delete buttons.
  * Comments now reactive and update instantly.
  * ESC key closes modal properly with cleanup.
  * Simplified header with clean title + native close button.
  * Fixed TypeScript select element casting errors.
  * Implemented URL-based navigation (`&quoteId=`) for direct access via email links.

* **Admin System Issues**

  * Creating a user no longer logs out the admin (secondary Firebase Auth instance).
  * Fixed primary color not updating on user login.
  * Admin routing now respects query params (`/admin?tab=...`).
  * Fixed inconsistent lookups with email casing in App.vue, Navbar, Footer, ProductView, QuoteModal, QuoteCart, AdminSidebar, AdminView, and router guard.

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
