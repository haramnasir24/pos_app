# use server actions for post requests (throughout code)

**The homepage should display a list of products using Server-Side Rendering (SSR)
Implement streaming UI for product added cart to improve perceived performance.**

## do I check inventory at checkout or during adding to cart

TODO:

## implement hybrid (ssr for initial products listing on mount and client fetch using hooks for filter and search)

## implement local storage to maintain the cart between re-renders

## make components for reusable buttons

## wrap the product section in a suspense

## adjust inventory after checkout and order confirmation

## create a context for params of search catalogue objects (used in 3 components)

## add strict type safety (templates) instead of using type "any"

**When updating inventory, you need four key pieces of information: the item's variation ID (to identify the specific product), the inventory state change, the location ID (to specify which store), and a timestamp (to track when the change happened).**

## is react query caching my data, how

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

Step 10: Optimize Performance
Implement proper loading states
Add skeleton screens for better perceived performance
Optimize images and implement lazy loading

