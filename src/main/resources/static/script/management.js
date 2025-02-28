window.onload = () => {

    document.getElementById("btn-user").onclick = function(){
        location.href = '/userList';
    }

    document.getElementById("btn-log").onclick = function(){
        location.href = '/checkLog';
    }
}