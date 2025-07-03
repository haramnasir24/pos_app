# use server actions for post requests (throughout code)

## use sdk alternatively for api requests to cursor

## make components for reusable buttons

## implement locat storage to maintain the cart between re-renders

## wrap the product section in a suspense

## how to implement SSR for product listings, as it also requires to use react query for data fetching (client side)

## do i check inventory at checkout or during adding to cart

## adjust inventory after checkout and order confirmation

**When updating inventory, you need four key pieces of information: the item's variation ID (to identify the specific product), the inventory state change, the location ID (to specify which store), and a timestamp (to track when the change happened).**



## is react query caching my data, how

check if search catalog products api can be used for search and filter aswell
look into checkout management
inventory management api

Phase 2: Product Listing and Cart
Tasks:
The homepage should display a list of products using Server-Side Rendering (SSR).
Implement streaming UI for product added cart to improve perceived performance.
Use Tanstack react query for data fetching and caching.

Expectations:
Homepage renders server-side for optimal performance.
Product search and filtering are fast and accurate.
Shopping cart uses streaming UI for improved perceived performance.
All operations are secure and respect the user's authentication status.
Implement well-defined component patterns (container/layout/UI) and use composition to build a modular and maintainable codebase.
No global state management library is used; rely on React's built-in state management and context API if necessary.

**Step 6: Product Data Fetching**
Implement server-side rendering for initial product load
Use React Query for search caching
Add infinite scrolling or pagination

**Step 7: Search & Filtering**
Implement debounced search functionality
Create filter options (category, price range, etc.)

Step 8: Shopping Cart with Streaming UI
Create cart context using React Context API
Implement streaming UI for cart updates
Create side drawer component with smooth animations

Step 9: Product Cards with Quantity Controls
Design responsive product cards
Implement quantity controls that replace "Add to Cart" button
Add loading states and error handling

Step 10: Optimize Performance
Implement proper loading states
Add skeleton screens for better perceived performance
Optimize images and implement lazy loading

Use Next.js server actions to integrate directly with Square POS APIs.
Implement functions for product retrieval, discount and tax options, and order processing.
Ensure Square API calls are made securely using authenticated sessions.

