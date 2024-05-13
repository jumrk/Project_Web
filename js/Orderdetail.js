import { changeApi } from "/main/changApi.js";
function start() {
    loadHeaderfooter()
    renderOrder()
    renderOrderdetail()
    deleteOrder()
    back()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}

function back() {
    var btn = document.getElementById('back')
    btn.addEventListener('click', () => {
        Swal.fire({
            title: "Bạn có muốn quay về?",
            text: "Lựa chọn dưới đây!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Quay về"
        }).then((result) => {
            if (result.isConfirmed) {
                window.history.back()
            }
        });
    })
}
function getParam() {
    const queryString = window.location.search
    const param = new URLSearchParams(queryString)
    return param.get("id")
}
function renderOrderdetail() {
    var html = ``
    changeApi('orderDetails', 'GET', null, Courese => {
        Courese.forEach(elm => {
            if (elm.idOrder == getParam()) {
                var totalFormat = elm.totalOrder.toLocaleString('vi-VN', { minimumFactionDigits: 0 }) + '.000VND'
                renderProduct(elm.idProduct, (imageProduct, nameProduct, priceProduct,
                    idCategories, brandId, descriptionProduct, quantityProduct,
                    colorProduct, sizeProduct) => {
                    html += `
                    <div class="card">
                    <div class="img">
                        <img src="${imageProduct}" alt="">
                    </div>
                    <div class="name-size-color-product">
                        <b>${nameProduct}</b>   
                        <p>${elm.sizeOrder}/<span style="height: 15px;margin-left: 5px;width: 15px;display: inline-block; border: 1px solid black; border-radius: 5px; background-color: ${elm.colorOrder} ;"></span></p>
                    </div>
                    <div class="total-product">
                        <b>x${elm.quantityOrder}</b>
                        <p>${totalFormat}</p>
                    </div>
                </div>`

                    document.getElementById('show-card').innerHTML = html
                })
            }
        })
    })
}
function renderProduct(id, Callback) {
    changeApi('Product', 'GET', null, Courese => {
        Courese.forEach(element => {
            if (element.id == id) {
                Callback(element.imageProduct, element.nameProduct, element.priceProduct,
                    element.idCategories, element.brandId, element.descriptionProduct, element.quantityProduct,
                    element.colorProduct, element.sizeProduct)
            }
        })
    })
}
function renderOrder() {
    var orderStatus = document.getElementById('show-order-status')
    var totalOrder = document.getElementById('show-total-order')
    changeApi('Order', 'GET', null, Courese => {
        Courese.forEach(elm => {
            if (elm.id == getParam()) {
                var Totalformat = elm.total.toLocaleString('vi-VN', { minimumFactionDigits: 0 }) + '.000VND'
                orderStatus.innerHTML = elm.statusOrder
                totalOrder.innerHTML = Totalformat
            }
        })
    })
}
function deleteOrder() {
    var btnDelete = document.getElementById('btn-delete')
    btnDelete.addEventListener('click', () => {
        Swal.fire({
            title: "Bạn có muốn hủy đơn hàng?",
            text: "Lựa chọn dưới đây!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "Hủy",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý"
        }).then((result) => {
            if (result.isConfirmed) {
                changeApi('Order', 'GET', null, Courese => {
                    Courese.forEach(elm => {
                        if (elm.id == getParam()) {
                            if (elm.statusOrder === 'Đang vận chuyển') {
                                Swal.fire({
                                    title: "Cảnh báo",
                                    text: "Bạn không thể hủy đơn hàng vì đang vận chuyển!",
                                    icon: "error"
                                });
                            } else {
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
                                    title: "Hủy thành công"
                                });
                                setTimeout(() => {
                                    changeApi('orderDetails', 'GET', null, Courese => {
                                        Courese.forEach(element => {
                                            if (element.idOrder == getParam()) {
                                                renderProduct(element.idProduct, (imageProduct, nameProduct, priceProduct,
                                                    idCategories, brandId, descriptionProduct, quantityProduct,
                                                    colorProduct, sizeProduct) => {
                                                    var data = {
                                                        id: element.idProduct,
                                                        nameProduct: nameProduct,
                                                        idCategories: idCategories,
                                                        brandId: brandId,
                                                        imageProduct: imageProduct,
                                                        descriptionProduct: descriptionProduct,
                                                        priceProduct: priceProduct,
                                                        quantityProduct: parseInt(quantityProduct) + parseInt(element.quantityOrder),
                                                        colorProduct: colorProduct,
                                                        sizeProduct: sizeProduct,
                                                    }
                                                    changeApi('Product/' + element.idProduct, 'PUT', data, null)
                                                    changeApi('orderDetails/' + element.id, 'DELETE', null, null)
                                                })

                                            }
                                        })
                                    })
                                    changeApi('Order/' + getParam(), 'DELETE', null, () => {
                                        window.location.href = '/html/User.html';
                                    })
                                }, 2000);

                            }
                        }
                    })
                })
            }
        });
    })
}