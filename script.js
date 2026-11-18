/* =================================
   1. MENGAMBIL ELEMEN HTML
================================= */

const authPage = document.getElementById("authPage");
const shopPage = document.getElementById("shopPage");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const authMessage = document.getElementById("authMessage");

const productList = document.getElementById("productList");
const favoriteList = document.getElementById("favoriteList");

const searchInput = document.getElementById("searchInput");


/* =================================
   2. DATA LOCALSTORAGE
================================= */

let users = JSON.parse(
    localStorage.getItem("trendora_users") || "[]"
);

let currentUser = JSON.parse(
    localStorage.getItem("trendora_session") || "null"
);

let favorites = [];
let activeCategory = "Semua";
let searchKeyword = "";


/* =================================
   3. DATA PRODUK
================================= */

const products = [
    {
        id: 1,
        name: "Elegant Korean Blouse",
        category: "Baju",
        price: "Rp89.000",
        keyword: "blouse wanita korean style",
        image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600"
    },
    {
        id: 2,
        name: "Casual Wide Leg Pants",
        category: "Celana",
        price: "Rp95.000",
        keyword: "celana wide leg wanita",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600"
    },
    {
        id: 3,
        name: "Mini Shoulder Bag",
        category: "Tas",
        price: "Rp75.000",
        keyword: "mini shoulder bag wanita",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
    },
    {
        id: 4,
        name: "Classic White Sneakers",
        category: "Sepatu",
        price: "Rp120.000",
        keyword: "sepatu sneakers putih wanita",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 5,
        name: "Soft Pink Dress",
        category: "Baju",
        price: "Rp110.000",
        keyword: "dress pink wanita",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"
    },
    {
        id: 6,
        name: "Daily Skincare Set",
        category: "Skincare",
        price: "Rp99.000",
        keyword: "skincare daily set",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600"
    }
];


/* =================================
   4. LOGIN DAN REGISTER TAB
================================= */

loginTab.addEventListener("click", function() {

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    authMessage.textContent = "";
});

registerTab.addEventListener("click", function() {

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    authMessage.textContent = "";
});


/* =================================
   5. REGISTER
================================= */

registerForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    if (users.some(user => user.email === email)) {

        authMessage.style.color = "red";
        authMessage.textContent = "Email sudah terdaftar!";
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);

    localStorage.setItem(
        "trendora_users",
        JSON.stringify(users)
    );

    registerForm.reset();

    loginTab.click();

    authMessage.style.color = "green";
    authMessage.textContent = "Registrasi berhasil! Silakan login.";
});


/* =================================
   6. LOGIN
================================= */

loginForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = users.find(function(item) {
        return item.email === email &&
               item.password === password;
    });

    if (!user) {

        authMessage.style.color = "red";
        authMessage.textContent = "Email atau password salah!";
        return;
    }

    currentUser = {
        name: user.name,
        email: user.email
    };

    localStorage.setItem(
        "trendora_session",
        JSON.stringify(currentUser)
    );

    loginForm.reset();

    showShop();
});


/* =================================
   7. MENAMPILKAN HALAMAN UTAMA
================================= */

function showShop() {

    authPage.classList.add("hidden");
    shopPage.classList.remove("hidden");

    document.getElementById("userName").textContent =
        currentUser.name;

    loadFavorites();

    renderProducts();
    renderFavorites();
}


/* =================================
   8. LOAD WISHLIST
================================= */

function loadFavorites() {

    favorites = JSON.parse(
        localStorage.getItem(
            "trendora_favorites_" + currentUser.email
        ) || "[]"
    );
}


/* =================================
   9. SAVE WISHLIST
================================= */

function saveFavorites() {

    localStorage.setItem(
        "trendora_favorites_" + currentUser.email,
        JSON.stringify(favorites)
    );
}


/* =================================
   10. MENAMPILKAN PRODUK
================================= */

