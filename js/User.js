function start() {
    loadHeaderfooter()
    viewInformationAddress()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function viewInformationAddress(){
    var information = document.getElementById('information-user')
    var address = document.getElementById('address-user')
    var viewInformation = document.getElementById('view-information')
    var viewAddress = document.getElementById('view-address')
    information.addEventListener('click',()=>{
        viewInformation.style.transform = 'translateX(0)'
        viewInformation.style.opacity = '1'
        viewAddress.style.transform = 'translateX(100%)'
        viewAddress.style.opacity = '0'
    })
    address.addEventListener('click',()=>{
        viewAddress.style.transform = 'translateX(0)'
        viewAddress.style.opacity = '1'
        viewInformation.style.transform = 'translateX(100%)'
        viewInformation.style.opacity = '0'
    })
}