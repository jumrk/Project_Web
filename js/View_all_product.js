function start() {
    loadHeaderfooter()
    Getquery()
}
start()
function loadHeaderfooter() {
    $("#header").load("/html/header.html");
    $("#footer").load("/html/footer.html");
}
function Getquery() {
    const queryString = window.location.search
    const param = new URLSearchParams(queryString)
    const paramValue = param.get('param')
    console.log(paramValue)

    if (paramValue == 'T_shirts') {
        setContentView('Áo thun')
    } if (paramValue == 'Polo_shirt') {
        setContentView('Áo Polo')
    } if (paramValue == 'sweater') {
        setContentView('Áo sweater')
    } if (paramValue == 'trousers') {
        setContentView('Quần')
    } if (paramValue == 'clothing') {
        setContentView('Áo')
    }
}
function setContentView(title) {
    var title_set = document.getElementById('title-set')
    title_set.innerHTML = title
}