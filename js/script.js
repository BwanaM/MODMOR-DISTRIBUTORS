// ============================================================
// MODMOR DISTRIBUTORS — script.js (cleaned & deduplicated)
// ============================================================

// console.log('Script loaded - starting initialization');

// ============================================================
// 1. INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // console.log('DOM loaded - initializing all features');
    initMobileNavigation();
    initNavigationHighlighting();
    initDateUpdates();
    initTrendingProducts();
    initTestimonials();
    initProductsPage();
    updateLegalDate();
});

// ============================================================
// 2. MOBILE NAVIGATION
// ============================================================

function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    // Clone to remove any inherited listeners
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);

    newHamburger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        newHamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !newHamburger.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================================
// 3. NAVIGATION HIGHLIGHTING
// ============================================================

function initNavigationHighlighting() {
    function setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-item .nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage) link.classList.add('active');
            if ((currentPage === '' || currentPage === 'index.html') && href === 'index.html') {
                link.classList.add('active');
            }
        });
    }

    setActivePage();
    window.addEventListener('popstate', setActivePage);
}

// ============================================================
// 4. DATE UPDATES (copyright + generic date elements)
//    The "Last updated" legal date is handled by updateLegalDate()
// ============================================================

function initDateUpdates() {
    updateAllDates();
    window.addEventListener('load', updateAllDates);
}

function updateAllDates() {
    // Copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace(/\b20\d{2}\b/, currentYear);
    }

    // Generic date elements
    const formattedDate = new Date().toLocaleDateString('en-GB', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    document.querySelectorAll('[data-auto-update-date]').forEach(el => {
        el.textContent = formattedDate;
    });
}

// ============================================================
// 5. NAVBAR SCROLL STATE + BACK TO TOP + SCROLL PROGRESS
//    (all in one scroll listener for performance)
// ============================================================

(function initScrollHandlers() {
    const navbar = document.querySelector('.navbar');
    const progressBar = document.querySelector('.scroll-progress');
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar scrolled state
        if (navbar) {
            if (scrollY > 100) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }

        // Scroll progress
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const max = docHeight - winHeight;
            const pct = max > 0 ? (scrollY / max) * 100 : 0;
            progressBar.style.width = pct + '%';
        }

        // Back to top
        if (backToTop) {
            if (scrollY > 500) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial run
})();

// ============================================================
// 6. SCROLL REVEAL (shared by every page)
// ============================================================

function applyScrollReveal(root) {
    const els = (root || document).querySelectorAll('.reveal');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        els.forEach(el => observer.observe(el));
    } else {
        els.forEach(el => el.classList.add('visible'));
    }
}

document.addEventListener('DOMContentLoaded', () => applyScrollReveal());

// ============================================================
// 7. HERO STATS COUNTER (homepage)
// ============================================================

(function initHeroStats() {
    function startCounters() {
        const statNums = document.querySelectorAll('.hero-stat .num[data-count]');
        if (!statNums.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || '';
                const duration = 1800;
                const start = performance.now();

                function tick(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased) + suffix;
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                observer.unobserve(el);
            });
        }, { threshold: 0.4 });

        statNums.forEach(n => observer.observe(n));
    }

    document.addEventListener('DOMContentLoaded', startCounters);
})();

// ============================================================
// 8. TRENDING PRODUCTS (JSON-driven, homepage)
// ============================================================

