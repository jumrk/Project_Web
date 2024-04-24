function renderProduct() {
    axios.get('http://localhost:3000/Product')
        .then(response => {
            let dataProduct = response.data
            let renderProduct = dataProduct.map(dataProduct => {
                return `
                <tr>
                    <td>${dataProduct.id}</td>
                    <td>${dataProduct.nameProduct}</td>
                    <td>${dataProduct.imageProduct}</td>
                    <td>${dataProduct.descriptionProduct}</td>
                    <td>${dataProduct.colorProduct}</td>
                    <td>${dataProduct.quannityProduct}</td>
                    <td>${dataProduct.sizeProduct}</td>
                    <td>
                    <button data-toggle="modal" data-target="#updateProduct" id="update" onclick="updateProduct(${dataProduct.id})" ><i class="fa fa-cogs"></i></button>
                    <button onclick="deletedProdcut(${dataProduct.id})" id="deleted"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>
            `
            }).join('')
            document.getElementById('tbl').innerHTML = renderProduct
        })
        .catch(error => {
            console.log(error);
        })
}
function addProduct() {
    let isEmty = true
    let i
    let Product = {
        nameProduct: document.getElementById('nameProduct').value,
        imageProduct: document.getElementById('imgProduct').value,
        descriptionProduct: document.getElementById('desProduct').value,
        colorProduct: document.getElementById('colorProduct').value,
        quannityProduct: document.getElementById('quanityProduct').value,
        sizeProduct: document.getElementById('sizeProduct').value
    }

    axios.get('http://localhost:3000/Product')
        .then(response => {
            let dataProduct = response.data
            for(i = 0; i < dataProduct.length; i++) {
                if (Product.nameProduct.toLowerCase() == dataProduct[i].nameProduct.toLowerCase()) {
                    isEmty = false
                } else {
                    isEmty = true
                }
            }
            if (isEmty) {
                axios.post('http://localhost:3000/Product', Product)
                    .then(response => {
                        renderProduct()
                        resetFormAdd()
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }else{
                alert('Đã tồn tại tên sản phẩm này')
            }
        })
        .catch(error => {
            console.log(error);
        })
}
function resetFormAdd() {
    document.getElementById('nameProduct').value = ''
    document.getElementById('imgProduct').value = ''
    document.getElementById('desProduct').value = ''
    document.getElementById('colorProduct').value = ''
    document.getElementById('quanityProduct').value = ''
    document.getElementById('sizeProduct').value = ''
}
function deletedProdcut(idProduct) {
    axios.delete(`http://localhost:3000/Product/${idProduct}`)
        .then(response => {
            renderProduct()
        })
        .catch(error => {
            console.log(error);
        })
}
function updateProduct(idProduct) {
    axios.get(`http://localhost:3000/Product/${idProduct}`)
        .then(response => {
            let dataProduct = response.data
            document.getElementById('idUp').value = dataProduct.id
            document.getElementById('nameProductUp').value = dataProduct.nameProduct
            document.getElementById('imgProductUp').value = dataProduct.imageProduct
            document.getElementById('desProductUp').value = dataProduct.descriptionProduct
            document.getElementById('colorProductUp').value = dataProduct.colorProduct
            document.getElementById('quanityProductUp').value = dataProduct.quannityProduct
            document.getElementById('sizeProductUp').value = dataProduct.sizeProduct
        })
        .catch(error => {
            console.log(error);
        })

    document.getElementById('updated').addEventListener('click', () => {
        let updateProduct = {
            nameProduct: document.getElementById('nameProductUp').value,
            imageProduct: document.getElementById('imgProductUp').value,
            descriptionProduct: document.getElementById('desProductUp').value,
            colorProduct: document.getElementById('colorProductUp').value,
            quannityProduct: document.getElementById('quanityProductUp').value,
            sizeProduct: document.getElementById('sizeProductUp').value
        }
        axios.put(`http://localhost:3000/Product/${idProduct}`, updateProduct)
            .then(response => {
                renderProduct()
            })
            .catch(error => {
                console.log(error);
            })
    })
}

