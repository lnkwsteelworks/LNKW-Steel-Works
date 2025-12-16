document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  if (slides.length === 0) return; // nothing to do

  let slideIndex = 0; // start from first slide (index 0)
  let autoTimer = null;
  const INTERVAL = 4000;

  function showSlide(index) {
    // normalize index (wrap)
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    slideIndex = index;

    // hide all slides
    slides.forEach(s => s.style.display = 'none');

    // remove active from dots
    dots.forEach(d => d.classList.remove('active'));

    // show current
    slides[slideIndex].style.display = 'block';

    // activate dot if exists
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
  }

  function nextSlide() {
    showSlide(slideIndex + 1);
  }

  function prevSlide() {
    showSlide(slideIndex - 1);
  }

  function startAuto() {
    stopAuto(); // ensure single timer
    autoTimer = setInterval(nextSlide, INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // wire prev/next buttons (if present)
  if (prevBtn) prevBtn.addEventListener('click', function (e) { e.preventDefault(); prevSlide(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function (e) { e.preventDefault(); nextSlide(); startAuto(); });

  // wire dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', function () {
      showSlide(idx);
      startAuto();
    });
  });

  // show first slide and start autoplay
  showSlide(slideIndex);
  startAuto();

  // optional: pause on hover
  const container = document.querySelector('.carousel-container');
  if (container) {
    container.addEventListener('mouseenter', stopAuto);
    container.addEventListener('mouseleave', startAuto);
  }
});

// -------------------------
// Add To Cart
// -------------------------
function addToCart(id, name, price, image, color) {
    if (!color) {
        alert("Please select a colour");
        return;
    }

    let qty = Number(document.getElementById("qty").value);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(p => p.id === id && p.color === color);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id, name, price, image, color, qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart");
}

// -------------------------
// Load Cart on Cart Page
// -------------------------
function loadCart() {
    let cartContainer = document.getElementById("cart-container");
    let checkoutForm = document.getElementById("checkout-form");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartContainer.innerHTML = "";

    // CART EMPTY
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty 🛒</p>
                <a href="LNKW.html.html" class="shop-now-btn">
                    Shop Now
                </a>
            </div>
        `;
        checkoutForm.style.display = "none";
        return;
    }

    // CART ITEMS
    cart.forEach((item, index) => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Rs. ${item.price}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    checkoutForm.style.display = "block";
}


// -------------------------
// Change Quantity
// -------------------------
function changeQty(id, amount) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(x => x.id === id);

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
        cart = cart.filter(x => x.id !== id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}



// -------------------------
// Remove Item
// -------------------------
function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}



// -------------------------
// Checkout Button
// -------------------------
function checkout() {
    window.location.href = "checkout.html";
}

function continueToWhatsApp() {
    let name = document.getElementById("custName").value.trim();
    let phone = document.getElementById("custPhone").value.trim();
    let address = document.getElementById("custAddress").value.trim();

    if (name === "" || phone === "" || address === "") {
        alert("Please fill all details");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let total = 0;

    let message = 🛒 *NEW ORDER - LNKW STEEL WORKS*%0A%0A;
    message += 👤 Name: ${name}%0A;
    message += 📞 Phone: ${phone}%0A;
    message += 📍 Address: ${address}%0A%0A;

    cart.forEach((item, i) => {
        let itemTotal = item.price * item.qty;
        total += itemTotal;

        message += ${i + 1}. ${item.name}%0A;
        message += Qty: ${item.qty}%0A;
        message += Price: Rs. ${itemTotal}%0A%0A;
    });

    message += 💰 *TOTAL: Rs. ${total}*%0A;
    message += 📅 Date: ${new Date().toLocaleString()};

    // Save order (admin use)
    orders.push({
        name,
        phone,
        address,
        items: cart,
        total,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem("cart");
    updateCartCount();

    // WhatsApp
    let whatsappNumber = "94762226839"; // YOUR NUMBER
    let whatsappURL = https://wa.me/${whatsappNumber}?text=${message};
    window.open(whatsappURL, "_blank");

    // Redirect customer
    window.location.href = "LNKW.html.html";
}


function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    let badge = document.getElementById("cart-count");

    if (!badge) return;

    if (count > 0) {
        badge.innerText = count;
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
}
function buyNow() {
    if (!selectedColor) {
        alert("Select a colour first");
        return;
    }

    let qty = Number(document.getElementById("qty").value);

    let product = {
        id: "C001",
        name: "Butterfly design chairs with small table (CHAIR SET)",
        price: 80000,
        image: document.getElementById("mainImage").src,
        color: selectedColor,
        qty: qty
    };

    localStorage.setItem("cart", JSON.stringify([product]));
    window.location.href = "checkout.html";
}


const productId = "C001"; // same product ID

let selectedRating = 0;

function rate(num) {
    selectedRating = num;
    let stars = document.querySelectorAll("#star-box span");
    stars.forEach((s, i) => {
        s.classList.toggle("active", i < num);
    });
}

function submitReview() {
    let text = document.getElementById("review-text").value.trim();
    if (selectedRating === 0 || text === "") {
        alert("Please select rating and write review");
        return;
    }

    let reviews = JSON.parse(localStorage.getItem("reviews_" + productId)) || [];
    reviews.push({
        rating: selectedRating,
        text: text
    });

    localStorage.setItem("reviews_" + productId, JSON.stringify(reviews));
    selectedRating = 0;
    document.getElementById("review-text").value = "";
    loadReviews();
}

function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem("reviews_" + productId)) || [];
    let box = document.getElementById("review-list");
    if (!box) return;

    box.innerHTML = "";

    reviews.forEach(r => {
        box.innerHTML += 
            <p>
                ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}<br>
                ${r.text}
            </p>
            <hr>
        ;
    });
}
function showAverageRating() {
    let reviews = JSON.parse(localStorage.getItem("reviews_" + productId)) || [];
    let container = document.getElementById("average-rating");
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = "No ratings yet";
        return;
    }

    // Calculate average
    let total = 0;
    reviews.forEach(r => total += r.rating);
    let avg = total / reviews.length;
    let fullStars = Math.round(avg); // round to nearest star

    // Show stars
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
        starsHtml += i <= fullStars ? "★" : "☆";
    }

    container.innerHTML = Rating: ${starsHtml} (${avg.toFixed(1)} / 5);
}
function getSelectedColor() {
    let color = document.querySelector('input[name="color"]:checked');
    return color ? color.value : "Not selected";
}