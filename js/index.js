function start() {
    loadHeaderfooter()
    animation()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function animation() {
    var box_content_1 = document.getElementById("box-content-1")
    var box_content_2 = document.getElementById("box-content-2")
    var new_arrival_card = document.querySelectorAll("#card")
    var content_text_brand = document.querySelectorAll('#content-text-brand')
    var content_img_brand = document.querySelectorAll('#content-img-brand')
    window.addEventListener('scroll', () => {
        if (isIntoView(box_content_1)) {
            box_content_1.classList.add("active")
            box_content_2.classList.add("active")
        }
        new_arrival_card.forEach(function (value) {
            if (isIntoView(value)) {
                value.classList.add("active")
            }
        })
        content_text_brand.forEach((value) => {
            if (isIntoView(value)) {
                value.classList.add("active")
            }
        })
        content_img_brand.forEach((value) => {
            if (isIntoView(value)) {
                value.classList.add("active")
            }
        })
    })
}
function isIntoView(elm) {
    const rect = elm.getBoundingClientRect()
    return rect.bottom <= window.innerHeight
}
a