const pswdBtn = document.querySelector("#pswdBtn");

if(pswdBtn) {
  pswdBtn.addEventListener("click", function () {
    const pswdInput = document.getElementById("account_password");
    const type = pswdInput.getAttribute("type");

    if (type == "password") {
      pswdInput.setAttribute("type", "text");
      pswdBtn.innerHTML = "Hide Password";
    } else {
      pswdInput.setAttribute("type", "password");
      pswdBtn.innerHTML = "Show Password";
    }
  })
}


//javascript:for(var f=document.forms,i=f.length;i--;)f[i].setAttribute("novalidate",i)
// To disable the form security on client-side
