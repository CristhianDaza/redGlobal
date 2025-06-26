# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.0]: https://github.com/CristhianDaza/redGlobal/pull/5/files
[1.0.4]: https://github.com/CristhianDaza/redGlobal/pull/
[1.0.3]: https://github.com/CristhianDaza/redGlobal/pull/4/files
[1.0.2]: https://github.com/CristhianDaza/redGlobal/pull/3/files
[1.0.1]: https://github.com/CristhianDaza/redGlobal/pull/2/files
[1.0.0]: https://github.com/CristhianDaza/redGlobal/pull/1/files
