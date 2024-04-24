import { changeApi } from "/main/changApi.js";
function start() {
    loadHeaderfooter()
    Getquery()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function Getquery() {
    const queryString = window.location.search
    const param = new URLSearchParams(queryString)
    const paramValue = param.get('param')
    if (paramValue == null) {
        renderProduct(null)
    } if (paramValue == 'T_shirts') {
        setContentView('Áo thun')
        getCategories('Áo thun', id => {
            renderProduct(id)
        })
    } if (paramValue == 'Polo_shirt') {
        setContentView('Áo Polo')
        getCategories('Áo Polo', id => {
            renderProduct(id)
        })
    } if (paramValue == 'sweater') {
        setContentView('Áo sweater')
        getCategories('sweater', id => {
            renderProduct(id)
        })
    } if (paramValue == 'trousers') {
        setContentView('Quần')
        getCategories('Quần', id => {
            renderProduct(id)
        })
    } if (paramValue == 'clothing') {
        setContentView('Áo')
        getCategories('Áo', id => {
            renderProduct(id)
        })
    }

}
function renderProduct(id) {
    var html = ``
    changeApi('Product', 'GET', null, Courese => {
        Courese.forEach(element => {
            var formatted = element.priceProduct.toLocaleString('vi-VN', { minimumFractionDigits: 0 });
            if (id == null) {
                html += `<div class="card" id="${element.id}">
            <img src="${element.imageProduct}" alt="">
            <p>${element.nameProduct}</p>
            <div class="Color" id='Color-span'>
            </div>
            <b>${formatted}.000VND</b>
        </div>`
            } else {
                if (element.idCategories == id) {
                    html += `<div class="card" id="${element.id}">
                <img src="${element.imageProduct}" alt="">
                <p>${element.nameProduct}</p>
                <div class="Color" id='Color-span'>
                </div>
                <b>${formatted}.000VND</b>
            </div>`
                }
            }
        })
        document.getElementById('show-cart').innerHTML = html
        show_color_product()
        click_product()
    })
}
function show_color_product() {
    var class_list_card = document.querySelectorAll('.card');
    changeApi('Product', 'GET', null, (Courese) => {
        class_list_card.forEach(element => {
            var id = element.getAttribute('id');
            var span_html = ``;
            var product = Courese.find(item => item.id === id);
            if (product) {
                product.colorProduct.forEach(value => {
                    span_html += `<span style="background-color: ${value}"></span>`;
                });
                element.querySelector('.Color').innerHTML = span_html;
            }
        });
    });
}
function click_product() {
    var class_list_card = document.querySelectorAll('.card')
    class_list_card.forEach(element => {
        element.addEventListener('click', () => {
            var id = element.getAttribute('id')
            console.log(id)
            window.location.href = '/html/Product.html?id=' + id
        })
    })
}
function setContentView(title) {
    var title_set = document.getElementById('title-set')
    title_set.innerHTML = title
}
function getCategories(name, callback) {
    changeApi('Categories', 'GET', null, Courese => {
        Courese.forEach(element => {
            if (element.nameCategories == name) {
                callback(element.id)
                return
            }
        });
    })
}