function renderProducts() {

    productList.innerHTML = "";

    const filtered = products.filter(function(product) {

        const matchCategory =
            activeCategory === "Semua" ||
            product.category === activeCategory;

        const matchSearch =
            product.name.toLowerCase().includes(
                searchKeyword.toLowerCase()
            );

        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {

        productList.innerHTML =
            '<p class="no-product">Produk tidak ditemukan.</p>';

        return;
    }

    filtered.forEach(function(product) {

        const isFavorite = favorites.includes(product.id);

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="price">${product.price}</p>

                <div class="product-actions">

                    <button class="buy-btn">
                        Beli di Shopee ↗
                    </button>

                    <button class="favorite-btn">
                        ${isFavorite ? "♥" : "♡"}
                    </button>

                </div>

            </div>
        `;

        card.querySelector(".buy-btn").addEventListener(
            "click",
            function() {
                openShopee(product.keyword);
            }
        );

        card.querySelector(".favorite-btn").addEventListener(
            "click",
            function() {
                toggleFavorite(product.id);
            }
        );

        productList.appendChild(card);
    });
}


/* =================================
   11. HUBUNGAN KE SHOPEE
================================= */

function openShopee(keyword) {

    const shopeeURL =
        "https://shopee.co.id/search?keyword=" +
        encodeURIComponent(keyword);

    window.open(shopeeURL, "_blank", "noopener");

}


/* =================================
   12. PENCARIAN PRODUK
================================= */

function searchProducts() {

    searchKeyword = searchInput.value.trim();

    renderProducts();
}

document.getElementById("searchBtn").addEventListener(
    "click",
    searchProducts
);

searchInput.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {
        searchProducts();
    }
});


/* =================================
   13. CARI LANGSUNG DI SHOPEE
================================= */

document.getElementById("shopeeSearchBtn").addEventListener(
    "click",
    function() {

        const keyword = searchInput.value.trim();

        if (keyword === "") {

            alert("Masukkan nama produk terlebih dahulu!");
            searchInput.focus();
            return;
        }

        openShopee(keyword);
    }
);


/* =================================
   14. FILTER KATEGORI
================================= */

document.querySelectorAll(".category").forEach(
    function(button) {

        button.addEventListener("click", function() {

            document.querySelectorAll(".category").forEach(
                function(item) {
                    item.classList.remove("active");
                }
            );

            button.classList.add("active");

            activeCategory = button.dataset.category;

            renderProducts();
        });
    }
);


/* =================================
   15. TAMBAH DAN HAPUS WISHLIST
================================= */

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites = favorites.filter(
            function(item) {
                return item !== id;
            }
        );

    } else {

        favorites.push(id);
    }

    saveFavorites();

    renderProducts();
    renderFavorites();
}


/* =================================
   16. MENAMPILKAN WISHLIST
================================= */

function renderFavorites() {

    favoriteList.innerHTML = "";

    const favoriteProducts = products.filter(
        function(product) {
            return favorites.includes(product.id);
        }
    );

    if (favoriteProducts.length === 0) {

        favoriteList.innerHTML =
            '<p class="no-product">Belum ada produk favorit ♡</p>';

        return;
    }

    favoriteProducts.forEach(function(product) {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">
                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="price">${product.price}</p>

                <div class="product-actions">

                    <button class="buy-btn">
                        Beli di Shopee ↗
                    </button>

                    <button class="favorite-btn">
                        ♥
                    </button>

                </div>
            </div>
        `;

        card.querySelector(".buy-btn").addEventListener(
            "click",
            function() {
                openShopee(product.keyword);
            }
        );

        card.querySelector(".favorite-btn").addEventListener(
            "click",
            function() {
                toggleFavorite(product.id);
            }
        );

        favoriteList.appendChild(card);
    });
}


/* =================================
   17. LOGOUT
================================= */

document.getElementById("logoutBtn").addEventListener(
    "click",
    function() {

        localStorage.removeItem("trendora_session");

        currentUser = null;
        favorites = [];

        shopPage.classList.add("hidden");
        authPage.classList.remove("hidden");

        loginTab.click();
        loginForm.reset();
        registerForm.reset();

        authMessage.textContent = "";
    }
);


/* =================================
   18. CEK LOGIN SAAT REFRESH
================================= */

if (currentUser && currentUser.email) {

    const validUser = users.find(
        function(user) {
            return user.email === currentUser.email;
        }
    );

    if (validUser) {

        currentUser.name = validUser.name;

        showShop();

    } else {

        currentUser = null;

        localStorage.removeItem("trendora_session");
    }
}
  
