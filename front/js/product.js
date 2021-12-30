//localStorage.clear();
console.log(localStorage);


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


/**********Déclaration des fonctions appelées**********/

const arrayData = [];


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


//Fontion pour stocker les informations dans localStorage
function addEntry (arrayData) {

    let existingItems = JSON.parse(localStorage.getItem('itemOrdered'));
    if (existingItems == null) {
        existingItems = [];
    }
    console.log(existingItems);


    //Créer "fiche produit" pour sauvegarder dans le localStorage.entry
    let itemQty = document.querySelector('#quantity').value;
    let itemColor = document.querySelector('#colors').value;
    let entry = {
        id : `${arrayData._id}`,
        qty : itemQty,
        color : itemColor
    };
    localStorage.setItem('entry', JSON.stringify(entry));


    //Ajouter le produit dans le tableau stocké dans localStorage.entry
    let idValue = entry['id'];
    let colorValue = entry['color'];
    let qtyValue = entry['qty']; //string

    if (localStorage.itemOrdered == null) {
        existingItems.push(entry);
    } else if (localStorage.itemOrdered.includes(idValue) && localStorage.itemOrdered.includes(colorValue)) {
        for (let i = 0; i < existingItems.length; i++) {
            if (existingItems[i].id === idValue && existingItems[i].color === colorValue) {
                let index = existingItems[i]; //Récupérer le produit déjà dans le panier qui a même id et même couleur
                let newQtyValue = Number(qtyValue) + Number(index.qty); //Convertir les strings en numbers pour faire la somme
                index.qty = newQtyValue.toString(); //Reconvertir le résultat en string
            }
        }
    } else {
        existingItems.push(entry);
    }
    
    
    //Pour créer un panier unique avec tous les produits ajoutés
    localStorage.setItem('itemOrdered', JSON.stringify(existingItems));
}