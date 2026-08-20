// --- MENU DATA FROM POSTER ---
const menuData = [
    {
        id: "mon-1",
        day: "Monday",
        name: "Butter Chicken",
        desc: "Butter chicken served with white rice and mixed veggies.",
        price: 1200,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
        highlight: "Monday Special"
    },
    {
        id: "tue-1",
        day: "Tuesday",
        name: "Beef Stew & Mashed Potatoes",
        desc: "Rich beef stew served with mashed potatoes and creamy spinach.",
        price: 1000,
        image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
        highlight: "Comfort Food"
    },
    {
        id: "wed-1",
        day: "Wednesday",
        name: "Minced Chicken Alfredo",
        desc: "Creamy minced chicken Alfredo paired with pineapple coleslaw.",
        price: 1200,
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",
        highlight: "Pasta Delight"
    },
    {
        id: "thu-1",
        day: "Thursday",
        name: "Loaded Sweet Potato Wedges",
        desc: "Loaded sweet potato wedges served with freshly made guacamole.",
        price: 1250,
        image: "day.jfif",
        highlight: "Creamy. Comforting. Unforgettable."
    },
    {
        id: "fri-1",
        day: "Friday",
        name: "Coconut Fish",
        desc: "Flavorful coconut fish served with spinach and your choice of Ugali or white rice.",
        price: 1200,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        highlight: "Friday Catch"
    },
    {
        id: "sat-1",
        day: "Saturday",
        name: "Spaghetti Bolognese",
        desc: "Classic Spaghetti Bolognese with mixed beef sauce and mixed veggies.",
        price: 1000,
        image: "saturday.jfif",
        highlight: "Weekend Classic"
    },
    {
        id: "sun-1",
        day: "Sunday",
        name: "Beef/Chicken Masala Wrap",
        desc: "Beef or chicken masala wrap with potato wedges and coleslaw.",
        price: 1100,
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
        highlight: "Sunday Special"
    }
];

const DELIVERY_FEE = 100;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayName = DAYS[new Date().getDay()];

// --- APP STATE ---
let cart = JSON.parse(localStorage.getItem("chillies_cart")) || [];
let currentHeroItem = null;
let isStkPaid = false;

// Filter cart for current day
cart = cart.filter(item => item.day === todayName);
localStorage.setItem("chillies_cart", JSON.stringify(cart));

// --- DOM ELEMENTS ---
const heroImg = document.getElementById("hero-img");
const heroPrice = document.getElementById("hero-price");
const heroHighlight = document.getElementById("hero-highlight");
const heroName = document.getElementById("hero-name");
const heroDesc = document.getElementById("hero-desc");
const heroAddBtn = document.getElementById("hero-add-btn");

const dayTabsContainer = document.getElementById("day-tabs");
const menuGrid = document.getElementById("menu-grid");

const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalAmount = document.getElementById("cart-total-amount");

const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutOverlay = document.getElementById("checkout-overlay");
const closeCheckoutBtn = document.getElementById("close-checkout");
const checkoutSummary = document.getElementById("checkout-summary");
const sendWhatsappBtn = document.getElementById("send-whatsapp-btn");
const checkoutError = document.getElementById("checkout-error");

const custNameInput = document.getElementById("cust-name");
const custPhoneInput = document.getElementById("cust-phone");
const custAddressInput = document.getElementById("cust-address");
const addressLabel = document.getElementById("address-label");
const deliveryTimeSelect = document.getElementById("delivery-time");
const specialInstructionsInput = document.getElementById("special-instructions");
const copyTillBtn = document.getElementById("copy-till-btn");
const tillNumberSpan = document.getElementById("till-number");
const toast = document.getElementById("toast");

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initHero();
    renderDayTabs();
    renderMenuGrid("All");
    updateCartUI();
    setupEventListeners();
    setupPaymentHandlers();
});

// --- HERO SECTION ---
function initHero() {
    currentHeroItem = menuData.find(item => item.day === todayName) || menuData[3];

    if (heroImg) {
        heroImg.src = currentHeroItem.image;
        heroImg.alt = currentHeroItem.name;
        heroPrice.textContent = `Ksh ${currentHeroItem.price}/=`;
        heroHighlight.textContent = `${currentHeroItem.highlight} (Today)`;
        heroName.textContent = currentHeroItem.name;
        heroDesc.textContent = currentHeroItem.desc;
    }
}

// --- MENU & TABS ---
function renderDayTabs() {
    const filterDays = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (!dayTabsContainer) return;
    dayTabsContainer.innerHTML = "";

    filterDays.forEach(day => {
        const button = document.createElement("button");
        button.className = `day-tab ${day === "All" ? "active" : ""}`;
        button.textContent = day === todayName ? `${day} ⭐` : day;
        button.addEventListener("click", () => {
            document.querySelectorAll(".day-tab").forEach(tab => tab.classList.remove("active"));
            button.classList.add("active");
            renderMenuGrid(day);
        });
        dayTabsContainer.appendChild(button);
    });
}

