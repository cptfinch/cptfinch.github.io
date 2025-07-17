---
layout: home
title: "Christopher Finch - Developer & Systems Engineer"
---

<div class="hero-section" style="text-align: center; padding: 3rem 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin: -2rem -2rem 3rem -2rem; border-radius: 0 0 20px 20px;">
  <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: white;">Christopher Finch</h1>
  <p style="font-size: 1.2rem; margin-bottom: 2rem; color: rgba(255,255,255,0.9);">Developer & Systems Engineer</p>
  <p style="font-size: 1rem; color: rgba(255,255,255,0.8); max-width: 600px; margin: 0 auto;">Building real-world solutions from healthcare systems to developer tools</p>
</div>

## 🚀 Featured Projects

### 🏥 Healthcare & Medical Technology

**[Proton Therapy Procedures Application](https://github.com/cptfinch/nix-home-config/tree/main/operation-scenarios-app/proton-procedure-app)**
- **Tech Stack**: React.js, Node.js, Express, MongoDB
- **Purpose**: Digital solution for managing proton therapy site procedures, replacing paper-based workflows
- **Impact**: Streamlines medical procedures, reduces paper waste, improves efficiency for healthcare teams

**[Charity Accounting Software](https://github.com/cptfinch/nix-home-config/tree/main/charity-software/nextjs-charity)**
- **Tech Stack**: Next.js 14, TypeScript, MongoDB, Prisma, NextAuth.js, Tailwind CSS
- **Purpose**: Comprehensive accounting system designed specifically for charities
- **Features**: Transaction management, fund allocation, Gift Aid tracking, double-entry accounting

### 🔧 Developer Tools & Infrastructure

**[IBA Tools System](https://github.com/cptfinch/nix-home-config/tree/main/cli-frontends)**
- **Tech Stack**: Node.js, TypeScript, MongoDB, CLI tools
- **Purpose**: Comprehensive toolset for interacting with IBA systems and services
- **Components**: CLI tools for Jira, Confluence, site management, data collectors for analysis

**[Industrial Knowledge Graph Builder](https://github.com/cptfinch/nix-home-config/tree/main/knowledge-base/iba-rag)**
- **Tech Stack**: Python, LangChain, OpenAI, Interactive Dashboard
- **Purpose**: Extract entities from industrial documentation and build interactive knowledge graphs
- **Features**: Entity extraction, relationship inference, graph visualization, analytics

### 🌐 Web Applications & APIs

**[ETL Pipeline System](https://github.com/cptfinch/nix-home-config/tree/main/data/etl-pipelines)**
- **Tech Stack**: Node.js, TypeScript, MongoDB
- **Purpose**: Extract, transform, and load data from various APIs into centralized data warehouse
- **Features**: Automated data synchronization, error handling, monitoring

**[Cross-Control System](https://github.com/cptfinch/nix-home-config/tree/main/super-cv-me/personal-information/json)**
- **Tech Stack**: JavaScript, System APIs, Cross-platform integration
- **Purpose**: Open source solution for seamless keyboard and mouse sharing across multiple systems
- **License**: MIT

## 🛠️ Technical Expertise

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0;">
  <div>
    <h3>Frontend</h3>
    <p>React.js, Next.js, TypeScript, HTML5, CSS3, Tailwind CSS</p>
  </div>
  <div>
    <h3>Backend</h3>
    <p>Node.js, Express, Python, FastAPI, Ruby, Jekyll</p>
  </div>
  <div>
    <h3>Databases</h3>
    <p>MongoDB, Prisma ORM, PostgreSQL</p>
  </div>
  <div>
    <h3>DevOps</h3>
    <p>GitHub Actions, Docker, Nix, CI/CD pipelines</p>
  </div>
</div>

## 📚 Knowledge Resources

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0;">
  <div style="border: 1px solid #e1e4e8; padding: 1.5rem; border-radius: 8px;">
    <h3><a href="/knowledge-base/">🧠 Knowledge Base</a></h3>
    <p>Curated technical guides, tutorials, and documentation covering development, infrastructure, and best practices.</p>
    <p><strong>Topics:</strong> Package managers, static sites, system administration</p>
  </div>
  <div style="border: 1px solid #e1e4e8; padding: 1.5rem; border-radius: 8px;">
    <h3><a href="/posts/">📝 Technical Blog</a></h3>
    <p>In-depth articles on Nix, development workflows, tutorials, and technical insights from real-world projects.</p>
    <p><strong>Recent:</strong> {{ site.posts.first.title }}</p>
  </div>
</div>

## 🎯 Current Focus

- **Healthcare Technology**: Developing digital solutions for medical procedures and workflows
- **Charity Software**: Building specialized accounting tools for non-profit organizations  
- **Knowledge Management**: Creating systems to extract and organize information from unstructured data
- **Developer Experience**: Building CLI tools and APIs that streamline developer workflows
- **Open Source**: Contributing to the community with reusable tools and libraries

## 🤝 Connect

<div style="text-align: center; margin: 3rem 0;">
  <p>Interested in collaboration or learning more about these projects?</p>
  <div style="margin-top: 1rem;">
    <a href="https://github.com/cptfinch" style="margin: 0 1rem; text-decoration: none; color: #0366d6;">GitHub</a>
    <a href="https://twitter.com/capfinch" style="margin: 0 1rem; text-decoration: none; color: #0366d6;">Twitter</a>
    <a href="mailto:your-email@example.com" style="margin: 0 1rem; text-decoration: none; color: #0366d6;">Email</a>
  </div>
</div>

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background-color: #f6f8fa; border-radius: 8px;">
  <h2>Latest from the Blog</h2>
  <div class="post-list">
    {% for post in site.posts limit:3 %}
      <div style="margin: 1rem 0; padding: 1rem; background: white; border-radius: 6px; border: 1px solid #e1e4e8;">
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p style="color: #586069; font-size: 0.9rem;">{{ post.date | date: "%B %d, %Y" }}</p>
        {% if post.excerpt %}
          <p>{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
        {% endif %}
      </div>
    {% endfor %}
  </div>
  <p><a href="/posts/">View all {{ site.posts.size }} posts →</a></p>
</div>
