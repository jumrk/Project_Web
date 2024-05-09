import { changeApi } from "/main/changApi.js";
function start() {
    back()
    submit_email()
}
start()

function back() {
    var btn = document.getElementById('btn-back')
    btn.addEventListener('click', () => {
        window.history.back()
    })
}
function submit_email() {
    var btn = document.getElementById('forgotPassword')
    var Email = document.getElementById('email_forgotPassword')
    btn.addEventListener('click', () => {
        if (Email.value == '') {
            error("errorEmail", Email, "Vui lòng nhập Email")
        } else {
            changeApi('User', 'GET', null, Courese => {
                var isEmail = false
                Courese.forEach(element => {
                    if (element.emailUser == Email.value) {
                        isEmail = true
                        sendResetPasswordEmail(Email.value, element.id, element.nameUser, element.phoneUser);
                    }
                });
            })
        }
    }
    )
}
function error(id, value, text) {
    var error = document.getElementById(id)
    error.innerHTML = text
    show_Error(error)
    value.addEventListener('click', () => {
        remove_Error(error)
    })
}
function show_Error(id) {
    id.style.display = 'block'
    id.classList.add("active")
}
function remove_Error(id) {
    id.style.display = 'none'
    id.classList.remove("active")
}
function sendResetPasswordEmail(email, idUser, nameUser, phoneUser) {
    const verificationCode = generateVerificationCode();
    (function () {
        emailjs.init("pUZNUXLThiorISDAD");
    })();
    var params = {
        from_name: "FASHION",
        email_id: email,
        message: "Mã của bạn là: " + verificationCode
    }
    emailjs.send('service_xjdgo1k', 'template_l6f0rgf', params)
        .then(function (response) {
            console.log('Email sent successfully:', response);
            Swal.fire({
                title: "Thành công",
                text: "Hãy kiểm tra email của bạn",
                icon: "success"
            })
            document.getElementById('email').style.display = 'none'
            document.getElementById('submitCode').style.display = 'block'
            var btn = document.getElementById('btn-check-code')
            var code = document.getElementById('code_value')
            btn.addEventListener('click', () => {
                if (code.value == '') {
                    error('errorCode', code, 'Vui lòng nhập mã code')
                } else {
                    if (code.value == verificationCode) {
                        document.getElementById('submitCode').style.display = 'none'
                        document.getElementById('password').style.display = 'block'
                        var btn_pasword = document.getElementById('btn-password')
                        var password_value = document.getElementById('password-input')
                        btn_pasword.addEventListener('click', () => {
                            if (password_value.value == '') {
                                error('errorPassword', password_value, 'Vui lòng nhập Mật khẩu')
                            } else {
                                var data = {
                                    id: idUser,
                                    nameUser: nameUser,
                                    emailUser: email,
                                    passwordUser: password_value.value,
                                    phoneUser: phoneUser
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
                                    title: "Thay đổi mật khẩu thành công"
                                });
                                setTimeout(() => {
                                    changeApi('User/' + idUser, "PUT", data, null)
                                    window.location.href = '/html/Login.html'
                                }, 2000);
                            }
                        })
                    } else {
                        error('errorCode', code, 'Code của bạn không đúng')
                    }
                }
            })
        }, function (error) {
            console.error('Error sending email:', error);
            alert('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.');
        });
}

function generateVerificationCode() {
    const length = 6;
    const charset = '0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset[randomIndex];
    }

    return code;
}
