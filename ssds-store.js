

( () => {
                const button = document.getElementById('themeToggle');
                const icon = document.getElementById('themeIcon');
                if (!button || !icon)
                    return;

                const setTheme = (theme) => {
                    const dark = theme === 'dark';
                    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
                    icon.src = dark ? 'sun.svg' : 'moon.svg';
                    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
                    button.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
                    const label = button.querySelector('.theme-toggle-label');
                    if (label)
                        label.textContent = dark ? 'Light mode' : 'Dark mode';
                    try {
                        localStorage.setItem('sharpsheep-theme', dark ? 'dark' : 'light');
                    } catch (_) {}
                }
                ;

                let savedTheme = 'light';
                try {
                    savedTheme = localStorage.getItem('sharpsheep-theme') || 'light';
                } catch (_) {}
                setTheme(savedTheme);
                button.addEventListener('click', () => {
                    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
                }
                );
            }
            )();




/* =====================================================
   SHARPSHEEP DIGITAL STORE — FUNCTIONAL JAVASCRIPT
===================================================== */

(() => {
    "use strict";

    const store = document.querySelector("#ssds-store");

    if (!store || store.dataset.ssdsInitialized === "true") {
        return;
    }

    store.dataset.ssdsInitialized = "true";

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const productOverlay = $("#ssds-product-overlay");
    const addedOverlay = $("#ssds-added-overlay");
    const cartOverlay = $("#ssds-cart-overlay");

    const modalTitle = $("#ssds-modal-title");
    const modalDescription = $("#ssds-modal-description");
    const modalCategory = $("#ssds-modal-category");
    const modalPrice = $("#ssds-modal-price");

    const addedDescription = $("#ssds-added-description");
    const addedPrice = $("#ssds-added-price");

    const cartCount = $("#ssds-cart-count");
    const cartItems = $("#ssds-cart-items");
    const cartSubtotal = $("#ssds-cart-subtotal");
    const emptyMessage = $("#ssds-empty");
    const toast = $("#ssds-toast");

    const categoryNames = {
        ebooks: "Ebook & Guide",
        business: "Business Document",
        templates: "Policy & Template",
        proposals: "Proposal & Tender"
    };

    const currency = amount =>
        "KES " + Number(amount).toLocaleString("en-KE");

    /*
     * Cart format:
     * {
     *   productId: { id, name, price, quantity, description, category }
     * }
     */

    let cart = {};
    let selectedProduct = null;
    let lastFocusedElement = null;
    let toastTimer = null;

    const storageKey = "ssds-store-cart-v1";

    // Restore saved cart if available.
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(storageKey) || "{}"
        );

        if (savedCart && typeof savedCart === "object"
            && !Array.isArray(savedCart)) {

            Object.entries(savedCart).forEach(([id, item]) => {
                if (
                    item &&
                    typeof item.id === "string" &&
                    typeof item.name === "string" &&
                    Number.isFinite(item.price) &&
                    item.price >= 0 &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0 &&
                    item.quantity <= 99
                ) {
                    cart[id] = {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        description: String(item.description || ""),
                        category: String(item.category || "")
                    };
                }
            });
        }
    } catch (error) {
        cart = {};
    }

    function saveCart() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(cart));
        } catch (error) {
            // The cart still works for the current page session.
        }
    }

    function getProduct(card) {
        return {
            id: card.dataset.id,
            name: card.dataset.name,
            description: card.dataset.description || "",
            price: Number(card.dataset.price),
            category: card.dataset.category
        };
    }

    function getCardById(id) {
        return $$(".ssds-card", store).find(
            card => card.dataset.id === id
        );
    }

    function productFromCard(card) {
        const product = getProduct(card);

        if (
            !product.id ||
            !product.name ||
            !Number.isFinite(product.price) ||
            product.price < 0
        ) {
            return null;
        }

        return product;
    }

    function openModal(overlay) {
        lastFocusedElement = document.activeElement;

        [productOverlay, addedOverlay, cartOverlay].forEach(modal => {
            modal.hidden = modal !== overlay;
        });

        document.body.style.overflow = "hidden";

        const focusTarget = $("button", overlay);
        if (focusTarget) focusTarget.focus();
    }

    function closeModal(overlay) {
        overlay.hidden = true;

        const anotherModalOpen = [
            productOverlay,
            addedOverlay,
            cartOverlay
        ].some(modal => !modal.hidden);

        if (!anotherModalOpen) {
            document.body.style.overflow = "";

            if (lastFocusedElement &&
                document.contains(lastFocusedElement)) {
                lastFocusedElement.focus();
            }
        }
    }

    function showToast(message) {
        toast.textContent = message;
        toast.hidden = false;

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.hidden = true;
        }, 2800);
    }

    // PRODUCT DETAILS MODAL
    function openProductDetails(product) {
        selectedProduct = product;

        modalCategory.textContent =
            categoryNames[product.category] || "Digital Resource";

        modalTitle.textContent = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = currency(product.price);

        openModal(productOverlay);
    }

    // ADD PRODUCT TO CART
    function addToCart(product) {
        if (!product) return;

        if (cart[product.id]) {
            cart[product.id].quantity = Math.min(
                99,
                cart[product.id].quantity + 1
            );
        } else {
            cart[product.id] = {
                ...product,
                quantity: 1
            };
        }

        saveCart();
        renderCart();

        // Close product details if it was open.
        if (!productOverlay.hidden) {
            productOverlay.hidden = true;
        }

        addedDescription.textContent =
            product.name + " has been added to your shopping cart.";

        addedPrice.textContent = currency(product.price);

        // Open a DIFFERENT modal for the confirmation.
        openModal(addedOverlay);
    }

    // UPDATE CART SUMMARY AND ITEMS
    function renderCart() {
        const entries = Object.values(cart);

        const totalItems = entries.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const subtotal = entries.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        cartCount.textContent = totalItems;
        cartSubtotal.textContent = currency(subtotal);

        cartItems.replaceChildren();

        if (entries.length === 0) {
            const empty = document.createElement("div");
            empty.className = "ssds-cart-empty";

            const message = document.createElement("p");
            message.textContent = "Your cart is empty.";

            const browseButton = document.createElement("button");
            browseButton.type = "button";
            browseButton.className = "ssds-primary-btn";
            browseButton.textContent = "Browse Resources";
            browseButton.addEventListener("click", () => {
                closeModal(cartOverlay);
            });

            empty.append(message, browseButton);
            cartItems.append(empty);
            return;
        }

        entries.forEach(item => {
            const line = document.createElement("div");
            line.className = "ssds-cart-line";

            const info = document.createElement("div");

            const title = document.createElement("h3");
            title.textContent = item.name;

            const unitPrice = document.createElement("p");
            unitPrice.textContent =
                currency(item.price) + " each";

            const controls = document.createElement("div");
            controls.className = "ssds-cart-line-controls";

            const quantityControl = document.createElement("div");
            quantityControl.className = "ssds-quantity";

            const decrease = document.createElement("button");
            decrease.type = "button";
            decrease.textContent = "−";
            decrease.setAttribute(
                "aria-label", "Decrease quantity of " + item.name
            );

            decrease.addEventListener("click", () => {
                changeQuantity(item.id, -1);
            });

            const quantity = document.createElement("span");
            quantity.textContent = item.quantity;
            quantity.setAttribute("aria-label", "Quantity");

            const increase = document.createElement("button");
            increase.type = "button";
            increase.textContent = "+";
            increase.setAttribute(
                "aria-label", "Increase quantity of " + item.name
            );

            increase.addEventListener("click", () => {
                changeQuantity(item.id, 1);
            });

            quantityControl.append(decrease, quantity, increase);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "ssds-remove-btn";
            remove.textContent = "Remove";
            remove.addEventListener("click", () => {
                removeFromCart(item.id);
            });

            controls.append(quantityControl, remove);
            info.append(title, unitPrice, controls);

            const linePrice = document.createElement("strong");
            linePrice.className = "ssds-cart-line-price";
            linePrice.textContent =
                currency(item.price * item.quantity);

            line.append(info, linePrice);
            cartItems.append(line);
        });
    }

    function changeQuantity(id, difference) {
        const item = cart[id];

        if (!item) return;

        const nextQuantity = item.quantity + difference;

        if (nextQuantity <= 0) {
            delete cart[id];
        } else if (nextQuantity <= 99) {
            item.quantity = nextQuantity;
        }

        saveCart();
        renderCart();
    }

    function removeFromCart(id) {
        delete cart[id];

        saveCart();
        renderCart();

        showToast("Product removed from your cart.");
    }

    function openCart() {
        renderCart();
        openModal(cartOverlay);
    }

    // FILTER PRODUCTS
    $$(".ssds-filter", store).forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.ssdsCategory;

            $$(".ssds-filter", store).forEach(filter => {
                const active = filter === button;

                filter.classList.toggle(
                    "ssds-filter-active", active
                );

                filter.setAttribute(
                    "aria-pressed", String(active)
                );
            });

            let visibleCount = 0;

            $$(".ssds-card", store).forEach(card => {
                const visible =
                    category === "all" ||
                    card.dataset.category === category;

                card.hidden = !visible;

                if (visible) visibleCount++;
            });

            emptyMessage.hidden = visibleCount > 0;
        });
    });

    // VIEW AND ADD-TO-CART PRODUCT BUTTONS
    $$(".ssds-card", store).forEach(card => {
        const viewButton = $(".ssds-view-btn", card);
        const addButton = $(".ssds-add-btn", card);

        viewButton.addEventListener("click", () => {
            const product = productFromCard(card);

            if (product) {
                openProductDetails(product);
            }
        });

        addButton.addEventListener("click", () => {
            const product = productFromCard(card);

            if (product) {
                addToCart(product);
            }
        });
    });

    // ADD FROM PRODUCT DETAILS MODAL
    $("#ssds-modal-add").addEventListener("click", () => {
        if (selectedProduct) {
            addToCart(selectedProduct);
        }
    });

    // VIEW CART BUTTONS
    $("#ssds-open-cart").addEventListener("click", openCart);

    $("#ssds-added-view-cart").addEventListener("click", () => {
        closeModal(addedOverlay);
        openCart();
    });

    // CLOSE BUTTONS
    $$("[data-ssds-close]").forEach(button => {
        button.addEventListener("click", () => {
            const modalType = button.dataset.ssdsClose;

            const overlays = {
                product: productOverlay,
                added: addedOverlay,
                cart: cartOverlay
            };

            if (overlays[modalType]) {
                closeModal(overlays[modalType]);
            }
        });
    });

    // CLICK OUTSIDE MODAL TO CLOSE
    [productOverlay, addedOverlay, cartOverlay].forEach(overlay => {
        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // ESCAPE KEY AND BASIC MODAL FOCUS MANAGEMENT
    document.addEventListener("keydown", event => {
        const activeOverlay = [
            productOverlay,
            addedOverlay,
            cartOverlay
        ].find(overlay => !overlay.hidden);

        if (!activeOverlay) return;

        if (event.key === "Escape") {
            closeModal(activeOverlay);
            return;
        }

        if (event.key === "Tab") {
            const focusable = $$(
                'button:not(:disabled), [href], input:not(:disabled), ' +
                'select:not(:disabled), textarea:not(:disabled), ' +
                '[tabindex]:not([tabindex="-1"])',
                activeOverlay
            ).filter(element =>
                element.offsetWidth > 0 &&
                element.offsetHeight > 0
            );

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey &&
                document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey &&
                document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    // INITIALISE
    renderCart();
})();
