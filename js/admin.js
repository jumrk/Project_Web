import { changeApi } from "/main/changApi.js";
function start() {
    statistics()
    showContent()
    renderProduct()
    searchProduct()
    renderOrder()
    renderVoucher()
    renderAccount()
    addVoucher()
    addProduct()
    renderMessenger()
    document.getElementById('searchInput').addEventListener('input', searchProduct);
}
start()
function showContent() {
    var contents = document.querySelectorAll('.show')
    var btn_thongke = document.getElementById('btn-thongke')
    var btn_product = document.getElementById('btn-product')
    var btn_account = document.getElementById('btn-account')
    var btn_order = document.getElementById('btn-order')
    var btn_voucher = document.getElementById('btn-voucher')
    var btn_messenger = document.getElementById('btn-messenger')
    btn_thongke.addEventListener('click', () => {
        contents.forEach(elm => {
            elm.classList.remove('active')
        })
        contents[0].classList.add('active')
    })
    btn_product.addEventListener('click', () => {
        contents.forEach(elm => {
            elm.classList.remove('active')
        })
        contents[1].classList.add('active')
    })
    btn_account.addEventListener('click', () => {
        contents.forEach(elm => {
            elm.classList.remove('active')
        })
        contents[2].classList.add('active')
    })
    btn_order.addEventListener('click', () => {
        contents.forEach(elm => {
            elm.classList.remove('active')
        })
        contents[3].classList.add('active')
    })
    btn_voucher.addEventListener('click', () => {
        contents.forEach(elm => {
            elm.classList.remove('active')
        })
        contents[4].classList.add('active')
    })
    btn_messenger.addEventListener('click', () => {
        contents.forEach(elm => {
            elm.classList.remove('active')
        })
        contents[5].classList.add('active')
    })
}
function statistics() {
    changeApi('Product', 'GET', null, Courese => {
        document.getElementById('total-product').innerHTML = Courese.length
    })
    changeApi('User', 'GET', null, Courese => {
        document.getElementById('total-account').innerHTML = Courese.length
    })
    changeApi('Order', 'GET', null, Courese => {
        var total = 0
        document.getElementById('total-order').innerHTML = Courese.length
        Courese.forEach(elm => {
            total += parseFloat(elm.total)
        })
        var formatTotal = total.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + ",000VND"
        document.getElementById('total-revenue').innerHTML = formatTotal
    })
}
function renderProduct() {
    var html = ``
    changeApi("Product", "GET", null, Courese => {
        Courese.forEach(data => {
            renderCategories(data.idCategories, nameCategories => {
                renderBrand(data.brandId, nameBrand => {
                    html += `
                <tr>
                <td>${data.id}</td>
                <td>${data.nameProduct}</td>
                <td><img src="${data.imageProduct}" alt=""></td>
                <td>${nameCategories}</td>
                <td>${nameBrand}</td>
                <td>${data.descriptionProduct}</td>
                <td>${data.priceProduct}.000VND</td>
                <td>${data.quantityProduct}</td>
                <td>${data.colorProduct}</td>
                <td>${data.sizeProduct}</td>
                <td><ion-icon class="edit" id="${data.id}" data-bs-toggle="modal" data-bs-target="#editProduct" name="settings-outline"></ion-icon>
                    <ion-icon class="delete-product" id="${data.id}" name="trash-outline"></ion-icon>
                </td>
            </tr>`
                    document.getElementById('renderProduct').innerHTML = html
                    editProduct()
                    deleteProduct()
                })
            })
        })
    })
}

