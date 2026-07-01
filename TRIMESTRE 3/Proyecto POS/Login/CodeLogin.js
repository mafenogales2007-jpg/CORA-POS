let usuarios = [

    {
        correo: "admin@cora-pos.com",
        password: "123456"
    }

];


function login(){

    let correo = document.getElementById("correo").value.trim();
    let password = document.getElementById("password").value;
    let existe = usuarios.find(u =>u.correo === correo &&u.password === password);

    if(existe){
        window.location.href = "Inicio.html";
    }else{

        alert("Correo o contraseña incorrectos");

    }

}

function mostrarPassword(){

    let password = document.getElementById("password");
    let icono = document.getElementById("iconoPassword");

    if(password.type === "password"){

        password.type = "text";

        icono.classList.remove("fa-eye");
        icono.classList.add("fa-eye-slash");

    }else{

        password.type = "password";

        icono.classList.remove("fa-eye-slash");
        icono.classList.add("fa-eye");

    }

}