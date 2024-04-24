import { changeApi } from "/main/changApi.js";
import { getSession } from "/main/changSession.js";
function start() {
    loadHeaderfooter()
    renderCart()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function renderCart() {
    var html = ``
    changeApi('Cart', 'GET', null, (Courese) => {
        Courese.forEach(element => {
            if (element.idUser == getSession()) {
                renderProduct(element.idProduct, (nameProduct, idProduct, imageProduct, priceProduct, quantityProduct) => {
                    var total = parseInt(element.quantityCart) * parseInt(priceProduct)
                    var formattedTotal = total.toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                    html += `
                    <div class="information-product">
                    <div class="product">
                        <div class="img-product">
                            <ion-icon id="${element.id}" class="delete_list" name="close-outline"></ion-icon>
                            <img src="${imageProduct}" alt="">
                        </div>
                        <div class="name-product">
                            <p>${nameProduct}</p>
                            <div class="product-color-size">
                               <p>${element.sizeCart}</p>
                               <p>/</p>
                               <p>${element.colorCart}</p>
                            </div>
                        </div>
                    </div>
                    <div class="price-quantity">
                        <p>${formattedTotal}.000VND</p>
                        <div class="quantity">
                            <button class="Minus" id="${element.id}">-</button>
                            <span>${element.quantityCart}</span>
                            <button class="Plus" id="${element.id}">+</button>
                        </div>
                    </div>
                </div>`
                    document.getElementById('show-cart').innerHTML = html
                    Delete()
                    Minus_Plus()
                })
            }
        });
    })
}
function renderProduct(id, callback) {
    changeApi('Product', 'GET', null, Courese => {
        Courese.forEach(elm => {
            if (elm.id == id) {
                callback(elm.nameProduct, elm.id, elm.imageProduct, elm.priceProduct, elm.quantityProduct)
            }
        })
    })
}
function Minus_Plus() {
    var Minus_list = document.querySelectorAll('.Minus')
    var Plus_list = document.querySelectorAll('.Plus')
    Minus_list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            changeApi('Cart', 'GET', null, (Courese) => {
                Courese.forEach(elm => {
                    if (elm.id == id) {
                        var quantityCart = parseInt(elm.quantityCart)
                        if (quantityCart > 1) {
                            var quantity = quantityCart -= 1
                            var data = {
                                id: elm.id,
                                idProduct: elm.idProduct,
                                idUser: getSession(),
                                quantityCart: quantity,
                                sizeCart: elm.sizeCart,
                                colorCart: elm.colorCart
                            }
                            changeApi("Cart/" + id, "PUT", data, renderCart)
                        }
                    }
                })
            })
        })
    })
    Plus_list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            changeApi('Cart', 'GET', null, (Courese) => {
                Courese.forEach(elm => {
                    if (elm.id == id) {
                        var quantityCart = parseInt(elm.quantityCart)
                        var quantity = quantityCart += 1
                        var data = {
                            id: elm.id,
                            idProduct: elm.idProduct,
                            idUser: getSession(),
                            quantityCart: quantity,
                            sizeCart: elm.sizeCart,
                            colorCart: elm.colorCart
                        }
                        changeApi("Cart/" + id, "PUT", data, renderCart)
                    }
                })
            })
        })
    })
}
function Delete() {
    var class_list = document.querySelectorAll('.delete_list')
    class_list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            changeApi('Cart/' + id, 'DELETE', null, () => {
                alert('xóa thành công')
                renderCart()
            })
        })
    })
}