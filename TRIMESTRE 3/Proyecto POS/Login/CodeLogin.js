function login(){

    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;

    if(
        correo === "admin@cora-pos.com" &&
        password === "123456"
    ){

        window.location.href = "dashboard.html";

    }else{

        alert("Correo o contraseña incorrectos");

    }

}