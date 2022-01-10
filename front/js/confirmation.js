//Récupérer l'url de la page
let str = window.location.href;

//Récupérer l'identifiant de la commande
let newUrl = new URL(str);
let orderId = newUrl.searchParams.get('id');

//Insérer le numéro de la commande
document.querySelector('#orderId').innerText = `${orderId}`;