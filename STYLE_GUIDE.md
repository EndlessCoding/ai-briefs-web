# Visual Style Guide - MyNewsAggregator

## 1. Overall Aesthetic Goals

*   **Desired Look and Feel:** Clean, modern, content-focused, professional, user-friendly, and "大气" (conveying a sense of importance, polish, and appeal). The design should be intuitive and prioritize readability.
*   **Key Inspirations:**
    *   **Clarity & Structure:** Inspired by Google News' clear information hierarchy and Feedly's organized multi-column layouts (especially for potential dashboard/admin views).
    *   **Typographical Elegance & Readability:** Drawing from Medium's focus on high-quality typography and generous white space for an excellent reading experience.
    *   **Engaging Content Presentation:** Utilizing card-based layouts for news items, similar to Feedly's magazine view or modern news sites, making content visually appealing.
    *   **Professional Color Usage:** Employing a primarily neutral palette with a strong, modern accent color for key interactions, promoting a sense of trust and focus.

## 2. Color Palette

*   **Rationale:** The chosen palette aims for a balance of professionalism, modernity, and readability. The primary blue is often associated with trust and stability (common in tech and news). Neutral grays ensure content remains the focus. Status colors are standard for intuitive user feedback. This approach is inspired by Google News' use of blue and Medium's neutral backgrounds.

*   **Primary Color:**
    *   **Modern Blue:** `#007AFF` (A vibrant, accessible blue)
    *   *Usage:* Key interactive elements (buttons, links, active navigation items), branding accents, highlights.

*   **Secondary Color (Optional Accent):**
    *   **Cool Cyan:** `#5AC8FA` (A lighter, complementary blue for secondary actions or highlights if needed)
    *   *Usage:* Secondary buttons, less critical interactive elements, or specific UI highlights where differentiation from primary is needed.

*   **Neutral Colors:**
    *   **Backgrounds:**
        *   Primary Background: `#FFFFFF` (White) - For main content areas.
        *   Secondary Background (e.g., sidebars, cards in some themes): `#F8F9FA` (Very light gray)
        *   Darker Background (e.g., admin sidebar): `#304156` (Dark Slate Blue - as used in AdminLayout)
    *   **Text:**
        *   Primary Text: `#212529` (Near black, for body text and important information)
        *   Secondary Text: `#6C757D` (Dark gray, for less important text, metadata, captions)
        *   Placeholder Text: `#ADB5BD` (Medium gray)
        *   Text on Dark Background: `#E9ECEF` (Light gray/off-white - for use on `#304156`)
    *   **Borders & Dividers:**
        *   Standard Border: `#DEE2E6` (Light gray)
        *   Subtle Border: `#E9ECEF` (Very light gray)
    *   **Card Surfaces:**
        *   Default Card: `#FFFFFF` (White)

*   **Status/Feedback Colors:**
    *   **Success:** `#28A745` (Green)
    *   **Error/Danger:** `#DC3545` (Red)
    *   **Warning:** `#FFC107` (Yellow/Orange)
    *   **Info:** `#17A2B8` (Teal/Info Blue)

## 3. Typography

*   **Rationale:** The font choices prioritize readability and a modern aesthetic. "Inter" is a highly versatile and readable sans-serif suitable for UI and headlines. "Lora" offers a classic, readable serif for longer article text, enhancing the reading experience, inspired by Medium's approach. The typographic scale ensures clear hierarchy and visual rhythm.

*   **Primary Font (Headings & UI Elements):**
    *   **Font Family:** `Inter` (or a readily available system sans-serif like `Roboto`, `Open Sans` if Inter is not embeddable easily)
    *   **Weights:**
        *   Regular (400)
        *   Medium (500) - For subheadings, button text
        *   Semi-Bold (600) - For important UI elements, card titles
        *   Bold (700) - For main page titles (H1, H2)

*   **Secondary Font (Body Text/Article Content):**
    *   **Font Family:** `Lora` (Serif - for article body) or `Open Sans` (Sans-serif - if a consistent sans-serif feel is preferred across all text)
    *   **Weights:**
        *   Regular (400)
        *   Italic (400)
        *   Bold (700) - For emphasis within article text

