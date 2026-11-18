
/* ==========================================
   1. MENGAMBIL ELEMEN HTML
========================================== */

const authPage = document.getElementById("authPage");
const shopPage = document.getElementById("shopPage");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const authMessage = document.getElementById("authMessage");

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");

const productList = document.getElementById("productList");
const favoriteList = document.getElementById("favoriteList");


/* ==========================================
   2. PENYIMPANAN DATA LOCALSTORAGE
========================================== */

function getStorage(key, fallback) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch (error) {
        return fallback;
    }
}

let users = getStorage("trendora_users", []);

let currentUser = getStorage("trendora_session", null);

let favorites = [];

let activeCategory = "Semua";

let searchKeyword = "";


/* ==========================================
   3. DATA PRODUK
========================================== */

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


/* ==========================================
   4. PINDAH LOGIN DAN REGISTER
========================================== */

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


/* ==========================================
   5. REGISTER AKUN
========================================== */

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

    authMessage.textContent =
        "Registrasi berhasil! Silakan login.";

});


/* ==========================================
   6. LOGIN AKUN
========================================== */

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

        authMessage.textContent =
            "Email atau password salah!";

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


/* ==========================================
   7. MENAMPILKAN DASHBOARD
========================================== */

function showShop() {

    authPage.classList.add("hidden");

    shopPage.classList.remove("hidden");

    document.getElementById("userName").textContent =
        currentUser.name;

    loadFavorites();

    renderProducts();

    renderFavorites();

}


/* ==========================================
   8. LOAD WISHLIST
========================================== */

function loadFavorites() {

    favorites = getStorage(
        "trendora_favorites_" + currentUser.email,
        []
    );

}


/* ==========================================
   9. SAVE WISHLIST
========================================== */

function saveFavorites() {

    localStorage.setItem(
        "trendora_favorites_" + currentUser.email,
        JSON.stringify(favorites)
    );

}


/* ==========================================
   10. MEMBUAT KARTU PRODUK
========================================== */

function createProductCard(product) {

    const card = document.createElement("div");

    card.className = "product-card";

    const image = document.createElement("img");

    image.src = product.image;

    image.alt = product.name;

    image.loading = "lazy";

    const info = document.createElement("div");

    info.className = "product-info";

    const category = document.createElement("span");

    category.className = "product-category";

    category.textContent = product.category;

    const name = document.createElement("h3");

    name.textContent = product.name;

    const price = document.createElement("p");

    price.className = "price";

    price.textContent = product.price;

    const actions = document.createElement("div");

    actions.className = "product-actions";

    const buyButton = document.createElement("button");

    buyButton.className = "buy-btn";

    buyButton.textContent = "Beli di Shopee ↗";

    buyButton.addEventListener("click", function() {

        openShopee(product.keyword);

    });

    const favoriteButton = document.createElement("button");

    favoriteButton.className = "favorite-btn";

    favoriteButton.textContent =
        favorites.includes(product.id) ? "♥" : "♡";

    favoriteButton.addEventListener("click", function() {

        toggleFavorite(product.id);

    });

    actions.appendChild(buyButton);

    actions.appendChild(favoriteButton);

    info.appendChild(category);

    info.appendChild(name);

    info.appendChild(price);

    info.appendChild(actions);

    card.appendChild(image);

    card.appendChild(info);

    return card;

}


/* ==========================================
   11. MENAMPILKAN PRODUK
========================================== */

function renderProducts() {

    productList.innerHTML = "";

    const filteredProducts = products.filter(function(product) {

        const categoryMatch =
            activeCategory === "Semua" ||
            product.category === activeCategory;

        const keywordMatch = (

            product.name.toLowerCase().includes(searchKeyword) ||

            product.category.toLowerCase().includes(searchKeyword) ||

            product.keyword.toLowerCase().includes(searchKeyword)

        );

        return categoryMatch && keywordMatch;

    });


    if (filteredProducts.length === 0) {

        const message = document.createElement("p");

        message.className = "no-product";

        message.textContent =
            "Maaf, produk tidak ditemukan. Coba kata kunci lain. 💜";

        productList.appendChild(message);

        return;
    }


    filteredProducts.forEach(function(product) {

        productList.appendChild(
            createProductCard(product)
        );

    });

}


