import { changeApi } from "/main/changApi.js";
import { getSession } from "/main/changSession.js";
function start() {
    loadHeaderfooter()
    renderCart()
    renderVoucher()
    payment()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function loading() {
    $("body").load("/html/loading.html");
}
function renderCart() {
    var html = ``
    var total_cart = 0
    var CartIs = false
    changeApi('Cart', 'GET', null, (Courese) => {
        Courese.forEach(element => {
            if (element.idUser == getSession()) {
                renderProduct(element.idProduct, (nameProduct, idProduct, imageProduct, priceProduct, quantityProduct) => {
                    var total = element.totalCart
                    CartIs = true
                    var formattedTotal = total.toLocaleString('vi-VN', { minimumFractionDigits: 0 })
                    total_cart += total
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
                    document.getElementById('total').innerHTML = total_cart.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + '.000 VND'
                    Delete()
                    Minus_Plus()
                })
            }
        });
        if (!CartIs) {
            document.getElementById('show-cart').innerHTML = 'Bạn chưa có sản phẩm nào'
            document.getElementById('total').innerHTML = '0'
        }
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
                            renderProduct(elm.idProduct, (nameProduct, idProduct, imageProduct, priceProduct, quantityProduct) => {
                                var totalNew = quantity * parseInt(priceProduct)
                                var data = {
                                    id: elm.id,
                                    idProduct: elm.idProduct,
                                    idUser: getSession(),
                                    quantityCart: quantity,
                                    totalCart: totalNew,
                                    sizeCart: elm.sizeCart,
                                    colorCart: elm.colorCart
                                }
                                changeApi("Cart/" + id, "PUT", data, renderCart)
                            })
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
                        var totalCart = elm.totalCart
                        var quantity = quantityCart += 1
                        renderProduct(elm.idProduct, (nameProduct, idProduct, imageProduct, priceProduct, quantityProduct) => {
                            var totalNew = quantity * priceProduct
                            var data = {
                                id: elm.id,
                                idProduct: elm.idProduct,
                                idUser: getSession(),
                                quantityCart: quantity,
                                totalCart: totalNew,
                                sizeCart: elm.sizeCart,
                                colorCart: elm.colorCart
                            }
                            changeApi("Cart/" + id, "PUT", data, renderCart)
                        })
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
            Swal.fire({
                title: "Thông báo",
                text: "Bạn có muốn xóa khỏi giỏ hàng?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
            }).then((result) => {
                if (result.isConfirmed) {
                    var id = elm.getAttribute('id')
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
                        title: "Xóa thành công"
                    });
                    setTimeout(() => {
                        changeApi('Cart/' + id, 'DELETE', null, renderCart)
                    }, 2000);
                }
            })
        })
    })
}
function renderVoucher() {
    var html = ``
    changeApi('Voucher', 'GET', null, Courese => {
        Courese.forEach(element => {
            html += `
            <div class="container-voucher" >
            <div class="content-container-voucher">
                <h2>${element.codeVoucher}</h2>
                <p>Nhập mã ${element.codeVoucher} để giảm ${element.valueVoucher}k cho đơn từ ${element.conditionVoucher}k</p>
                <button id="${element.id}" class="Copy">Sao chép</button>
            </div>
        </div>`
        })
        document.getElementById('show-voucher').innerHTML = html
        eventCopyVoucher()
    })
}
function eventCopyVoucher() {
    var Button_element = document.querySelectorAll(".Copy")
    Button_element.forEach(elm => {
        elm.addEventListener('click', () => {
            var voucher_Id = elm.getAttribute('id')
            changeApi('Voucher', 'GET', null, Courese => {
                Courese.forEach(elm => {
                    if (elm.id == voucher_Id) {
                        var code = elm.codeVoucher
                        navigator.clipboard.writeText(code)
                        Swal.fire({
                            title: "Thông báo",
                            text: "Sao chép thành công",
                            icon: "success"
                        })
                    }
                })
            })
        })
    })
}
function payment() {
    var btn = document.getElementById('payment')
    btn.addEventListener('click', () => {
        loading()
        setTimeout(() => {
            window.location.href = '/html/payment.html'
        }, 1000);
    })
}