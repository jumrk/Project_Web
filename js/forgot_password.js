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
    btn.addEventListener('click',()=>{
        if(email.value == ''){
            alert('Vui lòng nhập email')
        }else{
            changeApi('User','GET',null,Courese=>{
                var isEmail = false
                Courese.forEach(element => {
                    if(element.emailUser == email.value){
                        isEmail = true
                        sendResetPasswordEmail(email.value);
                    }
                });
            })   
        }
    })
}
function sendResetPasswordEmail(email) {
    const verificationCode = generateVerificationCode(); 

    emailjs.send('service_xjdgo1k', 'template_eqj5poq', { to_email: email, verification_code: verificationCode }, 'YOUR_USER_ID')
        .then(function(response) {
            console.log('Email sent successfully:', response);
            alert('Một mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra email và nhập mã xác nhận để đặt lại mật khẩu.');
        }, function(error) {
            console.error('Error sending email:', error);
            alert('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.');
        });
}

function generateVerificationCode() {
    const length = 6; // Độ dài mã xác nhận
    const charset = '0123456789'; // Các ký tự được sử dụng trong mã xác nhận
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset[randomIndex];
    }

    return code;
}
