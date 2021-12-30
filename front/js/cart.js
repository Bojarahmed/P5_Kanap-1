//Récupérer les données en javascript
let existingItems = JSON.parse(localStorage.getItem('itemOrdered'));
console.log(existingItems);



//Afficher pour chaque produit sélectionné
for (let i = 0; i < existingItems.length; i++) {
    let url = `http://localhost:3000/api/products/${existingItems[i].id}`;

    //Envoyer une requête HTTP pour récupérer les données
    fetch(url).then(function(res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function(data) {

        //Créer la balise article qui va recevoir les éléments de chaque article dans le panier
        let article = document.createElement('article');
        document.querySelector('#cart__items').appendChild(article);
        article.setAttribute('class', 'cart__item');
        article.setAttribute('data-id', `${existingItems[i].id}`);
        article.setAttribute('data-color', `${existingItems[i].color}`);

        //Insérer dans la balise article tous les éléments nécessaires
        article.innerHTML = 
            `<div class="cart__item__img">
                <img src="${data.imageUrl}" alt="${data.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${data.description}</p>
                    <p>${data.price}€</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${existingItems[i].qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>`;

            let itemPrice = 0;
            let itemQty = document.querySelector('.itemQuantity').value;

                itemPrice = Number(data.price) * itemQty;
                console.log(itemPrice); // Affiche le prix total pour chaque article


            document.querySelector('#totalPrice').innerText = itemPrice; //Récupère que le dernier console.log


    }).catch(function(err) {
        console.log('Une erreur est survenue : ' + err);
    });
}

//Nombre total d'articles dans le panier
let finalQty = 0;
for (let i = 0; i < existingItems.length; i++) {
    finalQty += Number(existingItems[i].qty);
};
document.querySelector('#totalQuantity').innerText = finalQty;

