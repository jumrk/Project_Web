import { startSession, getSession, endSession } from "/main/changSession.js";
import { changeApi } from "/main/changApi.js";
function start() {
    loadHeaderfooter()
    viewInformationAddress()
    form_edit_user()
    RenderApi()
    getOrder(getSession())
    getAddress(getSession())
    add_address()
    Logout()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function loading() {
    $("body").load("/html/loading.html");
}
function viewInformationAddress() {
    var information = document.getElementById('information-user')
    var address = document.getElementById('address-user')
    var viewInformation = document.getElementById('view-information')
    var viewAddress = document.getElementById('view-address')
    information.addEventListener('click', () => {
        viewInformation.style.transform = 'translateX(0)'
        viewInformation.style.opacity = '1'
        viewAddress.style.transform = 'translateX(100%)'
        viewAddress.style.opacity = '0'
    })
    address.addEventListener('click', () => {
        viewAddress.style.transform = 'translateX(0)'
        viewAddress.style.opacity = '1'
        viewInformation.style.transform = 'translateX(100%)'
        viewInformation.style.opacity = '0'
    })
}
function form_edit_user() {
    var userName = document.getElementById('userName')
    var userEmail = document.getElementById('userEmail')
    var userPhone = document.getElementById('userPhone')
    var btn_submit = document.getElementById('btn-edit-user')
    const hasNumber = /\d/;
    show_form('btn-show-form', 'form-edit-user', 'close-form')
    changeApi('User', 'GET', null, (Courses) => {
        Courses.forEach(element => {
            if (getSession() == element.id) {
                userName.value = element.nameUser
                userEmail.value = element.emailUser
                userPhone.value = element.phoneUser
                btn_submit.addEventListener('click', () => {
                    const isValue = (userName.value == "" || userEmail.value == "" || userPhone.value == "")
                    const isLengthName = (userName.value.length < 5);
                    const isFormatName = (hasNumber.test(userName.value));
                    var emailIsDuplicate = Courses.some((courses) => {
                        return courses.emailUser === userEmail.value && courses.id !== getSession()
                    });
                    if (isValue) {
                        Swal.fire({
                            title: "Cảnh báo",
                            text: "Vui lòng nhập dữ liệu",
                            icon: "error"
                        });
                        return false;
                    }
                    if (isLengthName) {
                        Swal.fire({
                            title: "Cảnh báo",
                            text: "Tên ít nhất phải 5 ký tự",
                            icon: "error"
                        });
                        return false;
                    }
                    if (isFormatName) {
                        Swal.fire({
                            title: "Cảnh báo",
                            text: "Tên không nên chứa số",
                            icon: "error"
                        });
                        return false;
                    }
                    if (emailIsDuplicate) {
                        Swal.fire({
                            title: "Cảnh báo",
                            text: "Email đã tồn tại",
                            icon: "error"
                        });
                    } else {
                        var data = {
                            id: getSession(),
                            nameUser: userName.value,
                            emailUser: userEmail.value,
                            passwordUser: element.passwordUser,
                            phoneUser: userPhone.value
                        };

                        Swal.fire({
                            title: "Thành công",
                            text: "Chỉnh sửa thành công",
                            icon: "success"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                changeApi('User' + '/' + getSession(), 'PUT', data, RenderApi);
                            }
                        });
                    }
                });
            }
        });
    });
}
function show_form(id_btn_show, id_form, id_btn_close) {
    var btn_show_form = document.getElementById(id_btn_show)
    var form = document.getElementById(id_form)
    btn_show_form.addEventListener('click', () => {
        var close_form = document.getElementById(id_btn_close)
        form.style.transform = 'TranslateY(0)'
        close_form.addEventListener('click', () => {
            form.style.transform = 'TranslateY(-200%)'
        })
    })
}
function RenderApi() {
    var nav_show_name = document.getElementById('nav-show-name')
    var content_name_show = document.getElementById('content-name-show')
    var content_email_show = document.getElementById('content-email-show')
    var content_phone_show = document.getElementById('content-phone-show')
    console.log(getSession())
    changeApi('User', 'GET', null, (Courses) => {
        Courses.forEach(element => {
            if (getSession() == element.id) {
                if (element.nameUser == '') {
                    nav_show_name.innerHTML = element.emailUser
                    content_name_show.innerHTML = element.emailUser
                } else {
                    nav_show_name.innerHTML = element.nameUser
                    content_name_show.innerHTML = element.nameUser
                }
                if (element.emailUser !== '') {
                    content_email_show.innerHTML = element.emailUser
                }
                if (element.phoneUser == '') {
                    content_phone_show.innerHTML = 'Chưa được đăng ký'
                } else {
                    content_phone_show.innerHTML = element.phoneUser
                }
            }
        });
    })
}
function getOrder(id_user) {
    var content_order_show = document.getElementById('content-order-show')
    var html = ``
    var hasOrder = false
    changeApi('Order', 'GET', null, (Courses) => {
        Courses.forEach(element => {
            if (id_user == element.idUser) {
                hasOrder = true
                var totalFormat = element.total.toLocaleString('vi-VN', { minimunFractionDigits: 0 }) + '.000VND'
                html += `  
            <tr>
                <td><a href='/html/Orderdetail.html?id=${element.id}'>${element.id}</a></td>
                <td>${element.dateOrder}</td>
                <td>${totalFormat}</td>
                <td>${element.statusPayment}</td>
                <td>${element.statusOrder}</td>
            </tr>`
            }
        });
        if (!hasOrder) {
            html = `<p>Bạn chưa có đơn hàng</p>`
        }
        content_order_show.innerHTML = html
    })
}
function getAddress(id_user) {
    var content_address_show = document.getElementById('show-address')
    var html = ``
    var addressis = false
    changeApi('Address_user', 'GET', null, (Courses) => {
        Courses.forEach(element => {
            if (id_user == element.idUser) {
                addressis = true
                html += `
                <hr>
                <div class="container-address" >
                    <div class="container-view">
                        <p>Họ & tên: <span>${element.Name}</span></p>
                        <p>Địa chỉ: <span>${element.address}</span></p>
                    </div>
                    <div class="container-action">
                        <p class="elm-btn-edit" id='${element.id}'>Chỉnh sửa địa chỉ</p>
                        <p class="elm-btn-delete" id='${element.id}'>Xóa</p>
                    </div>
                </div>
                `
            }
        })
        if (!addressis) {
            html = `<p> Bạn chưa thêm địa chỉ </p>`
        }
        content_address_show.innerHTML = html
        edit_address()
        delete_address()
    })

}
function add_address() {
    var Name = document.getElementById('Name')
    var address = document.getElementById('address')
    var btn_add = document.getElementById('btn-add-address')
    show_form('add-address', 'form-address', 'close-form-address')
    btn_add.addEventListener('click', () => {
        let id = 0
        changeApi('Address_user', 'GET', null, Courese => {
            Courese.forEach(element => {
                return id = parseInt(element.id)
            })
            id++
            var data = {
                id: id.toString(),
                idUser: getSession(),
                Name: Name.value,
                address: address.value
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
                title: "Thêm địa chỉ thành công"
            });
            setTimeout(() => {
                changeApi('Address_user', 'POST', data, getAddress)
            }, 2000);

        })
    })
}
function edit_address() {
    var class_list = document.querySelectorAll('.elm-btn-edit');
    console.log(class_list);
    class_list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id');
            var Name_edit = document.getElementById('Name-edit');
            var address_edit = document.getElementById('address-edit');
            var close_form = document.getElementById('close-form-edit-address');
            var form = document.getElementById('form-edit-address');
            var btn_submit = document.getElementById('btn-edit-address');

            form.style.transform = 'TranslateY(0)';
            close_form.addEventListener('click', () => {
                form.style.transform = 'TranslateY(-200%)';
            });


            changeApi('Address_user', 'GET', null, Courese => {
                Courese.forEach(element => {
                    if (id == element.id) {
                        Name_edit.value = element.Name;
                        address_edit.value = element.address;
                    }
                });

                if (!btn_submit.hasEventListener) {
                    btn_submit.hasEventListener = true;
                    btn_submit.addEventListener('click', () => {
                        console.log(Name_edit.value, address_edit.value);
                        if (Name_edit.value == '' || address_edit.value == '') {
                            Swal.fire({
                                title: "Cảnh báo",
                                text: "Vui lòng nhập dữ liệu",
                                icon: "error"
                            })
                        } else {
                            var data = {
                                id: id,
                                idUser: getSession(),
                                Name: Name_edit.value,
                                address: address_edit.value
                            };
                            console.log(id)
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
                                title: "Sửa thành công"
                            });
                            setTimeout(() => {
                                changeApi('Address_user/' + id, 'PUT', data, getAddress);
                            }, 2000);
                        }
                    });
                }
            });
        });
    });
}
function delete_address() {
    var class_list = document.querySelectorAll('.elm-btn-delete')
    class_list.forEach(elm => {
        elm.addEventListener('click', () => {
            var id = elm.getAttribute('id')
            console.log(id)
            Swal.fire({
                title: "Cảnh báo",
                text: "Bạn có muốn xóa địa chỉ này?",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "Hủy",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
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
                        changeApi('Address_user/' + id, "DELETE", null, getAddress)
                    }, 2000);
                }
            })
        })
    })
}
function Logout() {
    var btn_logout = document.getElementById('Logout')
    btn_logout.addEventListener('click', () => {
        Swal.fire({
            title: "Cảnh báo",
            text: "Bạn có muốn đăng xuất?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
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
                    title: "Đăng xuất thành công"
                });
                setTimeout(() => {
                    endSession()
                    window.location.href = '/html/Login.html'
                }, 2000);
            }
        })
    })
}