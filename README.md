# Christopher Finch - Personal Website & Knowledge Base

A modern, fast, and elegant personal website showcasing projects and technical knowledge. Built with pure HTML/CSS/JS for maximum performance and simplicity.

## 🌐 Live Sites

- **Main Site**: https://cptfinch.github.io - Project showcase landing page
- **Knowledge Base**: https://cptfinch.github.io/knowledge-base/ - Curated technical guides

## 🏗️ Architecture Overview

### **Simple & Fast Design Philosophy**
- **No Build Process** - Pure HTML/CSS/JS for instant updates
- **No Dependencies** - No Ruby, Node.js, or complex tooling
- **Fast Loading** - Optimized for performance and user experience
- **Easy Maintenance** - Simple to update and modify

### **Repository Structure**
```
cptfinch.github.io/
├── index.html              # Main landing page
├── knowledge-base/
│   └── index.html          # Knowledge base application
├── .gitignore
└── README.md              # This file
```

### **Content Source**
- **Landing Page Content** - Embedded in `index.html`
- **Knowledge Base Content** - Fetched from `nix-home-config/knowledge-base/` via GitHub raw URLs
- **No Local Content Files** - Everything is either embedded or fetched remotely

## 🎨 Landing Page (`index.html`)

### **Features**
- **Hero Section** - Gradient background with name and title
- **Project Showcase** - 6 featured projects with descriptions and tech stacks
- **Technical Expertise** - Skills organized in responsive grid
- **Contact Section** - Social links and connection options
- **Smooth Animations** - CSS animations and intersection observers
- **Mobile Responsive** - Works perfectly on all devices

### **Adding/Updating Projects**

To add or modify projects, edit the project cards in `index.html`:

```html
<div class="project-card">
    <div class="project-icon">🏥</div>
    <h3 class="project-title">Your Project Name</h3>
    <p class="project-description">Description of what the project does and its impact.</p>
    <div class="project-tech">
        <span class="tech-tag">React.js</span>
        <span class="tech-tag">Node.js</span>
        <span class="tech-tag">MongoDB</span>
    </div>
    <a href="https://github.com/your-repo" class="project-link">View Project →</a>
</div>
```

### **Updating Skills**

Modify the skills grid in the Technical Expertise section:

```html
<div class="skill-category">
    <h3>Your Skill Category</h3>
    <p>List of technologies, tools, and expertise in this area</p>
</div>
```

### **Updating Contact Information**

Update social links in the contact section:

```html
<a href="https://github.com/yourusername" class="contact-link">GitHub</a>
<a href="https://twitter.com/yourusername" class="contact-link">Twitter</a>
```

## 📚 Knowledge Base (`knowledge-base/index.html`)

### **How It Works**
1. **Content Storage** - Markdown files stored in `nix-home-config/knowledge-base/`
2. **Content Fetching** - JavaScript fetches markdown from GitHub raw URLs
3. **Markdown Parsing** - Uses `marked.js` to convert markdown to HTML
4. **Syntax Highlighting** - Uses `highlight.js` for code blocks
5. **Category Navigation** - Client-side filtering and organization

### **Current Content**
- Package Managers: A Comprehensive Guide
- YAML Front Matter: Standard Fields and Usage Guide
- Bundler Guide for Ruby Development
- Jekyll Static Site Generator Guide

### **Adding New Articles**

#### **Step 1: Prepare Your Markdown File**

In your `nix-home-config/knowledge-base/` directory, create or edit a markdown file with proper YAML front matter:

```yaml
---
title: "Your Article Title"
date: 2025-01-15
tags: [tag1, tag2, tag3]
categories: [category]
status: active
type: guide
author: "Your Name"
description: "Brief description of the content"
draft: false  # IMPORTANT: This makes it available for publication
---

# Your Article Title

Your content here...
```

#### **Step 2: Update the Articles Array**

In `knowledge-base/index.html`, add your article to the `articles` array:

```javascript
const articles = [
    // ... existing articles ...
    {
        id: 'your-article-id',
        title: 'Your Article Title',
        description: 'Brief description that appears on the card',
        category: 'your-category',
        tags: ['tag1', 'tag2', 'tag3'],
        file: 'path/to/your-file.md',  // Relative to knowledge-base/
        date: '2025-01-15'
    }
];
```

#### **Step 3: Add Category (if new)**

If you're adding a new category, add it to the sidebar:

```html
<li><a href="#" class="category-link" data-category="your-category">Your Category</a></li>
```

#### **Step 4: Deploy**

```bash
cd /home/galactus/cptfinch.github.io
git add .
git commit -m "Add new article: Your Article Title"
git push origin master
```

The article will be live within minutes!

## 🚀 Deployment Process

### **Automatic Deployment**
- **GitHub Pages** - Automatically deploys from `master` branch
- **No Build Process** - Changes are live immediately after push
- **Fast Updates** - Typically live within 1-2 minutes

### **Making Changes**

