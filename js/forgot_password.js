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
    var email = document.getElementById('email_forgotPassword')
    btn.addEventListener('click', () => {
        if (email.value == '') {
            alert('Vui lòng nhập email')
        } else {
            changeApi('User', 'GET', null, Courese => {
                var isEmail = false
                Courese.forEach(element => {
                    if (element.emailUser == email.value) {
                        isEmail = true
                        sendResetPasswordEmail(email.value, element.id, element.nameUser, element.phoneUser);
                    }
                });
            })
        }
    })
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
            alert('Một mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra email và nhập mã xác nhận để đặt lại mật khẩu.');
            document.getElementById('email').style.display = 'none'
            document.getElementById('submitCode').style.display = 'block'
            var btn = document.getElementById('btn-check-code')
            var code = document.getElementById('code_value')
            btn.addEventListener('click', () => {
                if (code.value == verificationCode) {
                    document.getElementById('submitCode').style.display = 'none'
                    document.getElementById('password').style.display = 'block'
                    var btn_pasword = document.getElementById('btn-password')
                    var password_value = document.getElementById('password-input')
                    btn_pasword.addEventListener('click', () => {
                        if (password_value.value == '') {
                            alert("Vui lòng nhập mật khẩu ")
                        } else {
                            var data = {
                                id: idUser,
                                nameUser: nameUser,
                                emailUser: email,
                                passwordUser: password_value.value,
                                phoneUser: phoneUser
                            }
                            changeApi('User/' + idUser, "PUT", data,null )
                            alert('Thay đổi thành công')
                            window.location.href = '/html/Login.html'
                        }
                    })
                } else {
                    alert('Mã của bạn không đúng')
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
