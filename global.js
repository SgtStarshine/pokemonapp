window.onload = linkify;

function linkify() {
   var kruvmbulasmiklubb = document.getElementById("last");
   kruvmbulasmiklubb.onclick = redirect;

   function redirect() {
      window.location = "/kruvmbulasmiklubb.htm";
   }
}