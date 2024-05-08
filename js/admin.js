import { changeApi } from "/main/changApi.js";
function start() {
    select_size_color()
    statistics()
    showContent()
    renderProduct()
    searchProduct()
    renderOrder()
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
            total += parseInt(elm.total)
        })
        var formatTotal = total.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + ".000VND"
        document.getElementById('total-revenue').innerHTML = formatTotal
    })
}
function renderProduct() {
    axios.get('http://localhost:3000/Product')
        .then(response => {
            let data = response.data
            let html = data.map(data => {
                return `
           <tr>
           <td>${data.id}</td>
           <td>${data.nameProduct}</td>
           <td><img src="${data.imageProduct}" alt=""></td>
           <td>${data.idCategories}</td>
           <td>${data.brandId}</td>
           <td>${data.descriptionProduct}</td>
           <td>${data.priceProduct}</td>
           <td>${data.quantityProduct}</td>
           <td>${data.colorProduct}</td>
           <td>${data.sizeProduct}</td>
           <td><ion-icon name="settings-outline"></ion-icon>
               <ion-icon name="trash-outline"></ion-icon>
           </td>
       </tr>`
            }).join('')
            document.getElementById('renderProduct').innerHTML = html
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
function select_size_color() {
    var btn = document.getElementById('btn-select')
    var input_color = document.getElementById('color')
    var input_size = document.getElementById('size')
    var show_color = document.getElementById('show-color')
    var show_size = document.getElementById('show-size')
    var colorArr = []
    var sizeArr = []
    btn.addEventListener('click', () => {
        colorArr.push(input_color.value)
        sizeArr.push(input_size.value)
        colorArr.forEach(elm => {
            show_color.innerHTML = elm + ','
        })
        sizeArr.forEach(elm => {
            show_size.innerHTML = elm + ","
        })
    })
}
function renderOrder() {
    changeApi('Order', 'GET', null, Courese => {
        var html = ``
        Courese.forEach(elm => {
            renderUser(elm.idUser,(Name)=>{
                html += ` <tr>
                <td>${elm.id}</td>
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
            })
        })
    })
}
function updateOrder(){
    var list = document.querySelectorAll('.edit')
    var select = document.getElementById('select-status-oder')
    var btn_update = document.getElementById('saveOrderStatusButton')
    list.forEach(elm=>{
        elm.addEventListener('click',()=>{
            var id = elm.getAttribute('id')
            changeApi('Order','GET',null,Courese=>{
                Courese.forEach(elm=>{
                    if(id == elm.id){
                        select.value = elm.statusOrder
                        btn_update.addEventListener('click',()=>{
                            var data =  {
                                id: elm.id,
                                idUser: elm.idUser,
                                dateOrder: elm.dateOrder,
                                phone: elm.phone,
                                address: elm.address,
                                statusOrder: select.value,
                                statusPayment: elm.statusPayment,
                                total: elm.total
                              }
                            changeApi('Order/'+elm.id,"PUT",data,()=>{
                                alert("Cập nhật thành công")
                            })
                        })
                    }
                })
            })
        })
    })
}
function renderUser(id,callback){
    changeApi('User','GET',null,Courese=>{
        Courese.forEach(elm=>{
            if(id == elm.id){
                callback(elm.nameUser)
            }
        })
    })
}