1. **Edit Files** - Modify HTML, CSS, or JS directly
2. **Test Locally** - Open `index.html` in browser to test
3. **Commit Changes** - Use descriptive commit messages
4. **Push to GitHub** - Changes go live automatically

```bash
# Example workflow
cd /home/galactus/cptfinch.github.io
# Make your changes
git add .
git commit -m "Update project showcase with new healthcare app"
git push origin master
```

## 🎯 Content Management Strategy

### **Landing Page Content**
- **Projects** - Showcase your best 6-8 projects
- **Skills** - Keep updated with current technologies
- **Contact** - Ensure links are current and working

### **Knowledge Base Content**
- **Curated Quality** - Only publish polished, valuable content
- **Proper Formatting** - Use YAML front matter for all articles
- **Organized Categories** - Group related content together
- **Regular Updates** - Keep content current and relevant

## 🔧 Technical Details

### **Landing Page Technologies**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - Smooth scrolling and interactions
- **No External Dependencies** - All code is self-contained

### **Knowledge Base Technologies**
- **Marked.js** - Markdown parsing (CDN: `https://cdn.jsdelivr.net/npm/marked/marked.min.js`)
- **Highlight.js** - Syntax highlighting (CDN: `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/`)
- **GitHub Raw URLs** - Content fetching from `nix-home-config` repository
- **Responsive Design** - CSS Grid and Flexbox for layout

### **Content Fetching**
```javascript
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/cptfinch/nix-home-config/dev/knowledge-base/';
```

Articles are fetched from your `nix-home-config` repository in real-time.

## 🎨 Customization

### **Styling**
- **Colors** - Modify CSS custom properties for theme changes
- **Fonts** - Update font-family declarations
- **Layout** - Adjust grid and flexbox properties
- **Animations** - Modify CSS animations and transitions

### **Functionality**
- **Add Features** - JavaScript is modular and easy to extend
- **Modify Navigation** - Update menu items and links
- **Change Layout** - Rearrange sections as needed

## 🔍 Monitoring & Analytics

### **Performance**
- **Lighthouse Scores** - Regularly check performance metrics
- **Loading Speed** - Monitor with browser dev tools
- **Mobile Experience** - Test on various devices

### **Content Analytics**
- **GitHub Traffic** - Monitor repository traffic
- **User Engagement** - Track which articles are most accessed
- **Link Clicks** - Monitor external link performance

## 🚨 Troubleshooting

### **Common Issues**

1. **Knowledge Base Articles Not Loading**
   - Check that files have `draft: false` in YAML front matter
   - Verify file paths in the `articles` array
   - Ensure GitHub repository is public

2. **Styling Issues**
   - Clear browser cache
   - Check CSS syntax for errors
   - Verify responsive breakpoints

3. **JavaScript Errors**
   - Check browser console for errors
   - Verify CDN links are working
   - Test JavaScript syntax

### **Content Issues**

1. **Markdown Not Rendering**
   - Verify YAML front matter syntax
   - Check for special characters that need escaping
   - Ensure proper markdown formatting

2. **Articles Not Appearing**
   - Confirm `draft: false` is set
   - Check article object in `articles` array
   - Verify category matches sidebar categories

## 📈 Future Enhancements

### **Potential Improvements**
- **Search Functionality** - Add client-side search
- **Dark Mode** - Implement theme switching
- **RSS Feed** - Generate feed from articles
- **Comments** - Add commenting system
- **Analytics** - Integrate Google Analytics or similar

### **Content Expansion**
- **More Categories** - Add infrastructure, tutorials, etc.
- **Series Support** - Link related articles together
- **Author Pages** - Support multiple authors
- **Archive Pages** - Organize content by date

## 📝 Maintenance Checklist

### **Monthly Tasks**
- [ ] Update project descriptions and links
- [ ] Review and update skill categories
- [ ] Check all external links are working
- [ ] Review and publish new knowledge base content

### **Quarterly Tasks**
- [ ] Performance audit with Lighthouse
- [ ] Mobile responsiveness testing
- [ ] Content audit and cleanup
- [ ] Backup repository and content

### **Annual Tasks**
- [ ] Design refresh and modernization
- [ ] Technology stack review
- [ ] SEO optimization review
- [ ] Analytics and traffic analysis

## 🎉 Benefits of This Approach

### **Performance**
- **Fast Loading** - No build process or heavy frameworks
- **Efficient** - Minimal JavaScript and CSS
- **Scalable** - Can handle growth without complexity

### **Maintenance**
- **Simple** - Easy to understand and modify
- **Reliable** - No complex dependencies to break
- **Flexible** - Can be easily customized and extended

### **Developer Experience**
- **No Setup** - Works immediately after clone
- **Easy Updates** - Direct file editing
- **Clear Structure** - Well-organized and documented

---

## 🚀 Quick Start

1. **Clone the repository**
2. **Edit content** in `index.html` or add articles to knowledge base
3. **Test locally** by opening `index.html` in browser
4. **Push changes** to GitHub for automatic deployment

Your professional website is now live and ready to showcase your work! 🌟 