function initTrendingProducts() {
    const container = document.getElementById('trendingGrid');
    const filterContainer = document.getElementById('trendingFilter');
    const eyebrowEl = document.getElementById('trendingEyebrow');
    const titleEl = document.getElementById('trendingTitle');
    const subtitleEl = document.getElementById('trendingSubtitle');

    if (!container || !filterContainer) return;

    fetch('data/trending.json')
        .then(res => {
            if (!res.ok) throw new Error('trending.json not found — status ' + res.status);
            return res.json();
        })
        .then(data => {
            // Heading
            if (data.heading) {
                if (eyebrowEl && data.heading.eyebrow) eyebrowEl.textContent = data.heading.eyebrow;
                if (titleEl && data.heading.title) titleEl.textContent = data.heading.title;
                if (subtitleEl && data.heading.subtitle) subtitleEl.textContent = data.heading.subtitle;
            }

            // Filters
            filterContainer.innerHTML = '';
            if (Array.isArray(data.filters)) {
                data.filters.forEach((f, i) => {
                    const btn = document.createElement('button');
                    btn.dataset.filter = f.key;
                    btn.textContent = f.label;
                    if (i === 0) btn.classList.add('active');
                    filterContainer.appendChild(btn);
                });
            }

            // Products
            container.innerHTML = '';
            if (Array.isArray(data.products) && data.products.length) {
                data.products.forEach(p => {
                    container.appendChild(buildProductCard(p));
                });
            } else {
                container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#666;">No trending products available right now.</p>';
            }

            // Attach image fallbacks
            attachImageFallbacks(container);

            // Attach filter handlers
            attachFilterHandlers(filterContainer, container);

            // Scroll reveal
            applyScrollReveal(container);

            console.log('✅ Trending products loaded');
        })
        .catch(err => {
            console.error('❌ Failed to load trending products:', err);
            container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#888;">Trending products are temporarily unavailable.</p>';
        });
}

// Shared helpers for product card + filters
function buildProductCard(p) {
    const card = document.createElement('article');
    card.className = 'product-card reveal';
    card.dataset.category = p.category || 'all';

    let badgeHTML = '';
    if (p.badge && p.badgeText) {
        const cls = p.badge === 'new' ? 'product-badge new' : 'product-badge';
        const icon = p.badge === 'new' ? 'fa-bolt' : 'fa-fire';
        badgeHTML = `<span class="${cls}"><i class="fas ${icon}"></i> ${p.badgeText}</span>`;
    }

    card.innerHTML = `
        <div class="product-image-wrap" data-fallback-icon="${p.fallbackIcon || 'fa-box'}">
            ${badgeHTML}
            <span class="product-cat-tag">${p.categoryLabel || p.category || ''}</span>
            <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-body">
            <h3>${p.name}</h3>
            <p class="desc">${p.description || ''}</p>
            <div class="product-meta">
                <span class="rating"><i class="fas fa-star"></i> ${p.rating || '5.0'}</span>
                <span>${p.stock || ''}</span>
            </div>
            <a href="${p.link || 'contact.html'}" class="product-btn">
                Request Quote <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    return card;
}

function attachImageFallbacks(root) {
    root.querySelectorAll('.product-image-wrap img').forEach(img => {
        img.addEventListener('error', function () {
            const wrap = this.parentElement;
            const icon = wrap.dataset.fallbackIcon || 'fa-box';
            wrap.classList.add('fallback');
            wrap.innerHTML = `<i class="fas ${icon}"></i>`;
        });
    });
}

function attachFilterHandlers(filterContainer, cardsContainer) {
    const btns = filterContainer.querySelectorAll('button');
    const cards = cardsContainer.querySelectorAll('.product-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                if (match) {
                    card.style.display = '';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        });
    });
}

// ============================================================
// 9. TESTIMONIALS (JSON-driven, homepage)
// ============================================================

function initTestimonials() {
    const container = document.getElementById('testimonialsTrack');
    const eyebrowEl = document.getElementById('testimonialsEyebrow');
    const titleEl = document.getElementById('testimonialsTitle');
    const subtitleEl = document.getElementById('testimonialsSubtitle');

    if (!container) return;

    fetch('data/testimonials.json')
        .then(res => {
            if (!res.ok) throw new Error('testimonials.json not found — status ' + res.status);
            return res.json();
        })
        .then(data => {
            if (data.heading) {
                if (eyebrowEl && data.heading.eyebrow) eyebrowEl.textContent = data.heading.eyebrow;
                if (titleEl && data.heading.title) titleEl.textContent = data.heading.title;
                if (subtitleEl && data.heading.subtitle) subtitleEl.textContent = data.heading.subtitle;
            }

            container.innerHTML = '';
            const items = Array.isArray(data.testimonials) ? data.testimonials : [];

            if (items.length === 0) {
                const empty = document.createElement('div');
                empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:2rem 1rem;';
                empty.innerHTML = `
                    <i class="fas fa-comments" style="font-size:2.5rem;color:#FFD700;opacity:.7;margin-bottom:1rem;display:block;"></i>
                    <p style="color:rgba(255,255,255,.85);font-size:1rem;max-width:520px;margin:0 auto;">
                        ${data.emptyMessage || 'Client testimonials coming soon.'}
                    </p>
                `;
                container.appendChild(empty);
                console.log('✅ Testimonials loaded (empty state)');
                return;
            }

            items.forEach(t => {
                const card = document.createElement('article');
                card.className = 'testimonial-card reveal';

                let avatarText = t.avatar;
                if (!avatarText && t.name) {
                    avatarText = t.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
                }
                avatarText = avatarText || '★';

                card.innerHTML = `
                    <i class="fas fa-quote-left quote-icon" aria-hidden="true"></i>
                    <p>${t.quote || ''}</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">${avatarText}</div>
                        <div>
                            <div class="name">${t.name || 'Anonymous'}</div>
                            <div class="role">${t.role || ''}</div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            applyScrollReveal(container);
            // console.log('✅ Testimonials loaded');
        })
        .catch(err => {
            console.error('❌ Failed to load testimonials:', err);
            container.innerHTML = `
                <p style="text-align:center;grid-column:1/-1;color:rgba(255,255,255,.7);">
                    Client testimonials are temporarily unavailable.
                </p>
            `;
        });
}

