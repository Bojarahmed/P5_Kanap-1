//localStorage.clear();
console.log(localStorage);

/*********************************** Côté DOM ***********************************/

//Fonction pour insérer les informations du produit dans la page
function insertData(arrayData) {
    document.querySelector('.item__img').innerHTML = `<img src="${arrayData.imageUrl}" alt="${arrayData.altTxt}">`;
    document.querySelector('#title').innerText = `${arrayData.name}`;
    document.querySelector('#price').innerText = `${arrayData.price}`;
    document.querySelector('#description').innerText = `${arrayData.description}`;
    for (let i = 0; i < arrayData.colors.length; i++) {
        let option = document.createElement('option');
        document.querySelector('#colors').appendChild(option);
        option.setAttribute('value', `${arrayData.colors[i]}`);
        option.innerText = `${arrayData.colors[i]}`;
    };
}


/*********************************** Côté API ***********************************/
// Récupérer l'URL de la page courante dans une variable
let str = window.location.href;

//Récupérer l'identifiant du produit
let newUrl = new URL(str);
let itemId = newUrl.searchParams.get('id');

//Récupérer l'URL du produit
let url = `http://localhost:3000/api/products/${itemId}`;


//Récupérer les données nécessaires à l'affichage de la page
fetch(url).then(function(res) {
    if (res.ok) {
        return res.json();
    }
}).then(function(data) {
    //Insérer les informations du produit dans la page
    insertData(data);
    //Envoyer les informations vers le panier en cliquant sur le bouton "Ajouter"
    document.querySelector('#addToCart').addEventListener('click', function() {
        addEntry(data);
        console.log(localStorage.itemOrdered);
    });
}).catch(function(err) {
    console.log('Une erreur est survenue : ' + err)
});


/*********************************** Gestion Panier ***********************************/
//Fontion pour stocker les informations dans localStorage
function addEntry (arrayData) {

    //Créer le panier dans localStorage
    let itemOrdered = JSON.parse(localStorage.getItem('itemOrdered'));
    if (itemOrdered == null) {
        itemOrdered = [];
    }
    console.log(itemOrdered);


    //Créer "fiche produit" pour sauvegarder dans le localStorage.entry
    let itemQty = document.querySelector('#quantity').value;
    let itemColor = document.querySelector('#colors').value;
    let itemPrice = document.querySelector('#price').innerText;
    let entry = {
        id : `${arrayData._id}`,
        quantity : itemQty,
        color : itemColor,
        price : itemPrice
    };
    localStorage.setItem('entry', JSON.stringify(entry));


    //Ajouter le produit dans le tableau stocké dans localStorage.entry
    let idValue = entry['id'];
    let colorValue = entry['color'];
    let qtyValue = entry['quantity']; //string

    if (localStorage.itemOrdered == null) {
        itemOrdered.push(entry);
    } else if (localStorage.itemOrdered.includes(idValue) && localStorage.itemOrdered.includes(colorValue)) {
        for (let i = 0; i < itemOrdered.length; i++) {
            if (itemOrdered[i].id === idValue && itemOrdered[i].color === colorValue) {
                let index = itemOrdered[i]; //Récupérer le produit déjà dans le panier qui a même id et même couleur
                let newQtyValue = Number(qtyValue) + Number(index.quantity); //Convertir les strings en numbers pour faire la somme
                index.quantity = newQtyValue.toString(); //Reconvertir le résultat en string
            }
        }
    } else {
        itemOrdered.push(entry);
    }
    
    //Pour sauvegarder le nouveau panier
    localStorage.setItem('itemOrdered', JSON.stringify(itemOrdered));
}
