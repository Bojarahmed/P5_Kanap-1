//Récupérer les données en javascript
let itemOrdered = JSON.parse(localStorage.getItem('itemOrdered'));
console.log(itemOrdered);


//Afficher pour chaque produit sélectionné
for (let i = 0; i < itemOrdered.length; i++) {
    let url = `http://localhost:3000/api/products/${itemOrdered[i].id}`;

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
        article.setAttribute('data-id', `${itemOrdered[i].id}`);
        article.setAttribute('data-color', `${itemOrdered[i].color}`);
        
        //Insérer dans la balise article tous les éléments nécessaires
        function insertContent() {
            article.innerHTML = 
            `<div class="cart__item__img">
                <img src="${data.imageUrl}" alt="${data.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${itemOrdered[i].color}</p>
                    <p class="cart__item__content__price">${itemOrdered[i].price}€</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemOrdered[i].qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>`;
        }
        insertContent();
        

        //Fonction pour modifier la quantité
        function changeQty() {
            let input = document.querySelectorAll('.itemQuantity'); //inputButton = array
            
            let i = input.length-1;
            
            input[i].addEventListener('change', function() {
                if (input[i].value <= 0) {
                    input[i].value = 0;
                    itemOrdered.splice(i, 1);
                } else if (input[i].value > 100) {
                    input[i].value = 100;
                    itemOrdered[i].qty = input[i].value;
                } else {
                    itemOrdered[i].qty = input[i].value;
                }
                localStorage.setItem('itemOrdered', JSON.stringify(itemOrdered));
                console.log(itemOrdered);
                location.reload();
            })
        }
        changeQty();
        
        //Fonction pour supprimer un article quand on clique sur "Supprimer"
        function deleteItem() {
            let deleteButton = document.querySelectorAll('.deleteItem'); //deleteButton = array
                    
            let i = deleteButton.length-1;
                    
            deleteButton[i].addEventListener('click', function() {
                itemOrdered.splice(i, 1);
                localStorage.setItem('itemOrdered', JSON.stringify(itemOrdered));
                location.reload();
            })
        };
        deleteItem();

        //Fonction pour calculer le prix total
        function cartTotalPrice() {
            let input = document.querySelectorAll('.itemQuantity'); //input = array

            let i = input.length-1;
            let inputArticle = input[i].closest('article');
            let articleId = inputArticle.dataset.id;
            let articleColor = inputArticle.dataset.color;

            let totalPrice = 0;
            if (article.getAttribute('data-color') === articleColor && article.getAttribute('data-id') === articleId) {
                for (i = 0; i < itemOrdered.length; i++) {
                    let quantity = itemOrdered[i].qty;
                    let unitPrice = itemOrdered[i].price;
                    let itemPrice = Number(quantity) * Number(unitPrice);
                    totalPrice += itemPrice;
                }
            }
            document.querySelector('#totalPrice').innerText = totalPrice;
        }
        cartTotalPrice();

        //Fonction pour calculer le nombre total d'articles dans le panier
        function cartTotalQty() {
            let finalQty = 0;
            for (let i = 0; i < itemOrdered.length; i++) {
                finalQty += Number(itemOrdered[i].qty);
            };
            document.querySelector('#totalQuantity').innerText = finalQty;
        }
        cartTotalQty();

    }).catch(function(err) {
        console.log('Une erreur est survenue : ' + err);
    });
};


