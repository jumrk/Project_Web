function start() {
    select_size()
    show_descript_product()
    loadHeaderfooter()
}
start()
function select_size() {
    var size = document.getElementsByName("size")
    var result = document.getElementById("result-size")

    size.forEach((value) => {
        value.addEventListener("change", () => {
            if (value.checked == true) {
                result.innerHTML = value.value
                console.log(value)
            }
        })
    })
}
function minus() {
    var number = document.getElementById("value-number")
    if (number.value <= 1) {
        number.value = 1
    } else {
        number.value--
    }
}
function plus() {
    var value_number = document.getElementById("value-number")
    value_number.value++
}
function show_descript_product() {
    var click = document.getElementById("click-descript")
    var show = document.getElementById("show-descript")

    click.addEventListener('click', () => {
        if(show.style.opacity == "1"){
            show.style.opacity = "0"
            show.style.maxHeight = "0"
        }else{
            show.style.opacity = "1"
            show.style.maxHeight = "100%"
        }
    })
}
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}