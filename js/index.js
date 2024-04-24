import { startSession, getSession, endSession } from "/main/changSession.js";
import { changeApi } from "/main/changApi.js";
function start() {
    loadHeaderfooter()
    animation()
    buyNow()
    btn_introduce()
    render_product_new()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function animation() {
    var box_content_1 = document.getElementById("box-content-1")
    var box_content_2 = document.getElementById("box-content-2")
    var content_text_brand = document.querySelectorAll('#content-text-brand')
    var content_img_brand = document.querySelectorAll('#content-img-brand')
    window.addEventListener('scroll', () => {
        if (isIntoView(box_content_1)) {
            box_content_1.classList.add("active")
            box_content_2.classList.add("active")
        }
        content_text_brand.forEach((value) => {
            if (isIntoView(value)) {
                value.classList.add("active")
            }
        })
        content_img_brand.forEach((value) => {
            if (isIntoView(value)) {
                value.classList.add("active")
            }
        })
    })
}
function isIntoView(elm) {
    const rect = elm.getBoundingClientRect()
    return rect.bottom <= window.innerHeight
}
function buyNow() {
    var btn = document.getElementById('btn-img-banner')
    btn.addEventListener('click', () => {
        window.location.href = '/html/View_all_product.html'
    })
}
function btn_introduce() {
    var box_1 = document.getElementById('box-content-1')
    var box_2 = document.getElementById('box-content-2')

    event_introduce_AllProduct(box_1, 'clothing')
    event_introduce_AllProduct(box_2, 'trousers')
}
function event_introduce_AllProduct(link, condition) {
    link.addEventListener('click', () => {
        var param = '?param=' + condition
        window.location.href = '/html/View_all_product.html' + param
    })
}
function render_product_new() {
    changeApi('Product', 'GET', null, (Courese) => {
        var a = 1
        var html = ``
        for (var i = Courese.length - 1; i >= 0; i--) {
            if (a > 4) {
                break
            }
            var formatted = Courese[i].priceProduct.toLocaleString('vi-VN',{minimumFractionDigits: 0})
            html += `<div class="card" id="${Courese[i].id}">
            <img src="${Courese[i].imageProduct}" alt="">
            <p>${Courese[i].nameProduct}</p>
            <div class="Color" id='Color-span'>
            </div>
            <b>${formatted}.000VND</b>
        </div>`
            a++
        }


        document.getElementById('show-product-new').innerHTML = html
        click_product()
        show_color_product()
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