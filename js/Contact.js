import { changeApi } from "/main/changApi.js";
function start() {
    loadHeaderfooter()
    messenger()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function messenger() {
    var btn = document.getElementById('btn-messenger')
    var name = document.getElementById('name')
    var email = document.getElementById('Email')
    var phone = document.getElementById('Phone')
    var comment = document.getElementById('comment')
    btn.addEventListener('click', () => {
        if (name.value == '' || email.value == '' || phone.value == '' || comment.value == '') {
            Swal.fire({
                title: "Cảnh báo",
                text: "Vui lòng nhập dữ liệu",
                icon: "error"
            })
        } else {
            changeApi('Messenger', 'GET', null, Courese => {
                var id = 0
                Courese.forEach(elm => {
                    id = parseInt(elm.id)
                })
                id++
                var data = {
                    id: id.toString(),
                    Name: name.value,
                    Email: email.value,
                    Phone: phone.value,
                    comment: comment.value
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
                    title: "Gửi thành công"
                });
                setTimeout(() => {
                    changeApi('Messenger', "POST", data, null)
                }, 2000);
            })
        }
    })

}