*   **Base Font Size:**
    *   `16px` for body text (Secondary Font). UI elements using the Primary Font might use slightly smaller base sizes like `14px` or `15px` for density and clarity.

*   **Scale & Hierarchy (Example based on 16px body):**
    *   **H1 (Page Titles):** `32px` (Primary Font, Bold) - e.g., `font-size: 2rem;`
    *   **H2 (Section Titles):** `28px` (Primary Font, Bold) - e.g., `font-size: 1.75rem;`
    *   **H3 (Card Titles / Sub-Sections):** `22px` (Primary Font, Semi-Bold) - e.g., `font-size: 1.375rem;`
    *   **H4 (Smaller Headings):** `18px` (Primary Font, Medium) - e.g., `font-size: 1.125rem;`
    *   **Body Text:** `16px` (Secondary Font, Regular) - `font-size: 1rem;`
    *   **Card Summary/Metadata:** `14px` (Primary Font, Regular) - `font-size: 0.875rem;`
    *   **Button Text:** `14px` or `15px` (Primary Font, Medium)
    *   **Captions/Small Text:** `12px` (Primary Font, Regular) - `font-size: 0.75rem;`
    *   **Line Height:** For body text, `1.6` to `1.8` for optimal readability. For headings, `1.2` to `1.4`.

## 4. UI Elements Style

*   **Buttons:**
    *   **Primary:**
        *   Background: Primary Color (`#007AFF`)
        *   Text Color: `#FFFFFF`
        *   Border-radius: `4px` to `6px`
        *   Padding: `10px 20px` (Vertical Horizontal)
        *   Font Weight: Medium
        *   Hover/Focus: Slightly darker shade of Primary Color or subtle shadow.
    *   **Secondary:**
        *   Background: Secondary Background (`#F8F9FA`) or transparent.
        *   Text Color: Primary Color (`#007AFF`) or Primary Text (`#212529`).
        *   Border: `1px solid` Primary Color (`#007AFF`) or Standard Border (`#DEE2E6`).
        *   Border-radius: `4px` to `6px`
        *   Padding: `10px 20px`
        *   Font Weight: Medium
        *   Hover/Focus: Light background fill (e.g., Primary Color with low opacity) or border darkens.
    *   **Text/Link Buttons:** Minimal styling, relies on text color (Primary Color) and underline on hover.

*   **Cards:**
    *   **Background Color:** Default Card (`#FFFFFF`).
    *   **Shadow:** Subtle box-shadow (e.g., `0 2px 4px rgba(0,0,0,0.05)` or `0 4px 12px rgba(0,0,0,0.08)` for more prominence on hover/focus).
    *   **Border-radius:** `6px` to `8px`.
    *   **Padding:** Consistent internal padding (e.g., `16px` or `20px`).
    *   **Spacing between Cards:** Use consistent spacing units (e.g., `16px` or `24px`).
    *   **Hover Effect:** Slight lift (increased shadow) or subtle border highlight.

*   **Forms:**
    *   **Input Fields & Selects:**
        *   Border: `1px solid` Standard Border (`#DEE2E6`).
        *   Background: Primary Background (`#FFFFFF`).
        *   Border-radius: `4px` to `6px`.
        *   Padding: `8px 12px`.
        *   Focus State: Border color changes to Primary Color (`#007AFF`), optional subtle box-shadow.
        *   Placeholder Text Color: Placeholder Text (`#ADB5BD`).
    *   **Labels:** Clear, legible (Primary Font, Regular/Medium), placed above or to the left of inputs.

*   **Spacing & Borders:**
    *   **Spacing Unit:** Use multiples of a base unit (e.g., `4px` or `8px`) for consistent margins and paddings. (e.g., `8px, 12px, 16px, 24px, 32px`).
    *   **Borders:** Generally subtle. Use Standard Border (`#DEE2E6`) for clear separation where needed (e.g., table cells, input fields). Use Subtle Border (`#E9ECEF`) for less prominent dividers.

This style guide provides a foundational framework. Specific component implementations may require minor adjustments, but these principles should guide the overall visual consistency.
