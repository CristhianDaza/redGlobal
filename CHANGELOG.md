# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Normalized all user emails to lowercase across the application to prevent case-sensitivity conflicts.
- Authentication and user validation in Firestore now use the Firebase Auth UID (`id` field) instead of email to avoid email casing issues.

### Added
- **Password reset functionality for admin users**: Added "Forgot Password" button in the admin users section that sends password recovery emails using Firebase Auth's `sendPasswordResetEmail` function.
- Lowercasing safeguards in the following flows/components:
  - Auth login in `src/store/useAuthStore.ts` forces `email.toLowerCase()` before calling Firebase Auth.
  - User creation in `src/services/firebase/usersFirebase.ts` saves emails in lowercase.
  - User updates in `src/services/firebase/usersFirebase.ts` convert `email` to lowercase when present.
  - Quotes flow (`src/store/useQuoteStore.ts`) stores `userEmail` and email sent to EmailJS in lowercase.
  - `src/store/useUserStore.ts` normalizes all fetched users' emails to lowercase for backward compatibility with historical data.

### Fixed
- Inconsistent lookups where comparisons used the raw email value, leading to mismatches when Auth returned different casing. Updated to compare against `authStore.user?.email?.toLowerCase()` in:
  - `src/App.vue` (theme color resolution)
  - `src/components/UI/RgNavbar.vue` and `src/components/UI/RgFooter.vue` (current user logo)
  - `src/views/ProductView.vue` and `src/components/Quote/QuoteModal.vue` (price increase calculation)
  - `src/components/Quote/QuoteCart.vue` (button color)
  - `src/composable/admin/useUserAdmin.ts` and `src/components/Admin/AdminSidebar.vue` (admin context)
  - `src/views/AdminView.vue` and `src/router/index.ts` (admin guard and role checks)

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