// ============================================================
// 10. PRODUCTS PAGE (JSON-driven)
// ============================================================

function initProductsPage() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    const countEl = document.getElementById('productCount');
    const searchEl = document.getElementById('productSearch');

    fetch('data/products.json')
        .then(res => {
            if (!res.ok) throw new Error('products.json not found — status ' + res.status);
            return res.json();
        })
        .then(data => {
            const categories = Array.isArray(data.categories) ? data.categories : [];
            renderProducts(categories, '');

            const totalItems = categories.reduce((sum, c) => sum + (c.items?.length || 0), 0);
            if (countEl) countEl.textContent = `${totalItems} products across ${categories.length} categories`;

            if (searchEl) {
                searchEl.addEventListener('input', e => {
                    renderProducts(categories, e.target.value.trim().toLowerCase());
                });
            }

            // console.log('✅ Products loaded from data/products.json');
        })
        .catch(err => {
            console.error('❌ Failed to load products:', err);
            container.innerHTML = '<p style="text-align:center;color:#888;padding:2rem;">Products are temporarily unavailable.</p>';
        });

    function renderProducts(categories, query) {
        container.innerHTML = '';
        let visibleCount = 0;

        categories.forEach(cat => {
            const items = (cat.items || []).filter(it =>
                !query ||
                it.name.toLowerCase().includes(query) ||
                (cat.title || '').toLowerCase().includes(query)
            );
            if (!items.length) return;
            visibleCount += items.length;

            const block = document.createElement('div');
            block.className = 'category-block reveal';
            block.innerHTML = `
                <div class="category-block-head">
                    <div class="cat-icon"><i class="fas ${cat.icon || 'fa-box'}"></i></div>
                    <div>
                        <h2>${cat.title}</h2>
                        <p>${cat.description || ''}</p>
                    </div>
                </div>
                <div class="products-grid"></div>
            `;

            const grid = block.querySelector('.products-grid');
            items.forEach(p => {
                const card = document.createElement('article');
                card.className = 'product-card';

                let badgeHTML = '';
                if (p.badge && p.badgeText) {
                    const cls = p.badge === 'new' ? 'product-badge new' : 'product-badge';
                    const icon = p.badge === 'new' ? 'fa-bolt' : 'fa-fire';
                    badgeHTML = `<span class="${cls}"><i class="fas ${icon}"></i> ${p.badgeText}</span>`;
                }

                card.innerHTML = `
                    <div class="product-image-wrap" data-fallback-icon="${p.fallbackIcon || 'fa-box'}">
                        ${badgeHTML}
                        <span class="product-cat-tag">${cat.title}</span>
                        <img src="${p.image}" alt="${p.name}" loading="lazy">
                    </div>
                    <div class="product-body">
                        <h3>${p.name}</h3>
                        <div class="product-meta">
                            <span class="rating"><i class="fas fa-star"></i> ${p.rating || '5.0'}</span>
                            <span>In Stock</span>
                        </div>
                        <a href="contact.html" class="product-btn">Request Quote <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                grid.appendChild(card);
            });

            container.appendChild(block);
        });

        if (!visibleCount) {
            container.innerHTML = '<p style="text-align:center;color:#888;padding:3rem 1rem;">No products match your search.</p>';
        }

        attachImageFallbacks(container);
        applyScrollReveal(container);
    }
}

// ============================================================
// 11. LEGAL PAGES — auto-update "Last updated" + TOC toggle + scroll spy
// ============================================================

function updateLegalDate() {
    const el = document.getElementById('lastUpdatedDate');
    if (!el) return;

    const formatted = new Date().toLocaleDateString('en-GB', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    el.textContent = formatted;
}

document.addEventListener('DOMContentLoaded', function () {
    // Mobile TOC toggle
    const tocToggle = document.getElementById('tocToggle');
    const legalToc = document.getElementById('legalToc');

    if (tocToggle && legalToc) {
        tocToggle.addEventListener('click', () => {
            const open = legalToc.classList.toggle('open');
            tocToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        legalToc.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    legalToc.classList.remove('open');
                    tocToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Scroll spy
    const tocLinks = document.querySelectorAll('.legal-toc a[href^="#"]');
    const sections = document.querySelectorAll('.legal-section');

    if (tocLinks.length && sections.length && 'IntersectionObserver' in window) {
        const linkMap = new Map();
        tocLinks.forEach(link => linkMap.set(link.getAttribute('href').slice(1), link));

        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tocLinks.forEach(l => l.classList.remove('active'));
                    const link = linkMap.get(entry.target.id);
                    if (link) link.classList.add('active');
                }
            });
        }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });

        sections.forEach(sec => spy.observe(sec));
    }
});
/* ============================================================
   BLOG / NEWS LOADER (JSON-driven)
   ============================================================ */

function initBlog() {
    const container = document.getElementById('blogGrid');
    const eyebrowEl = document.getElementById('blogEyebrow');
    const titleEl = document.getElementById('blogTitle');
    const subtitleEl = document.getElementById('blogSubtitle');

    if (!container) return;

    fetch('data/blog.json')
        .then(res => {
            if (!res.ok) throw new Error('blog.json not found — status ' + res.status);
            return res.json();
        })
        .then(data => {
            // Heading
            if (data.heading) {
                if (eyebrowEl && data.heading.eyebrow) eyebrowEl.textContent = data.heading.eyebrow;
                if (titleEl && data.heading.title) titleEl.textContent = data.heading.title;
                if (subtitleEl && data.heading.subtitle) subtitleEl.textContent = data.heading.subtitle;
            }

            // Posts
            container.innerHTML = '';
            const posts = Array.isArray(data.posts) ? data.posts : [];

            if (posts.length === 0) {
                container.innerHTML = `
                    <p style="text-align:center;grid-column:1/-1;color:#888;padding:2rem;">
                        No posts yet — check back soon.
                    </p>`;
                console.log('✅ Blog loaded (empty state)');
                return;
            }

            // Sort by date, newest first
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            posts.forEach(post => {
                const card = document.createElement('article');
                card.className = 'blog-card reveal';

                const dateFormatted = post.date
                    ? new Date(post.date).toLocaleDateString('en-GB', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    })
                    : '';

                card.innerHTML = `
                    <div class="blog-image-wrap" data-fallback-icon="${post.fallbackIcon || 'fa-newspaper'}">
                        <span class="blog-category-badge">${post.category || 'News'}</span>
                        <img src="${post.image || ''}" alt="${post.title}" loading="lazy">
                    </div>
                    <div class="blog-body">
                        <div class="blog-meta">
                            <span><i class="fas fa-calendar-alt"></i> ${dateFormatted}</span>
                            <span><i class="fas fa-user"></i> ${post.author || 'MODMOR'}</span>
                        </div>
                        <h3>${post.title}</h3>
                        <p class="excerpt">${post.excerpt || ''}</p>
                        <a href="${post.id ? 'post.html?id=' + post.id : '#'}" class="blog-read-more">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;
                container.appendChild(card);
            });

            // Image fallback
            container.querySelectorAll('.blog-image-wrap img').forEach(img => {
                img.addEventListener('error', function () {
                    const wrap = this.parentElement;
                    const icon = wrap.dataset.fallbackIcon || 'fa-newspaper';
                    wrap.classList.add('fallback');
                    wrap.innerHTML = `<i class="fas ${icon}"></i>`;
                });
            });

            applyScrollReveal(container);
            console.log('✅ Blog loaded from data/blog.json');
        })
        .catch(err => {
            console.error('❌ Failed to load blog:', err);
            container.innerHTML = `
                <p style="text-align:center;grid-column:1/-1;color:#888;padding:2rem;">
                    News section is temporarily unavailable.
                </p>`;
        });
}

