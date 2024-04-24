import { changeApi } from "/main/changApi.js";
import { getSession } from "/main/changSession.js";
function start() {
    loadHeaderfooter()
    render_product()
}
start()

function render_product() {
    var id = getParamid()
    var view_img = document.getElementById('view_img')
    var view_name = document.getElementById('view_name')
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
            alert('Vui lòng đăng nhập')
        } else {
            var size_value = size.innerText
            var color_value = color.innerText
            var id = 0
            if (size_value == '') {
                alert('Vui lòng chọn size sản phẩm')
            } else if (color_value == '') {
                alert('Vui lòng chọn màu sản phẩm')
            } else {
                changeApi('Cart', 'GET', null, Courese => {
                    Courese.forEach(elm => {
                        id = elm.id
                    })
                    id++
                    var data = {
                        id: id.toString(),
                        idProduct: idProduct,
                        idUser: getSession(),
                        quantityCart: quantity_value,
                        sizeCart: size_value,
                        colorCart: color_value
                    }
                    console.log(data)
                    changeApi('Cart', "POST", data, () => {
                        alert('Thêm vào giỏ hành thành công')
                    })
                })
            }
        }
    })
}
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}