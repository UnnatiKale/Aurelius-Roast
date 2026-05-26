document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.scroll-reveal, .fade-in');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax Effect (Disabled: Using CSS background-attachment: fixed instead)
    /*
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Hero Parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
        }
    });
    */

    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Menu Filtering and Search
    const searchInput = document.getElementById('menuSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    if (searchInput || filterBtns.length > 0) {
        const filterMenu = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

            menuCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const category = card.dataset.category;
                
                const matchesSearch = title.includes(searchTerm);
                const matchesFilter = activeFilter === 'all' || category === activeFilter;

                if (matchesSearch && matchesFilter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        };

        if (searchInput) {
            searchInput.addEventListener('input', filterMenu);
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterMenu();
            });
        });
    }

    // --- Cart Functionality ---
    let cart = JSON.parse(localStorage.getItem('aurelius_cart')) || [];

    const updateCartBadge = () => {
        const cartBadges = document.querySelectorAll('.cart-badge');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadges.forEach(badge => {
            badge.textContent = totalItems;
            if (totalItems > 0) {
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
    };

    // Add to Cart Handlers
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            const image = btn.dataset.image;

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, image, quantity: 1 });
            }

            localStorage.setItem('aurelius_cart', JSON.stringify(cart));
            updateCartBadge();

            // Animate Badge
            const badges = document.querySelectorAll('.cart-badge');
            badges.forEach(badge => {
                badge.classList.remove('bounce');
                void badge.offsetWidth; // Trigger reflow to restart animation
                badge.classList.add('bounce');
            });
        });
    });

    // Initialize Badge Count on Load
    updateCartBadge();

    // Render Cart page if container exists
    const cartContent = document.getElementById('cartContent');
    if (cartContent) {
        const renderCart = () => {
            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="empty-cart-message" style="text-align: center; padding: 40px 10px;">
                        <i class="fa-solid fa-cart-shopping" style="font-size: 3.5rem; color: var(--accent-secondary); margin-bottom: 20px; display: block;"></i>
                        <h3 style="font-size: 1.5rem; margin-bottom: 10px; font-family: 'Playfair Display', serif;">Your cart is empty</h3>
                        <p style="color: var(--text-muted); margin-bottom: 25px; font-size: 14px;">Select some premium brews or bakery options from our menu.</p>
                        <a href="menu.html" class="btn btn-primary" style="display: inline-block; border-radius: 30px; font-size: 14px; text-decoration: none;">View Menu</a>
                    </div>
                `;
                const totalsContainer = document.getElementById('cartTotalContainer');
                if (totalsContainer) totalsContainer.style.display = 'none';
                return;
            }

            const totalsContainer = document.getElementById('cartTotalContainer');
            if (totalsContainer) totalsContainer.style.display = 'block';

            let itemsHtml = '<div class="cart-items-list">';
            cart.forEach((item, index) => {
                itemsHtml += `
                    <div class="cart-item" data-index="${index}" style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid rgba(111, 78, 55, 0.1); gap: 20px;">
                        <div class="item-info" style="display: flex; align-items: center; gap: 20px;">
                            <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 12px; border: 1px solid rgba(111, 78, 55, 0.1);">
                            <div>
                                <h4 style="font-family: 'Playfair Display', serif; font-size: 1.15rem; margin-bottom: 4px;">${item.name}</h4>
                                <p style="color: var(--accent-primary); font-weight: 600; font-size: 14px;">₹${item.price}</p>
                            </div>
                        </div>
                        <div class="item-controls" style="display: flex; align-items: center; gap: 15px;">
                            <div class="qty-btn-group" style="display: flex; align-items: center; border: 1px solid rgba(111, 78, 55, 0.15); border-radius: 20px; overflow: hidden; background-color: var(--bg-secondary);">
                                <button class="qty-btn decrease-qty" style="background: none; border: none; padding: 4px 12px; cursor: pointer; font-weight: 600; font-size: 14px; color: var(--text-main);">-</button>
                                <span class="qty-val" style="padding: 0 4px; font-weight: 600; font-size: 14px; min-width: 15px; text-align: center;">${item.quantity}</span>
                                <button class="qty-btn increase-qty" style="background: none; border: none; padding: 4px 12px; cursor: pointer; font-weight: 600; font-size: 14px; color: var(--text-main);">+</button>
                            </div>
                            <button class="remove-item-btn" style="background: none; border: none; color: #b22222; cursor: pointer; font-size: 1.1rem; padding: 5px; transition: var(--transition);"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>
                `;
            });
            itemsHtml += '</div>';
            cartContent.innerHTML = itemsHtml;

            // Quantity event listeners
            document.querySelectorAll('.increase-qty').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.closest('.cart-item').dataset.index;
                    cart[idx].quantity += 1;
                    saveAndRender();
                });
            });

            document.querySelectorAll('.decrease-qty').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.closest('.cart-item').dataset.index;
                    if (cart[idx].quantity > 1) {
                        cart[idx].quantity -= 1;
                    } else {
                        cart.splice(idx, 1);
                    }
                    saveAndRender();
                });
            });

            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.closest('.cart-item').dataset.index;
                    cart.splice(idx, 1);
                    saveAndRender();
                });
            });

            // Calculate subtotal, delivery, and grand total
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const delivery = subtotal > 500 ? 0 : 50;
            const total = subtotal + delivery;

            document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
            document.getElementById('cartDelivery').textContent = delivery === 0 ? 'Free' : `₹${delivery}`;
            document.getElementById('cartTotal').textContent = `₹${total}`;
        };

        const saveAndRender = () => {
            localStorage.setItem('aurelius_cart', JSON.stringify(cart));
            renderCart();
            updateCartBadge();
        };

        renderCart();
    }
});