document.addEventListener('DOMContentLoaded', initBlog);
/* ============================================================
   SINGLE POST PAGE LOADER (post.html)
   Reads ?id= from URL and displays the matching post from blog.json
   ============================================================ */

function initSinglePost() {
    const titleEl = document.getElementById('postTitle');
    const excerptEl = document.getElementById('postExcerpt');
    const contentEl = document.getElementById('postContent');
    const breadcrumbEl = document.getElementById('postBreadcrumb');

    // Only run on post.html
    if (!titleEl || !contentEl) return;

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        titleEl.textContent = 'Article Not Found';
        contentEl.innerHTML = `
            <p style="text-align:center;padding:3rem 1rem;color:#888;">
                No article specified. <a href="index.html#blog" style="color:var(--primary-color);">Browse all news</a>.
            </p>`;
        return;
    }

    fetch('data/blog.json')
        .then(res => {
            if (!res.ok) throw new Error('blog.json not found — status ' + res.status);
            return res.json();
        })
        .then(data => {
            const posts = Array.isArray(data.posts) ? data.posts : [];
            const post = posts.find(p => p.id === postId);

            if (!post) {
                titleEl.textContent = 'Article Not Found';
                contentEl.innerHTML = `
                    <p style="text-align:center;padding:3rem 1rem;color:#888;">
                        The article you're looking for doesn't exist.
                        <br><br>
                        <a href="index.html#blog" class="btn btn-primary">Browse All News</a>
                    </p>`;
                return;
            }

            // Update page title + meta
            document.title = `${post.title} - MODMOR DISTRIBUTORS LTD`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', post.excerpt || post.title);

            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', post.title);
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', post.excerpt || post.title);

            // Breadcrumb
            if (breadcrumbEl) breadcrumbEl.textContent = post.title;

            // Header
            titleEl.textContent = post.title;
            excerptEl.textContent = post.excerpt || '';

            // Body
            const dateFormatted = post.date
                ? new Date(post.date).toLocaleDateString('en-GB', {
                    year: 'numeric', month: 'long', day: 'numeric'
                })
                : '';

            contentEl.innerHTML = `
                <div class="legal-meta">
                    <span class="meta-item">
                        <i class="fas fa-calendar-alt"></i>
                        <strong>Published:</strong>&nbsp; ${dateFormatted}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-user"></i>
                        <strong>By:</strong>&nbsp; ${post.author || 'MODMOR Team'}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-tag"></i>
                        <strong>Category:</strong>&nbsp; ${post.category || 'News'}
                    </span>
                </div>

                ${post.image ? `
                    <div style="border-radius:16px;overflow:hidden;margin-bottom:2rem;box-shadow:0 12px 30px rgba(0,0,0,0.08);">
                        <img src="${post.image}" alt="${post.title}" style="width:100%;display:block;"
                             onerror="this.parentElement.style.display='none'">
                    </div>
                ` : ''}

                <div class="legal-intro" style="border-bottom:none;padding-bottom:0;margin-bottom:1.5rem;">
                    ${post.excerpt || ''}
                </div>

                <div class="post-body">
                    ${post.content || '<p>Full content coming soon.</p>'}
                </div>
            `;

            applyScrollReveal(contentEl);
            console.log('✅ Post loaded:', postId);
        })
        .catch(err => {
            console.error('❌ Failed to load post:', err);
            titleEl.textContent = 'Error';
            contentEl.innerHTML = `
                <p style="text-align:center;padding:3rem 1rem;color:#888;">
                    Unable to load this article. Please try again later.
                    <br><br>
                    <a href="index.html#blog" class="btn btn-primary">Browse All News</a>
                </p>`;
        });
}

document.addEventListener('DOMContentLoaded', initSinglePost);