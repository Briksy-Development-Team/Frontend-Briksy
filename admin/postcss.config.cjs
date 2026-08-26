const purgecss = require("@fullhuman/postcss-purgecss");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  plugins: isProduction
    ? [
        purgecss({
          // Scan all source files for class names
          content: [
            "./index.html",
            "./src/**/*.{tsx,ts,jsx,js,scss}",
          ],

          // Keep these always — dynamic classes added by JS/Bootstrap/Metronic at runtime
          safelist: {
            // Exact class names always kept
            standard: [
              "show",
              "fade",
              "collapsing",
              "collapsed",
              "active",
              "disabled",
              "open",
              "hover",
              "focus",
              "visible",
              "invisible",
              "in",
              "out",
              "page-loading",
              "dark",
              "light",
            ],
            // Regex patterns — keep all classes matching these prefixes
            greedy: [
              /^kt_/,        // Metronic JS-driven IDs/classes
              /^menu-/,      // Metronic menu states
              /^drawer-/,    // Metronic drawer
              /^modal-/,     // Bootstrap modals
              /^tooltip/,    // Bootstrap tooltips
              /^popover/,    // Bootstrap popovers
              /^dropdown/,   // Bootstrap dropdowns
              /^offcanvas/,  // Bootstrap offcanvas
              /^toast/,      // Bootstrap toasts
              /^alert-/,     // Bootstrap alerts
              /^badge-/,     // Bootstrap badges
              /^bg-/,        // Background utilities
              /^text-/,      // Text utilities
              /^border-/,    // Border utilities
              /^fs-/,        // Font-size utilities
              /^fw-/,        // Font-weight utilities
              /^d-/,         // Display utilities
              /^p-/,         // Padding utilities
              /^m-/,         // Margin utilities
              /^g-/,         // Gap utilities
              /^gx-/,        // Horizontal gap
              /^gy-/,        // Vertical gap
              /^w-/,         // Width utilities
              /^h-/,         // Height utilities
              /^flex-/,      // Flexbox utilities
              /^align-/,     // Align utilities
              /^justify-/,   // Justify utilities
              /^col-/,       // Grid columns
              /^row-/,       // Grid rows
              /^gap-/,       // Gap
              /^overflow-/,  // Overflow
              /^position-/,  // Position
              /^top-/,       // Position helpers
              /^bottom-/,    // Position helpers
              /^start-/,     // Position helpers
              /^end-/,       // Position helpers
              /^z-/,         // Z-index
              /^opacity-/,   // Opacity
              /^rounded/,    // Border radius
              /^shadow/,     // Shadow
              /^table-/,     // Table utilities
              /^btn-/,       // Button variants
              /^card-/,      // Card utilities
              /^nav-/,       // Nav utilities
              /^tab-/,       // Tab utilities
              /^apexcharts/, // ApexCharts injected classes
              /^svg-/,       // SVG utilities
              /^symbol-/,    // Metronic symbol
              /^bullet-/,    // Metronic bullet
              /^rotate-/,    // Metronic rotation
              /^ki-/,        // KeenIcons
              /^data-bs-/,   // Bootstrap data attributes
              /^collaps/,    // Collapse states
              /^was-validated/, // Form validation
              /^is-valid/,
              /^is-invalid/,
            ],
          },

          // Don't touch keyframes or font-faces
          keyframes: true,
          fontFace: false,

          // Treat :root variables as used
          variables: true,

          // Custom extractor that handles Metronic's attribute-based selectors
          defaultExtractor: (content) => {
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
            const innerMatches =
              content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
            return [...broadMatches, ...innerMatches];
          },
        }),
      ]
    : [],
};