function renderMenuGrid(selectedDay) {
    if (!menuGrid) return;
    menuGrid.innerHTML = "";
    const filteredItems = selectedDay === "All" 
        ? menuData 
        : menuData.filter(item => item.day === selectedDay);

    filteredItems.forEach(item => {
        const card = document.createElement("div");
        const isToday = item.day === todayName;
        
        card.className = `menu-card ${!isToday ? 'disabled-card' : ''}`;

        card.innerHTML = `
            <span class="today-tag ${!isToday ? 'unavailable-tag' : ''}">${isToday ? 'Today' : item.day}</span>
            <img src="${item.image}" alt="${item.name}">
            <span class="day-label">${item.day}</span>
            <div class="dish-name">${item.name}</div>
            <div class="dish-desc">${item.desc}</div>
            <div class="dish-price">Ksh ${item.price}/=</div>
            <button type="button" class="card-add-btn ${!isToday ? 'btn-disabled' : ''}">
                ${isToday ? 'Add to Order' : 'Only Available on ' + item.day}
            </button>
        `;

        card.addEventListener("click", () => {
            if (isToday) {
                addToCart(item);
            } else {
                showToast(`Sorry! ${item.name} is only available on ${item.day}s.`);
            }
        });

        menuGrid.appendChild(card);
    });
}

// --- CART FUNCTIONS ---
function addToCart(item) {
    if (item.day !== todayName) {
        showToast(`This dish is only available on ${item.day}.`);
        return;
    }

    const existingIndex = cart.findIndex(cItem => cItem.id === item.id);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    saveCart();
    updateCartUI();
    showToast(`${item.name} added to cart!`);
}

function updateQuantity(id, change) {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        cart[index].qty += change;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
    }
    saveCart();
    updateCartUI();
    calculateCheckoutTotal();
}