function renderCategories(id, Callback) {
    changeApi('Categories', "GET", null, Courese => {
        Courese.forEach(elm => {
            if (elm.id == id) {
                Callback(elm.nameCategories)
            }
        })
    })
}
function renderBrand(id, Callback) {
    changeApi('Brand', "GET", null, Courese => {
        Courese.forEach(elm => {
            if (elm.id == id) {
                Callback(elm.nameBrand)
            }
        })
    })
}
function addProduct() {
    var btn = document.getElementById('btn-select');
    var input_color = document.getElementById('color');
    var input_size = document.getElementById('size');
    var show_color = document.getElementById('show-color');
    var show_size = document.getElementById('show-size');
    var nameProduct = document.getElementById('nameProduct');
    var categoriesProduct = document.getElementById('categoriesProduct');
    var brandProduct = document.getElementById('brandProduct');
    var priceProduct = document.getElementById('priceProduct');
    var quantityProduct = document.getElementById('quantityProduct');
    var imgProduct = document.getElementById('imgProduct');
    var detailProduct = document.getElementById('detailProduct');
    var btnAdd = document.getElementById('btn-add-Product');
    var colorArr = [];
    var sizeArr = [];

    btn.addEventListener('click', () => {
        if (!colorArr.includes(input_color.value)) {
            colorArr.push(input_color.value);
            var span = '';
            colorArr.forEach(elm => {
                span += `<span style="height: 20px;margin-right: 5px;width: 20px;display: inline-block; border-radius: 5px; background-color: ${elm};"></span>`;
            });
            show_color.innerHTML = span;
        }
        if (input_size.value !== '') {
            if (!sizeArr.includes(input_size.value)) {
                sizeArr.push(input_size.value);
                show_size.innerHTML = sizeArr.join(', ');
            }
        }
    });

    btnAdd.addEventListener('click', () => {
        if (nameProduct.value == '' || categoriesProduct.value == '' || brandProduct.value == '' || priceProduct.value == '' || quantityProduct.value == '' || imgProduct.value == '' || detailProduct.value == '') {
            alert('Vui lòng nhập dữ liệu');
        } else {
            var file = imgProduct.files[0];
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var value_fileReader = event.target.result;
                changeApi('Product', "GET", null, Courese => {
                    var id = 0;
                    Courese.forEach(elm => {
                        id = parseInt(elm.id);
                    });
                    id++;
                    var data = {
                        id: id.toString(),
                        nameProduct: nameProduct.value,
                        idCategories: categoriesProduct.value,
                        brandId: brandProduct.value,
                        imageProduct: value_fileReader,
                        descriptionProduct: detailProduct.value,
                        priceProduct: parseInt(priceProduct.value),
                        quantityProduct: quantityProduct.value,
                        colorProduct: colorArr,
                        sizeProduct: sizeArr,
                    };
                    changeApi('Product', 'POST', data, renderProduct);
                });
            };
            fileReader.readAsDataURL(file);
        }
    });
}
function editProduct() {
    var list = document.querySelectorAll('.edit')
    var nameProductEdit = document.getElementById('nameProductEdit')
    var categoriesProductEdit = document.getElementById('categoriesProductEdit')
    var brandProductEdit = document.getElementById('brandProductEdit')
    var priceProductEdit = document.getElementById('priceProductEdit')
    var quantityProductEdit = document.getElementById('quantityProductEdit')
    var imgProductEdit = document.getElementById('imgProductEdit')
    var colorEdit = document.getElementById('colorEdit')
    var sizeProductEdit = document.getElementById('sizeProductEdit')
    var detailProductedit = document.getElementById('detailProductedit')
    var btn = document.getElementById('submit-edit-Product')
    list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            renderelementProduct(id, (nameProduct, idCategories, brandId, imageProduct, descriptionProduct, priceProduct, quantityProduct, colorProduct, sizeProduct) => {
                nameProductEdit.value = nameProduct
                categoriesProductEdit.value = idCategories
                brandProductEdit.value = brandId
                priceProductEdit.value = priceProduct
                quantityProductEdit.value = quantityProduct
                sizeProductEdit.value = sizeProduct
                detailProductedit.value = descriptionProduct
                colorEdit.value = colorProduct
                btn.addEventListener('click', () => {
                    if (imgProductEdit.value == '') {
                        if (nameProductEdit.value == '' ||
                            categoriesProductEdit.value == '' ||
                            brandProductEdit.value == '' ||
                            priceProductEdit.value == '' ||
                            quantityProductEdit.value == '' ||
                            sizeProductEdit.value == '' ||
                            detailProductedit.value == '' ||
                            colorEdit.value == '') {
                            alert('Vui lòng nhập dữ liệu')
                        } else {
                            var data = {
                                id: id,
                                nameProduct: nameProductEdit.value,
                                idCategories: categoriesProductEdit.value,
                                brandId: brandProductEdit.value,
                                imageProduct: imageProduct,
                                descriptionProduct: detailProductedit.value,
                                priceProduct: priceProductEdit.value,
                                quantityProduct: quantityProductEdit.value,
                                colorProduct: colorEdit.value,
                                sizeProduct: sizeProductEdit.value
                            }
                            changeApi('Product/' + id, "PUT", data, renderProduct)
                        }
                    } else {
                        if (nameProductEdit.value == '' ||
                            categoriesProductEdit.value == '' ||
                            brandProductEdit.value == '' ||
                            priceProductEdit.value == '' ||
                            quantityProductEdit.value == '' ||
                            sizeProductEdit.value == '' ||
                            detailProductedit.value == '' ||
                            colorEdit.value == '' ||
                            imgProductEdit.value == ''
                        ) {
                            alert('Vui lòng nhập dữ liệu')
                        } else {
                            var file = imgProductEdit.files[0]
                            var fileReader = new FileReader()
                            fileReader.onload = function (event) {
                                var file_value = event.target.result
                                var data = {
                                    id: id,
                                    nameProduct: nameProductEdit.value,
                                    idCategories: categoriesProductEdit.value,
                                    brandId: brandProductEdit.value,
                                    imageProduct: file_value,
                                    descriptionProduct: detailProductedit.value,
                                    priceProduct: priceProductEdit.value,
                                    quantityProduct: quantityProductEdit.value,
                                    colorProduct: colorEdit.value,
                                    sizeProduct: sizeProductEdit.value
                                }
                                changeApi('Product/' + id, 'PUT', data, renderProduct)
                            }
                            fileReader.readAsDataURL(file)
                        }
                    }
                })
            })
        })
    })
}
function deleteProduct() {
    var list = document.querySelectorAll('.delete-product')
    list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            changeApi('Product/' + id, "DELETE", null, renderProduct)
        })
    })
}
function searchProduct() {
    var searchValue = document.getElementById('searchInput').value.toLowerCase();

    axios.get('http://localhost:3000/Product')
        .then(response => {
            let data = response.data;

            var filteredProducts = data.filter(product => {
                return product.nameProduct.toLowerCase().indexOf(searchValue) !== -1;
            });

            let html = filteredProducts.map(product => {
                return `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.nameProduct}</td>
                        <td><img src="${product.imageProduct}" alt=""></td>
                        <td>${product.idCategories}</td>
                        <td>${product.brandId}</td>
                        <td>${product.descriptionProduct}</td>
                        <td>${product.priceProduct}</td>
                        <td>${product.quantityProduct}</td>
                        <td>${product.colorProduct}</td>
                        <td>${product.sizeProduct}</td>
                        <td><ion-icon name="settings-outline"></ion-icon>
                            <ion-icon name="trash-outline"></ion-icon>
                        </td>
                    </tr>`;
            }).join('');

            document.getElementById('renderProduct').innerHTML = html;
        });
}
function renderOrder() {
    changeApi('Order', 'GET', null, Courese => {
        var html = ``
        Courese.forEach(elm => {
            renderUser(elm.idUser, (Name) => {
                html += ` <tr>
                <td style ="cursor: pointer;" class="btn-orderdetail" id="${elm.id}" data-bs-toggle="modal" data-bs-target="#orderdetail">${elm.id}</td>
                <td>${Name}</td>
                <td>${elm.dateOrder}</td>
                <td>${elm.phone}</td>
                <td>${elm.address}</td>
                <td>${elm.statusOrder}</td>
                <td>${elm.statusPayment}</td>
                <td><ion-icon class="edit" id="${elm.id}" name="settings-outline" data-bs-toggle="modal" data-bs-target="#editOrder"></ion-icon>
                    <ion-icon id="delete-order" name="trash-outline"></ion-icon>
                </td>
            </tr>`
                document.getElementById('show-order').innerHTML = html
                updateOrder()
                renderOrderdetail()
            })
        })
    })
}
function renderOrderdetail() {
    var list = document.querySelectorAll('.btn-orderdetail')
    list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            var html = ``
            changeApi('orderDetails', 'GET', null, Courese => {
                Courese.forEach(elm => {
                    if (elm.idOrder == id) {
                        var totalFormat = elm.totalOrder.toLocaleString('vi-VN', { minimumFactionDigits: 0 }) + '.000VND'
                        renderelementProduct(elm.idProduct, (nameProduct, idCategories, brandId, imageProduct, descriptionProduct, priceProduct, quantityProduct, colorProduct, sizeProduct) => {
                            html += `
                            <div class="card">
                            <div class="img">
                                <img src="${imageProduct}" alt="">
                            </div>
                            <div class="name-size-color-product">
                                <b>${nameProduct}</b>
                                <p>${elm.sizeOrder}/${elm.colorOrder}</p>
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
        })
    })

}
function renderelementProduct(id, Callback) {
    changeApi('Product', 'GET', null, Courese => {
        Courese.forEach(elm => {
            if (elm.id == id) {
                Callback(elm.nameProduct, elm.idCategories, elm.brandId, elm.imageProduct, elm.descriptionProduct, elm.priceProduct, elm.quantityProduct, elm.colorProduct, elm.sizeProduct)
            }
        })
    })
}
function updateOrder() {
    var list = document.querySelectorAll('.edit')
    var select = document.getElementById('select-status-oder')
    var btn_update = document.getElementById('saveOrderStatusButton')
    list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            changeApi('Order', 'GET', null, Courese => {
                Courese.forEach(elm => {
                    if (id == elm.id) {
                        select.value = elm.statusOrder
                        btn_update.addEventListener('click', () => {
                            var data = {
                                id: elm.id,
                                idUser: elm.idUser,
                                dateOrder: elm.dateOrder,
                                phone: elm.phone,
                                address: elm.address,
                                statusOrder: select.value,
                                statusPayment: elm.statusPayment,
                                total: elm.total
                            }
                            changeApi('Order/' + elm.id, "PUT", data, () => {
                                alert("Cập nhật thành công")
                            })
                        })
                    }
                })
            })
        })
    })
}
function renderUser(id, callback) {
    changeApi('User', 'GET', null, Courese => {
        Courese.forEach(elm => {
            if (id == elm.id) {
                callback(elm.nameUser)
            }
        })
    })
}
function renderAccount() {
    changeApi('User', 'GET', null, Courese => {
        var html = ``
        Courese.forEach(elm => {
            html += `  <tr>
            <td>${elm.id}</td>
            <td>${elm.nameUser}</td>
            <td>${elm.emailUser}</td>
            <td>${elm.passwordUser}</td>
            <td>${elm.phoneUser}</td>
            <td>
                <ion-icon class="btn-delete" id="${elm.id}" name="trash-outline"></ion-icon>
            </td>
        </tr>`
        })
        document.getElementById('show-account').innerHTML = html
        deleteAccount()
    })
}
function deleteAccount() {
    var listBtn = document.querySelectorAll('.btn-delete')
    listBtn.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            changeApi('User/' + id, "DELETE", null, renderAccount)
        })
    })
}
function renderVoucher() {
    changeApi('Voucher', 'GET', null, Courese => {
        var html = ``
        Courese.forEach(elm => {
            html += ` <tr>
            <td>${elm.id}</td>
            <td>${elm.codeVoucher}</td>
            <td> >${elm.conditionVoucher}.000VND</td>
            <td>Giảm ${elm.valueVoucher}.000VND</td>
            <td><ion-icon class="edit-voucher" id="${elm.id}" name="settings-outline" data-bs-toggle="modal" data-bs-target="#editVoucher"></ion-icon>
                <ion-icon class="delete-voucher" id="${elm.id}"name="trash-outline"></ion-icon>
            </td>
        </tr>`
        })
        document.getElementById('show-voucher').innerHTML = html
        deleteVoucher()
        editVoucher()
    })
}
function deleteVoucher() {
    var list = document.querySelectorAll('.delete-voucher')
    list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            changeApi('Voucher/' + id, "DELETE", null, renderVoucher)
        })
    })
}
function editVoucher() {
    var list = document.querySelectorAll('.edit-voucher')
    var codeVoucheredit = document.getElementById('codeVoucheredit')
    var conditionVoucheredit = document.getElementById('conditionVoucheredit')
    var valueVoucheredit = document.getElementById('valueVoucheredit')
    var btn = document.getElementById('Btn-edit-voucher')
    list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            changeApi('Voucher', 'GET', null, Courese => {
                Courese.forEach(elm => {
                    if (elm.id == id) {
                        codeVoucheredit.value = elm.codeVoucher
                        conditionVoucheredit.value = elm.conditionVoucher
                        valueVoucheredit.value = elm.valueVoucher
                        btn.addEventListener('click', () => {
                            if (codeVoucheredit.value == '' || conditionVoucheredit.value == '' || valueVoucheredit.value == '') {
                                alert('Vui lòng nhập dữ liệu')
                            } else {
                                var data = {
                                    id: id,
                                    codeVoucher: codeVoucheredit.value,
                                    conditionVoucher: conditionVoucheredit.value,
                                    valueVoucher: valueVoucheredit.value
                                }
                                changeApi('Voucher/' + id, "PUT", data, renderVoucher)
                            }
                        })
                    }
                })
            })
        })
    })
}
function addVoucher() {
    var codeVoucher = document.getElementById('codeVoucher')
    var conditionVoucher = document.getElementById('conditionVoucher')
    var valueVoucher = document.getElementById('valueVoucher')
    var btn = document.getElementById('BtnaddVoucher')
    btn.addEventListener('click', () => {
        if (codeVoucher.value == '' || conditionVoucher.value == '' || valueVoucher.value == '') {
            alert("Vui lòng nhập dữ liệu")
        } else {
            var id = 0
            changeApi("Voucher", "GET", null, Courese => {
                Courese.forEach(elm => {
                    id = parseInt(elm.id)
                });
                id++;
                console.log()
                var data = {
                    id: id.toString(),
                    codeVoucher: codeVoucher.value,
                    conditionVoucher: parseInt(conditionVoucher.value),
                    valueVoucher: parseInt(valueVoucher.value)
                }
                changeApi('Voucher', 'POST', data, renderVoucher)
            })
        }
    })
}
function renderMessenger() {
    changeApi('Messenger', "GET", null, Courese => {
        var html = ``
        Courese.forEach(elm => {
            html += ` <tr>
            <td>${elm.id}</td>
            <td>${elm.Name}</td>
            <td>${elm.Email}</td>
            <td>${elm.Phone}</td>
            <td id="open-messenger">${elm.comment}</td>
            <td> <ion-icon  class="delete-messenger" id="${elm.id}"name="trash-outline"></ion-icon></td>
        </tr>`
        })
        document.getElementById('show-messenger').innerHTML = html
        open_messenger()
        delete_messenger()
    })
}
function open_messenger() {
    var list = document.querySelectorAll('#open-messenger')
    list.forEach(elm => {
        elm.addEventListener('click', () => {
            list.forEach(elm => {
                elm.classList.remove('active')
            })
            elm.classList.add('active')
        })
    })
}
function delete_messenger(){
    var list = document.querySelectorAll('.delete-messenger')
    list.forEach(elm=>{
        elm.addEventListener('click',()=>{
            var id = elm.getAttribute('id')
            changeApi('Messenger/'+id,"DELETE",null,renderMessenger)
        })
    })
}