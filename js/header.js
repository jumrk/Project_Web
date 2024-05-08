import { startSession, getSession, endSession } from "/main/changSession.js";
function start() {
    show_menu()
    loader()
    event_menu()
    event_person()
    Open_search()
    Close_search()
    event_cart()
}
start()
function loading() {
    $("body").load("/html/loading.html");
}

function show_menu() {
    document.getElementById("open_menu").addEventListener("click", () => {
        var menu = document.getElementById("items-event-menu")
        var event = document.getElementById("event-menu")
        event.style.opacity = "1"
        event.style.visibility = "visible"
        menu.style.transform = "translateX(0)"
    })
    document.getElementById("event-menu").addEventListener("click", () => {
        var menu = document.getElementById("items-event-menu")
        var event = document.getElementById("event-menu")
        event.style.opacity = "0"
        event.style.visibility = "hidden"
        menu.style.transform = "translateX(-100%)"
    })
    document.getElementById("close_menu").addEventListener("click", () => {
        var menu = document.getElementById("items-event-menu")
        var event = document.getElementById("event-menu")
        event.style.opacity = "0"
        event.style.visibility = "hidden"
        menu.style.transform = "translateX(-100%)"
    })
}
function Close_search() {
    var btn_close = document.getElementById('close_search')
    btn_close.addEventListener('click', () => {
        var header_search = document.getElementById("header-search")
        header_search.style.height = '0'
    })

}
function Open_search() {
    var btn_open = document.getElementById('open-search')
    btn_open.addEventListener('click', () => {
        var header_search = document.getElementById("header-search")
        header_search.style.height = '100%'
    })

}
function loader() {
    document.addEventListener('DOMContentLoaded', function () {
        var itemsEventMenu = document.querySelector('.items-event-menu');
        itemsEventMenu.style.transform = 'translateX(-100%)';
    });
}
function event_menu() {
    var all_product = document.getElementById("All_product")
    var T_shirts = document.getElementById("T-shirts")
    var Polo_shirt = document.getElementById("Polo-shirt")
    var sweater = document.getElementById("sweater")
    var trousers = document.getElementById("trousers")
    var aboutUs = document.getElementById('aboutUs')
    var contact = document.getElementById('contact')
    event_menu_home()
    event_menu_AllProduct(all_product, null)
    event_menu_AllProduct(T_shirts, 'T_shirts')
    event_menu_AllProduct(Polo_shirt, 'Polo_shirt')
    event_menu_AllProduct(sweater, 'sweater')
    event_menu_AllProduct(trousers, 'trousers')
    aboutUs.addEventListener('click', () => {
        loading()
        setTimeout(() => {
            window.location.href = '/html/aboutUs.html'
        }, 1000);
    })
    contact.addEventListener('click', () => {
        loading()
        setTimeout(() => {
            window.location.href = '/html/Contact.html'
        }, 1000);
    })
}
function event_menu_AllProduct(link, condition) {
    link.addEventListener('click', (event) => {
        if (condition == null) {
            loading()
            setTimeout(() => {
                window.location.href = '/html/View_all_product.html'
            }, 1000);
        } else {
            var param = '?param=' + condition
            loading()
            setTimeout(() => {
                window.location.href = '/html/View_all_product.html' + param
            }, 1000);
        }
    })
}
function event_menu_home() {
    var all_product = document.getElementById("home")
    all_product.addEventListener('click', () => {
        loading()
        setTimeout(() => {
            window.location.href = '/index.html'
        }, 1000);
    })
}
function event_person() {
    var person_id = document.getElementById('person-event')
    person_id.addEventListener('click', () => {
        if (getSession() == null) {
            loading()
            setTimeout(() => {
                window.location.href = '/html/Login.html'
            }, 1000);
        } else {
            loading()
            setTimeout(() => {
                window.location.href = '/html/User.html'
            }, 1000);
        }
    })
}
function event_cart() {
    var cart_id = document.getElementById('cart-event')
    cart_id.addEventListener('click', () => {
        if (getSession() == null) {
            loading()
            setTimeout(() => {
                window.location.href = '/html/Login.html'
            }, 1000);
        } else {
            loading()
            setTimeout(() => {
                window.location.href = '/html/Cart.html'
            }, 1000);
        }
    })
}

document.getElementById('searchInput').addEventListener('input', function () {
    var searchTerm = this.value.trim().toLowerCase();
    if (searchTerm.length > 0) {
        document.getElementById('searchResults').style.display = 'block';
        searchProduct(searchTerm);
    } else {
        document.getElementById('searchResults').style.display = 'none';
    }
});

function searchProduct(searchTerm) {
    axios.get('http://localhost:3000/Product')
        .then(response => {
            let data = response.data;
            var filteredProducts = data.filter(product => {
                return product.nameProduct.toLowerCase().includes(searchTerm);
            });
            let html = filteredProducts.map(product => {
                return `
                    <div class="product-item" id="${product.id}">
                        <div class="product-image"><img src="${product.imageProduct}" alt=""></div>
                        <div class="information">
                        <div class="product-name">${product.nameProduct}</div>
                        <div class="product-price">${product.priceProduct}.000VND</div>
                        </div>
                    </div>`;
            }).join('');
            document.getElementById('searchResults').innerHTML = html;
            clickProduct()
        });
}
function clickProduct(){
    var list = document.querySelectorAll('.product-item')
    list.forEach(elm=>{
        elm.addEventListener('click',()=>{
            var id = elm.getAttribute('id')
            window.location.href = '/html/Product.html?id='+id
        })
    })
}