function saveCart() {
    localStorage.setItem("chillies_cart", JSON.stringify(cart));
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalCount;

    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align: center; color: #5F5E5A; margin-top: 20px;'>Your order is empty.</p>";
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Ksh ${item.price}/= each</small>
                </div>
                <div class="qty-controls">
                    <button class="minus-btn">-</button>
                    <span>${item.qty}</span>
                    <button class="plus-btn">+</button>
                </div>
            `;
            itemElement.querySelector(".minus-btn").addEventListener("click", () => updateQuantity(item.id, -1));
            itemElement.querySelector(".plus-btn").addEventListener("click", () => updateQuantity(item.id, 1));
            cartItemsContainer.appendChild(itemElement);
        });
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (cartTotalAmount) cartTotalAmount.textContent = `Ksh ${totalAmount}/=`;
}

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// --- MODAL & DRAWER CONTROLS ---
function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Please add items to your order first.");
        return;
    }
    closeCart();
    calculateCheckoutTotal();
    checkoutModal.classList.add("open");
    checkoutOverlay.classList.add("open");
}

function closeCheckout() {
    checkoutModal.classList.remove("open");
    checkoutOverlay.classList.remove("open");
    if (checkoutError) checkoutError.textContent = "";
}

function calculateCheckoutTotal() {
    const isDelivery = document.getElementById("type-delivery")?.checked;
    const foodSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const finalTotal = foodSubtotal + (isDelivery ? DELIVERY_FEE : 0);

    if (checkoutSummary) {
        if (isDelivery) {
            checkoutSummary.textContent = `Total: Ksh ${foodSubtotal}/= + Ksh ${DELIVERY_FEE}/= Delivery = Ksh ${finalTotal}/=`;
        } else {
            checkoutSummary.textContent = `Total Payable (Pickup): Ksh ${finalTotal}/=`;
        }
    }
}

// --- PAYMENT METHOD TOGGLE & STK HANDLERS ---
function setupPaymentHandlers() {
    const stkRadio = document.getElementById("pay-stk");
    const manualRadio = document.getElementById("pay-manual");
    const stkSection = document.getElementById("stk-section");
    const manualSection = document.getElementById("manual-section");
    const triggerStkBtn = document.getElementById("trigger-stk-btn");
    const stkStatus = document.getElementById("stk-status");
    const mpesaPhoneInput = document.getElementById("mpesa-phone");

    if (stkRadio && manualRadio) {
        stkRadio.addEventListener("change", () => {
            if (stkRadio.checked) {
                stkSection.style.display = "block";
                manualSection.style.display = "none";
            }
        });

        manualRadio.addEventListener("change", () => {
            if (manualRadio.checked) {
                stkSection.style.display = "none";
                manualSection.style.display = "block";
            }
        });
    }

    if (triggerStkBtn) {
        triggerStkBtn.addEventListener("click", () => {
            const phone = mpesaPhoneInput.value.trim();
            if (!phone || phone.length < 10) {
                stkStatus.className = "stk-status-msg";
                stkStatus.style.color = "#C8385A";
                stkStatus.textContent = "Please enter a valid 10-digit M-Pesa phone number.";
                return;
            }

            triggerStkBtn.disabled = true;
            triggerStkBtn.textContent = "Sending Prompt...";
            stkStatus.className = "stk-status-msg pending";
            stkStatus.textContent = "Check your phone for the M-Pesa PIN prompt...";

            setTimeout(() => {
                isStkPaid = true;
                triggerStkBtn.textContent = "Prompt Sent!";
                stkStatus.className = "stk-status-msg success";
                stkStatus.textContent = "✓ Prompt sent! Enter PIN on phone to complete payment.";
            }, 3000);
        });
    }
}

// --- WHATSAPP ORDER SUBMISSION ---
function sendWhatsAppOrder() {
    const name = custNameInput.value.trim();
    const phone = custPhoneInput.value.trim();
    const isDelivery = document.getElementById("type-delivery").checked;
    const address = custAddressInput.value.trim();
    const preferredTime = deliveryTimeSelect.value;
    const specialInstructions = specialInstructionsInput.value.trim();

    const isStk = document.getElementById("pay-stk").checked;
    const mpesaPhone = document.getElementById("mpesa-phone").value.trim();
    const mpesaCode = document.getElementById("mpesa-code").value.trim();

    if (!name || !phone) {
        checkoutError.textContent = "Please fill in your Name and Phone Number.";
        return;
    }

    if (isDelivery && !address) {
        checkoutError.textContent = "Please enter your delivery location.";
        return;
    }

    if (isStk && !mpesaPhone) {
        checkoutError.textContent = "Please enter your M-Pesa Phone Number for the prompt.";
        return;
    }

    if (!isStk && !mpesaCode) {
        checkoutError.textContent = "Please enter the M-Pesa Transaction Code after paying to the till.";
        return;
    }

    checkoutError.textContent = "";

    let orderText = `*NEW ORDER - CHILLI'S DINER*\n`;
    orderText += `----------------------------\n`;
    orderText += `*Customer:* ${name}\n`;
    orderText += `*Phone:* ${phone}\n`;
    orderText += `*Order Type:* ${isDelivery ? "Delivery" : "Self-Pickup"}\n`;
    if (isDelivery) {
        orderText += `*Location:* ${address}\n`;
    }
    orderText += `*Preferred Time:* ${preferredTime}\n`;
    
    orderText += `----------------------------\n`;
    orderText += `*PAYMENT INFO*\n`;
    if (isStk) {
        orderText += `*Method:* M-Pesa STK Push\n`;
        orderText += `*M-Pesa Number:* ${mpesaPhone}\n`;
        orderText += `*Status:* ${isStkPaid ? "Prompt Requested / Pending PIN" : "Pending Prompt"}\n`;
    } else {
        orderText += `*Method:* Manual Till Payment\n`;
        orderText += `*M-Pesa Trans Code:* ${mpesaCode.toUpperCase()}\n`;
    }

    if (specialInstructions) {
        orderText += `*Notes:* ${specialInstructions}\n`;
    }

    orderText += `----------------------------\n`;
    orderText += `*Order Details:*\n`;

    cart.forEach(item => {
        orderText += `- ${item.name} x${item.qty} = Ksh ${item.price * item.qty}/=\n`;
    });

    const foodSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const grandTotal = foodSubtotal + (isDelivery ? DELIVERY_FEE : 0);

    orderText += `----------------------------\n`;
    if (isDelivery) {
        orderText += `*Subtotal:* Ksh ${foodSubtotal}/=\n`;
        orderText += `*Delivery Fee:* Ksh ${DELIVERY_FEE}/=\n`;
    }
    orderText += `*Grand Total:* Ksh ${grandTotal}/=\n`;

    const restaurantPhoneNumber = "254736992818";
    const encodedMessage = encodeURIComponent(orderText);
    const whatsappURL = `https://wa.me/${restaurantPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    if (heroAddBtn) {
        heroAddBtn.addEventListener("click", () => {
            if (currentHeroItem) addToCart(currentHeroItem);
        });
    }

    if (cartBtn) cartBtn.addEventListener("click", openCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

    if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeCheckout);
    if (checkoutOverlay) checkoutOverlay.addEventListener("click", closeCheckout);

    if (sendWhatsappBtn) sendWhatsappBtn.addEventListener("click", sendWhatsAppOrder);

    document.querySelectorAll('input[name="order-type"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "pickup") {
                custAddressInput.style.display = "none";
                addressLabel.style.display = "none";
            } else {
                custAddressInput.style.display = "block";
                addressLabel.style.display = "block";
            }
            calculateCheckoutTotal();
        });
    });

    if (copyTillBtn && tillNumberSpan) {
        copyTillBtn.addEventListener("click", () => {
            const tillNo = tillNumberSpan.textContent;
            navigator.clipboard.writeText(tillNo).then(() => {
                copyTillBtn.textContent = "Copied!";
                setTimeout(() => copyTillBtn.textContent = "Copy Till", 2000);
            });
        });
    }
}