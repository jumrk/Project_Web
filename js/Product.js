import { changeApi } from "/main/changApi.js";
import { getSession } from "/main/changSession.js";
function start() {
    loadHeaderfooter()
    render_product()
    render_product_new()
}
start()
function loading() {
    $("body").load("/html/loading.html");
}
function render_product() {
    var id = getParamid()
    var view_img = document.getElementById('view_img')
    var view_name = document.getElementById('view_name')
    var view_brand = document.getElementById('Show-brand')
    var view_price = document.getElementById('view_price')
    var view_description = document.getElementById('show-descript')
    changeApi('Product', 'GET', null, (Courese) => {
        Courese.forEach(elm => {
            if (elm.id == id) {
                var formatted = elm.priceProduct.toLocaleString('vi-VN', { minimumFractionDigits: 0 })
                view_img.src = elm.imageProduct
                view_name.innerHTML = elm.nameProduct
                view_price.innerHTML = formatted + '.000'
                view_description.innerHTML = elm.descriptionProduct
                render_brand(elm.brandId, nameBrand => {
                    view_brand.innerHTML = nameBrand.toUpperCase()
                })
            }
        })
        show_descript_product()
        render_size(id)
        render_color(id)
        plus()
        minus()
        add_cart()
    })
}
function render_brand(id, Callback) {
    changeApi('Brand', 'GET', null, Courses => {
        Courses.forEach(elm => {
            if (elm.id == id) {
                Callback(elm.nameBrand)
            }
        })
    })
}
function getParamid() {
    const queryString = window.location.search
    const param = new URLSearchParams(queryString)
    return param.get('id')
}
function render_size(id) {
    var html = ``
    var view = document.getElementById('show-size')
    changeApi('Product', 'GET', null, Courese => {
        Courese.forEach(value => {
            if (value.id == id) {
                value.sizeProduct.forEach(elm_size => {
                    html += ` <input type="radio" name="size" id="${elm_size}" value="${elm_size}">
                    <label for="${elm_size}">${elm_size}</label>`
                })
            }
        })
        view.innerHTML = html
        select_size()
    })
}
function render_color(id) {
    var html = ``
    var view = document.getElementById('show-color')
    changeApi('Product', 'GET', null, Courese => {
        Courese.forEach(value => {
            if (value.id == id) {
                value.colorProduct.forEach(elm_color => {
                    html += `  <input title="color" type="radio" name="Color" id="${elm_color}" value="${elm_color}">
                    <label for="${elm_color}" style="background-color: ${elm_color}"></label>`
                })
            }
        })
        view.innerHTML = html
        select_color()
    })

}
function select_size() {
    var size = document.getElementsByName("size")
    var result = document.getElementById("result-size")

    size.forEach((value) => {
        value.addEventListener("change", () => {
            value.style.backgroundColor = 'black'
            value.style.color = 'white'
            if (value.checked == true) {
                result.innerHTML = value.value
                console.log(value)
            }
        })
    })
}
function select_color() {
    var size = document.getElementsByName("Color")
    var result = document.getElementById("result-color")

    size.forEach((value) => {
        value.addEventListener("change", () => {
            if (value.checked == true) {
                result.innerHTML = value.value
                console.log(value)
            }
        })
    })
}
function minus() {
    var number = document.getElementById("value-number")
    var btn = document.getElementById('minus')
    btn.addEventListener('click', () => {
        if (number.value <= 1) {
            number.value = 1
            console.log(number.value)
        } else {
            number.value--
        }
    })
}
function plus() {
    var value_number = document.getElementById("value-number")
    var btn = document.getElementById('plus')
    btn.addEventListener('click', () => {
        value_number.value++
        console.log(value_number.value)
    })
}
function show_descript_product() {
    var click = document.getElementById("click-descript")
    var show = document.getElementById("show-descript")

    click.addEventListener('click', () => {
        if (show.style.opacity == "1") {
            show.style.opacity = "0"
            show.style.maxHeight = "0"
        } else {
            show.style.opacity = "1"
            show.style.maxHeight = "100%"
        }
    })
}
function add_cart() {
    var btn_add = document.getElementById('Add_cart')
    var idProduct = getParamid()
    var quantity = document.getElementById('value-number')
    var size = document.getElementById('result-size')
    var color = document.getElementById('result-color')

    btn_add.addEventListener('click', () => {
        var quantity_value = quantity.value
        console.log(quantity_value)
        if (getSession() == null) {
            Swal.fire({
                title: "Cảnh báo",
                text: "Vui lòng đăng nhập",
                icon: "error"
            });
        } else {
            var size_value = size.innerText
            var color_value = color.innerText
            var id = 0
            if (size_value == '') {
                Swal.fire({
                    title: "Cảnh báo",
                    text: "Vui lòng chọn size sản phẩm",
                    icon: "error"
                })
            } else if (color_value == '') {
                Swal.fire({
                    title: "Cảnh báo",
                    text: "Vui lòng chọn màu sản phẩm",
                    icon: "error"
                })
            } else {
                changeApi('Cart', 'GET', null, Courese => {
                    Courese.forEach(elm => {
                        id = elm.id
                    })
                    id++
                    getPriceProduct(idProduct, price => {
                        var totalCart = parseInt(quantity_value) * parseInt(price)
                        var data = {
                            id: id.toString(),
                            idProduct: idProduct,
                            idUser: getSession(),
                            quantityCart: quantity_value,
                            totalCart: totalCart,
                            sizeCart: size_value,
                            colorCart: color_value
                        }
                        console.log(data)
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.onmouseenter = Swal.stopTimer;
                                toast.onmouseleave = Swal.resumeTimer;
                            }
                        });
                        Toast.fire({
                            icon: "success",
                            title: "Thêm giỏ hàng thành công"
                        });
                        setTimeout(() => {
                            changeApi('Cart', "POST", data, null)
                        }, 2000);
                    })

                })
            }
        }
    })
}
function getPriceProduct(id, Callback) {
    changeApi('Product', 'GET', null, Courese => {
        Courese.forEach(elm => {
            if (elm.id == id) {
                Callback(elm.priceProduct)
                return
            }
        })
    })
}
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function render_product_new() {
    changeApi('Product', 'GET', null, (Courese) => {
        var a = 1
        var html = ``
        for (var i = Courese.length - 1; i >= 0; i--) {
            if (a > 4) {
                break
            }
            var formatted = Courese[i].priceProduct.toLocaleString('vi-VN', { minimumFractionDigits: 0 })
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
            loading()
            setTimeout(() => {
                window.location.href = '/html/Product.html?id=' + id
            }, 1000);
        })
    })
}