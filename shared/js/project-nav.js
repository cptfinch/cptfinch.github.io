/**
 * Shared Navigation Component - Christopher Finch Portfolio
 * This file provides common navigation functionality for all project pages
 */

// Generate the standard navigation header
function createProjectHeader(activeProject = '') {
    return `
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <a href="/" class="logo">Christopher Finch</a>
                    <nav>
                        <ul class="nav-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/knowledge-base/">Knowledge Base</a></li>
                            <li><a href="/machine_qc/" ${activeProject === 'machine_qc' ? 'class="active"' : ''}>Machine QC</a></li>
                            <li><a href="/gafchromic/" ${activeProject === 'gafchromic' ? 'class="active"' : ''}>GafChromic</a></li>
                            <li><a href="/tg43/" ${activeProject === 'tg43' ? 'class="active"' : ''}>TG-43</a></li>
                            <li><a href="/#projects">Projects</a></li>
                            <li><a href="/#contact">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    `;
}

// Generate the standard footer
function createProjectFooter(projectName = '') {
    const currentYear = new Date().getFullYear();
    return `
        <footer class="footer">
            <div class="container">
                <p>&copy; ${currentYear} Christopher Finch. ${projectName} - Medical Physics & Software Development</p>
            </div>
        </footer>
    `;
}

// Initialize the page with shared components
function initializeProjectPage(config = {}) {
    const {
        activeProject = '',
        projectName = '',
        headerElementId = 'header-container',
        footerElementId = 'footer-container'
    } = config;

    // Insert header
    const headerElement = document.getElementById(headerElementId);
    if (headerElement) {
        headerElement.innerHTML = createProjectHeader(activeProject);
    }

    // Insert footer
    const footerElement = document.getElementById(footerElementId);
    if (footerElement) {
        footerElement.innerHTML = createProjectFooter(projectName);
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Auto-detect project from URL
        const path = window.location.pathname;
        let activeProject = '';
        
        if (path.includes('/machine_qc/')) activeProject = 'machine_qc';
        else if (path.includes('/gafchromic/')) activeProject = 'gafchromic';
        else if (path.includes('/tg43/')) activeProject = 'tg43';
        
        // Initialize with auto-detected project
        initializeProjectPage({ activeProject });
    });
} 