/* ==========================================
   12. FUNGSI TOMBOL CARI
========================================== */

function searchProducts() {

    searchKeyword = searchInput.value
        .trim()
        .toLowerCase();

    renderProducts();

    if (searchKeyword === "") {

        searchMessage.textContent =
            "Menampilkan semua produk.";

    } else {

        const total = products.filter(function(product) {

            return (
                product.name.toLowerCase().includes(searchKeyword) ||
                product.category.toLowerCase().includes(searchKeyword) ||
                product.keyword.toLowerCase().includes(searchKeyword)
            );

        }).length;

        searchMessage.textContent =
            total + " produk ditemukan.";

    }

    // Mengarahkan pengguna ke bagian produk
    document.getElementById("products").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ==========================================
   13. EVENT TOMBOL CARI DAN ENTER
========================================== */

searchForm.addEventListener("submit", function(e) {

    e.preventDefault();

    searchProducts();

});


/* ==========================================
   14. MENCARI LANGSUNG DI SHOPEE
========================================== */

function openShopee(keyword) {

    const url =
        "https://shopee.co.id/search?keyword=" +
        encodeURIComponent(keyword);

    // Membuka Shopee pada halaman yang sama
    window.location.href = url;

}


/* ==========================================
   15. TOMBOL SHOPEE
========================================== */

document.getElementById("shopeeSearchBtn")
    .addEventListener("click", function() {

        const keyword = searchInput.value.trim();

        if (keyword === "") {

            searchMessage.textContent =
                "Masukkan nama produk terlebih dahulu!";

            searchInput.focus();

            return;
        }

        openShopee(keyword);

    });


/* ==========================================
   16. FILTER KATEGORI
========================================== */

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

            // Kosongkan pencarian lama
            searchKeyword = "";

            searchInput.value = "";

            searchMessage.textContent = "";

            renderProducts();

        });

    }
);


/* ==========================================
   17. TAMBAH DAN HAPUS WISHLIST
========================================== */

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites = favorites.filter(function(item) {

            return item !== id;

        });

    } else {

        favorites.push(id);

    }

    saveFavorites();

    renderProducts();

    renderFavorites();

}


/* ==========================================
   18. MENAMPILKAN WISHLIST
========================================== */

function renderFavorites() {

    favoriteList.innerHTML = "";

    const favoriteProducts = products.filter(
        function(product) {

            return favorites.includes(product.id);

        }
    );

    if (favoriteProducts.length === 0) {

        const message = document.createElement("p");

        message.className = "no-product";

        message.textContent =
            "Belum ada produk favorit. Yuk, pilih produk kesukaanmu! ♡";

        favoriteList.appendChild(message);

        return;
    }

    favoriteProducts.forEach(function(product) {

        favoriteList.appendChild(
            createProductCard(product)
        );

    });

}


/* ==========================================
   19. LOGOUT
========================================== */

document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        localStorage.removeItem("trendora_session");

        currentUser = null;

        favorites = [];

        shopPage.classList.add("hidden");

        authPage.classList.remove("hidden");

        loginTab.click();

        loginForm.reset();

        registerForm.reset();

        authMessage.textContent = "";

    });


/* ==========================================
   20. CEK SESSION SAAT REFRESH
========================================== */

if (currentUser && currentUser.email) {

    const validUser = users.find(function(user) {

        return user.email === currentUser.email;

    });

    if (validUser) {

        currentUser.name = validUser.name;

        showShop();

    } else {

        currentUser = null;

        localStorage.removeItem("trendora_session");

    }

       }
       
