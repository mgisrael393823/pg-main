# PorterGoldberg Design System Guidelines

## Layout Structure
- All dashboard pages must use: `<div className="h-full p-8">`
- Consistent spacing: `space-y-6` between major sections
- Grid gaps: `gap-4` for stat cards, `gap-6` for larger cards

## Color Palette (Use these consistently)
- **Backgrounds**: 
  - `bg-secondary` (White Mink #EFEEE9) - Main background
  - `bg-white` - Cards and stat boxes
  - `bg-primary` (Matt Black #151515) - Sidebar
  
- **Text Colors**:
  - `text-primary` - Main headings and values
  - `text-neutral-medium` - Descriptions and secondary text
  - `text-secondary` - Light text on dark backgrounds
  
- **Accents**:
  - `text-success` / `bg-success` - Positive indicators
  - `text-warning` / `bg-warning` - Alert states
  - `text-error` / `bg-error` - Error states

## Component Standards

### Stat Cards (Dashboard & Analytics)
```jsx
<div className="bg-white rounded-lg p-6 h-40 shadow-sm">
  <div className="flex items-start justify-between mb-8">
    <h3 className="text-xs font-medium tracking-wider text-neutral-medium uppercase">
      {title}
    </h3>
    <Icon className={`h-8 w-8 ${iconColor}`} />
  </div>
  <div className="text-4xl font-bold text-primary">
    {value}
  </div>
</div>
```

### Page Headers
```jsx
<PageHeader
  title="Page Title"
  description="Page description text"
  actions={<Button>Action</Button>}
/>
```

### Empty States
```jsx
<div className="text-center py-12">
  <Icon className="h-12 w-12 text-neutral-medium mx-auto mb-4" />
  <h3 className="text-lg font-medium text-primary mb-2">
    Title
  </h3>
  <p className="text-neutral-medium max-w-md mx-auto">
    Description
  </p>
  <Button>Action</Button>
</div>
```

## Typography Scale
- Page titles: `h1` (handled by PageHeader)
- Card titles: `text-lg font-medium`
- Stat labels: `text-xs font-medium tracking-wider uppercase`
- Stat values: `text-4xl font-bold`
- Body text: `text-sm` or default
- Small text: `text-xs`

## Spacing Guidelines
- Page padding: `p-8`
- Card padding: `p-6`
- Section spacing: `space-y-6`
- Grid gaps: `gap-4` (tight) or `gap-6` (normal)
- Icon sizes: `h-8 w-8` for stat cards, `h-5 w-5` for inline

## Border & Shadow Standards
- Cards: `rounded-lg shadow-sm`
- Borders: `border-neutral-medium/20`
- Hover states: Add `/10` or `/20` opacity variants

## Grid Layouts
- Stats: `grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4`
- Cards: `grid gap-6 md:grid-cols-2` or `lg:grid-cols-2`

## DO NOT USE
- Generic Tailwind colors (gray-500, blue-600, etc.)
- Custom undefined classes
- Inconsistent spacing or sizing
- Different card structures across pages
