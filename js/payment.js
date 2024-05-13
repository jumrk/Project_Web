import { getSession, endSession } from "/main/changSession.js";
import { changeApi } from "/main/changApi.js";
function start() {
    back()
    renderUser()
    logOut()
    renderAddress()
    checkedPaymet()
    renderCart()
    performPayment()
}
start()

function renderUser() {
    var Email = document.getElementById('Email-user')
    var Phone = document.getElementById('phone')
    changeApi('User', 'GET', null, Courese => {
        Courese.forEach(element => {
            if (element.id == getSession()) {
                Email.innerHTML = element.emailUser
                Phone.value = element.phoneUser
            }
        });
    })
}
function renderCart() {
    var html = ``
    var total = 0
    changeApi('Cart', 'GET', null, Courese => {
        Courese.forEach(element => {
            if (element.idUser == getSession()) {
                renderProduct(element.idProduct, (imgProduct, nameProduct, priceProduct) => {
                    var subtotal = element.totalCart
                    var formattedTotal = subtotal.toLocaleString('vi-VN', { minimumFractionDigits: 0 })
                    html += ` 
                    <div class="product">
                    <div class="img-product">
                        <img src="${imgProduct}" alt="">
                        <label>${element.quantityCart}</label>
                    </div>
                    <div class="infor-product">
                        <b>${nameProduct}</b>
                        <p>${element.colorCart}/${element.sizeCart}</p>
                    </div>
                    <div class="total-product">
                        <p>${formattedTotal}.000VND</p>
                    </div>
                </div>`
                    document.getElementById('show-product-order').innerHTML = html
                })
            }
            return total += element.totalCart
        })
        if (voucher(total, totalVoucher => {
            var provisional = document.getElementById('Provisional-value')
            var total_order = document.getElementById('total-order')
            var formattedprovisional = totalVoucher.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + '.000VND'
            var totalNumber = totalVoucher + 50
            var formattedTotal = totalNumber.toLocaleString('vi-VN', { minimumFractionDigits: 0 })
            provisional.innerHTML = formattedprovisional
            total_order.innerHTML = formattedTotal

        })) {
            Swal.fire({
                title: "Thông báo",
                text: "Áp dụng mã thành công",
                icon: "success"
            })
        } else {
            var provisional = document.getElementById('Provisional-value')
            var total_order = document.getElementById('total-order')
            var formattedprovisional = total.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + '.000VND'
            var total_orderValue = total + 50
            var formattedTotalOrder = total_orderValue.toLocaleString('vi-VN', { minimumFractionDigits: 0 })
            provisional.innerHTML = formattedprovisional
            total_order.innerHTML = formattedTotalOrder
        }
    })
}
function renderProduct(id, Callback) {
    changeApi('Product', 'GET', null, Courese => {
        Courese.forEach(element => {
            if (element.id == id) {
                Callback(element.imageProduct, element.nameProduct, element.priceProduct)
            }
        })
    })
}
function checkedPaymet() {
    var boxcheck = document.getElementById('radio-checked')
    boxcheck.addEventListener('click', () => {
        boxcheck.classList.add('active')
    })
}
function renderAddress() {
    var html = ``
    var addressIs = false
    var address_select = document.getElementById('address-select')
    var address_add = document.getElementById('add-address')
    changeApi('Address_user', 'GET', null, Courese => {
        Courese.forEach(element => {
            if (element.idUser == getSession()) {
                addressIs = true
                console.log(element.idUser)
                html += `<option value="${element.address}">${element.address}</option>`
            }
        })
        if (!addressIs) {
            address_select.style.display = 'none'
            address_add.style.display = 'block'
            address_add.addEventListener('click', () => {
                window.location.href = '/html/User.html'
            })
        }
        address_select.innerHTML = html
    })
}
function voucher(total, Callback) {
    var btn = document.getElementById('btn-apply-voucher');
    var value_input = document.getElementById('code-voucher');

    btn.addEventListener('click', () => {
        var code = value_input.value;
        if (code == '') {
            Swal.fire({
                title: "Cảnh báo",
                text: "Vui lòng nhập mã!",
                icon: "error"
            })
        } else {
            var codeIs = false;
            var condition = false;
            var totalNumber = parseInt(total);
            changeApi('Voucher', 'GET', null, Courese => {
                Courese.forEach(element => {
                    if (element.codeVoucher == code) {
                        codeIs = true;
                        if (totalNumber > element.conditionVoucher) {
                            condition = true;
                            var totalVoucher = totalNumber - element.valueVoucher;
                            Callback(totalVoucher);
                            value_input.disabled = true;
                            btn.disabled = true;
                            Swal.fire({
                                title: "Thông báo",
                                text: "Áp dụng mã thành công",
                                icon: "success"
                            })
                        }
                    }
                });
                if (!codeIs) {
                    Swal.fire({
                        title: "Cảnh báo",
                        text: "Mã code không tồn tại!",
                        icon: "error"
                    })
                } else if (!condition) {
                    Swal.fire({
                        title: "Cảnh báo",
                        text: "Đơn hàng của bạn không đạt điều kiện!",
                        icon: "error"
                    })
                }
            });
        }
    });
}
function performPayment() {
    var btn = document.getElementById('btn-payment')
    var procedure_payment = document.getElementById('procedure-payment')
    var address_select = document.getElementById('address-select')
    var phone = document.getElementById('phone')
    var total = document.getElementById('total-order')
    btn.addEventListener('click', () => {
        if (!procedure_payment.checked) {
            Swal.fire({
                title: "Cảnh báo",
                text: "Vui lòng chọn phương thức thanh toán",
                icon: "error"
            })
        } else if (phone.value == '') {
            Swal.fire({
                title: "Cảnh báo",
                text: "Vui lòng nhập số điện thoại",
                icon: "error"
            })
        } else if (address_select.value == '') {
            Swal.fire({
                title: "Cảnh báo",
                text: "Hãy thêm địa chỉ trước rồi thanh toán",
                icon: "error"
            })
        } else {
            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            var FormattedDate = day + '-' + month + '-' + year
            changeApi('Order', 'GET', null, Courese => {
                var idOrder = 0
                Courese.forEach(element => {
                    idOrder = element.id
                })
                idOrder++
                var dataOrder = {
                    id: idOrder.toString(),
                    idUser: getSession(),
                    dateOrder: FormattedDate,
                    phone: phone.value,
                    address: address_select.value,
                    statusOrder: "Đang xác nhận",
                    statusPayment: "Chưa thanh toán",
                    total: parseInt(total.innerHTML.replace(/\./g, ''))
                }
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
                    title: "Đặt hàng thành công"
                });
                setTimeout(() => {
                    changeApi('Order', 'POST', dataOrder, null)
                    changeApi('orderDetails', 'GET', null, Courese => {
                        var idOrderDetail = 0
                        Courese.forEach(elm => {
                            idOrderDetail = elm.id
                        })
                        changeApi('Cart', 'GET', null, Courese => {
                            Courese.forEach(element => {
                                if (element.idUser == getSession()) {
                                    idOrderDetail++
                                    var dataOrderdetail = {
                                        id: idOrderDetail.toString(),
                                        idOrder: idOrder.toString(),
                                        idProduct: element.idProduct,
                                        quantityOrder: element.quantityCart,
                                        totalOrder: element.totalCart,
                                        colorOrder: element.colorCart,
                                        sizeOrder: element.sizeCart
                                    }
                                    changeApi('orderDetails', 'POST', dataOrderdetail, null)
                                    changeApi('Cart/' + element.id, 'DELETE', null, null)
                                }
                            })

                            window.location.href = '/html/User.html'
                        })
                    })
                }, 2000);
            })

        }
    })
}
function logOut() {
    var btn = document.getElementById('btn-logout')
    btn.addEventListener('click', () => {
        Swal.fire({
            title: "Thông báo",
            text: "Bạn có muốn đăng xuất",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
            cancelButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                endSession()
                window.location.href = '/html/Login.html'
            }
        })
    })
}
function back() {
    var btn = document.getElementById('back')
    btn.addEventListener('click', () => {
        Swal.fire({
            title: "Thông báo",
            text: "Bạn có muốn thoát khỏi thanh toán",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
            cancelButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                window.history.back()
            }
        })
    })
}