import { changeApi } from "/main/changApi.js";
import { startSession,getSession,endSession } from "/main/changSession.js";
function start() {
    animation_login_signup()
    sign_Up()
    Login()
}
start()
function sign_Up() {
    var sign_Up = document.getElementById('Sign_up')
    sign_Up.addEventListener('click', () => {
        var Email_value = document.getElementById('email_signUp')
        var Password_value = document.getElementById('password_signUp')
        var Password_check_value = document.getElementById('password_check_signUp')
        var Email = Email_value.value
        var Password = Password_value.value
        var Password_check = Password_check_value.value

        if (Email == '') {
            error('errorEmail_signup', Email_value, 'Vui lòng nhập Email', 'Email đã tồn tại')
            return;
        } else {
            if (!validateEmail(Email)) {
                error('errorEmail_signup', Email_value, 'Email của bạn phải có @gmail.com', 'Email đã tồn tại')
                return;
            } else {
                var emailIS = true
                changeApi('User', 'GET', null, (Courses) => {
                    Courses.forEach(value => {
                        if (Email == value.emailUser) {
                            emailIS = false
                        }
                    })
                    if (emailIS == false) {
                        error('errorEmail_signup', Email_value, 'Email đã tồn tại', 'Email đã tồn tại')
                        return
                    } else {
                        if (Password == '') {
                            error('errorPassword_signup', Password_value, 'Vui lòng nhập mật khẩu', 'Vui lòng nhập mật khẩu')
                            return;
                        }
                        if (Password_check == '') {
                            error('errorPasswordcheck_signup', Password_check_value, 'Vui lòng nhập xác nhận mật khẩu', 'Mật khẩu không trùng khớp')
                            return;
                        } else {
                            if (Password_check !== Password) {
                                error('errorPasswordcheck_signup', Password_check_value, 'Mật khẩu không trùng khớp', 'Mật khẩu không trùng khớp')
                                return;
                            }
                        }
                        changeApi('User', 'GET', null, (Courses) => {
                            var id = 0
                            Courses.forEach(value => {
                                id = parseInt(value.id)
                            })
                            id++
                            var data = {
                                id: id.toString(),
                                nameUser: '',
                                emailUser: Email,
                                passwordUser: Password,
                                phoneUser: '',
                                addressUser: ''
                            }
                            changeApi('User', 'POST', data, (Courses) => {
                                console.log(Courses)
                                alert("Đăng ký thành công")
                            })
                        })
                    }
                })
            }
        }

    })
}
function Login() {
    var btn_Login = document.getElementById('Login')
    btn_Login.addEventListener('click', () => {
        var email_Value = document.getElementById('email_Login')
        var password_Value = document.getElementById('password_Login')
        var Email = email_Value.value
        var Password = password_Value.value

        if (Email == '') {
            error('errorEmail_login', email_Value, 'Vui lòng nhập Email', 'Email chưa được đăng ký')
        } else {
            if (!validateEmail(Email)) {
                error('errorEmail_login', email_Value, 'Email của bạn phải có @gmail.com', 'Email chưa được đăng ký')
            } else {
                changeApi('User', 'GET', null, Courses => {
                    var emailIs = false
                    for (var i = 0; i < Courses.length; i++) {
                        if (Email == Courses[i].emailUser) {
                            emailIs = true
                            if (Password == '') {
                                error('errorPassword_login', password_Value, 'Vui lòng nhập mật khẩu', 'Mật khẩu không chính xác')
                            } else {
                                if (Password == Courses[i].passwordUser) {
                                    alert("đăng nhập thành công")
                                    startSession(Courses[i].id)
                                    window.location.href = '/index.html'
                                    console.log(getSession())
                                } else {
                                    error('errorPassword_login', password_Value, 'Mật khẩu không chính xác', 'Mật khẩu không chính xác')
                                }
                            }
                            break
                        }
                    }
                    if (!emailIs) {
                        console.log('Email chưa được đăng ký')
                        error('errorEmail_login', email_Value, 'Email chưa được đăng ký', 'Email chưa được đăng ký')
                    }
                })

            }
        }
    })
}
function validateEmail(Email) {
    var pattern = /@gmail\.com$/
    return pattern.test(Email)
}
function error(id, value, text, textReturn) {
    var error = document.getElementById(id)
    error.innerHTML = text
    show_Error(error)
    value.addEventListener('click', () => {
        error.innerHTML = textReturn
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
function animation_login_signup() {
    const registerBtn = document.getElementById("register");
    const container = document.getElementById("container");
    const loginBtn = document.getElementById("login")

    registerBtn.addEventListener('click', () => {
        container.classList.add("active")
    })
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active")
    })
}