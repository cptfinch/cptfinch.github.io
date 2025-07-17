# Shared Project Styling System

This directory contains shared CSS and JavaScript files that ensure consistent styling across all project showcase pages in the Christopher Finch portfolio.

## Files

### CSS
- `css/project-styles.css` - Main stylesheet with all common styles

### JavaScript
- `js/project-nav.js` - Shared navigation and footer components

### Templates
- `templates/project-template.html` - Template for creating new project pages

## How to Use

### For New Projects

1. **Copy the template**:
   ```bash
   cp shared/templates/project-template.html your-project/index.html
   ```

2. **Replace placeholders**:
   - `{{PROJECT_NAME}}` - Your project name
   - `{{PROJECT_DESCRIPTION}}` - Meta description
   - `{{PROJECT_HERO_DESCRIPTION}}` - Hero section description
   - `{{PROJECT_OVERVIEW}}` - Overview section content
   - `{{GITHUB_URL}}` - Link to GitHub repository
   - `{{PROJECT_ID}}` - Project identifier (e.g., 'machine_qc')
   - `{{TECH_X_NAME}}` and `{{TECH_X_DESCRIPTION}}` - Technology stack details

3. **Customize content**: Add your project-specific sections and content

### Benefits

✅ **Consistent Branding**: All projects use the same design language  
✅ **Easy Maintenance**: Update styles in one place, affects all projects  
✅ **Faster Development**: Template speeds up new project page creation  
✅ **Automatic Navigation**: JavaScript automatically updates navigation across all projects  

### File Structure

```
cptfinch.github.io/
├── shared/
│   ├── css/
│   │   └── project-styles.css
│   ├── js/
│   │   └── project-nav.js
│   ├── templates/
│   │   └── project-template.html
│   └── README.md
│
├── machine_qc/ (separate repository)
│   └── index.html (links to shared CSS/JS)
│
├── gafchromic/ (separate repository)
│   └── index.html (links to shared CSS/JS)
│
└── other-project/ (separate repository)
    └── index.html (links to shared CSS/JS)
```

## Updating Existing Projects

To convert existing projects to use the shared styling:

1. **Replace inline CSS** with a link to the shared stylesheet:
   ```html
   <link rel="stylesheet" href="https://cptfinch.github.io/shared/css/project-styles.css">
   ```

2. **Add shared JavaScript**:
   ```html
   <script src="https://cptfinch.github.io/shared/js/project-nav.js"></script>
   ```

3. **Initialize navigation**:
   ```html
   <script>
   document.addEventListener('DOMContentLoaded', function() {
       initializeProjectPage({
           activeProject: 'your-project-id',
           projectName: 'Your Project Name'
       });
   });
   </script>
   ```

## Adding New Projects to Navigation

To add a new project to the navigation across all sites:

1. **Update `js/project-nav.js`**:
   - Add the new project link to the `createProjectHeader()` function
   - Add project detection to the auto-initialization

2. **Push changes**: All project sites will automatically get the updated navigation

## Style Customization

### Global Changes
Edit `css/project-styles.css` to change styling across all projects.

### Project-Specific Changes
Add custom styles in each project's HTML file:
```html
<style>
/* Project-specific styles */
.special-section {
    background: #custom-color;
}
</style>
```

## Cache Considerations

Since all projects link to the shared files via CDN URLs, changes may take a few minutes to propagate due to browser caching. For immediate testing, you can append a cache-busting parameter:

```html
<link rel="stylesheet" href="https://cptfinch.github.io/shared/css/project-styles.css?v=1.1">
```

## Performance

- **CSS**: Single stylesheet shared across all projects (cached after first load)
- **JavaScript**: Minimal, focused on navigation functionality
- **Fallbacks**: HTML includes fallback header/footer for when JavaScript is disabled

## Future Enhancements

- **Version management**: Consider adding versioning to CSS/JS files
- **Build process**: Could add SCSS compilation or CSS minification
- **Component library**: Expand to include more reusable components
- **Dark mode**: Add theme switching capability 