var Api = 'http://localhost:3000/'
export function changeApi(enpoin, method, data, callback) {

    if (method === 'GET') {
        fetch(Api + enpoin)
            .then(function (Response) {
                return Response.json();
            })
            .then(callback);
    } else {
        var option = {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }
        fetch(Api + enpoin, option)
            .then(function (Response) {
                return Response.json()
            })
            .then(callback)
    }
}
