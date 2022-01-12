/*********************************** Panier ***********************************/
//Récupérer les données en javascriptpour vérifier l'affichage
let itemOrdered = JSON.parse(localStorage.getItem('itemOrdered'));
console.log(itemOrdered);


if ( itemOrdered === null || itemOrdered.length === 0) {
    let emptyCart = document.querySelector('h1');
    emptyCart.innerText = "Votre panier est vide.";
} else {
    //Afficher pour chaque produit du panier
    for (let i = 0; i < itemOrdered.length; i++) {
        let url = `http://localhost:3000/api/products/${itemOrdered[i].id}`;

        //Envoyer une requête HTTP pour récupérer les données
        fetch(url).then(function(res) {
            if (res.ok) {
                return res.json();
            }
        }).then(function(data) {

            //Insérer dans la balise article tous les éléments nécessaires
            function insertContent() {
            
            //Créer la balise article qui va recevoir les éléments de chaque article dans le panier
                let article = document.createElement('article');
                document.querySelector('#cart__items').appendChild(article);
                article.setAttribute('class', 'cart__item');
                article.setAttribute('data-id', `${itemOrdered[i].id}`);
                article.setAttribute('data-color', `${itemOrdered[i].color}`);
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
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemOrdered[i].quantity}">
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
                let input = document.querySelectorAll('.itemQuantity'); //NodeList
                let i = input.length-1;
            
                input[i].addEventListener('change', function() {
                    if (this.value <= 0) {
                        this.value = 0;
                        itemOrdered.splice(i, 1);
                    } else if (this.value > 100) {
                        this.value = 100;
                        itemOrdered[i].quantity = this.value;
                    } else {
                        itemOrdered[i].quantity = this.value;
                    }
                    localStorage.setItem('itemOrdered', JSON.stringify(itemOrdered));
                    location.reload();
                })
            }
            changeQty();
        
            //Fonction pour supprimer un article quand on clique sur "Supprimer"
            function deleteItem() {
                let deleteButton = document.querySelectorAll('.deleteItem'); //deleteButton = NodeList
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
                if (inputArticle.getAttribute('data-color') === articleColor && inputArticle.getAttribute('data-id') === articleId) {
                    for (i = 0; i < itemOrdered.length; i++) {
                        let quantity = itemOrdered[i].quantity;
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
                    finalQty += Number(itemOrdered[i].quantity);
                };
                document.querySelector('#totalQuantity').innerText = finalQty;
            }
            cartTotalQty();




        }).catch(function(err) {
            console.log('Une erreur est survenue : ' + err);
        });
    };
}

//Tableau pour récupérer les id des produits du panier
const products = [];
for (let i = 0; i < itemOrdered.length; i++) {
    let idEntry = [`${itemOrdered[i].id}`];
    localStorage.setItem('idEntry', JSON.stringify(idEntry));
    products.push(idEntry);
}
console.log(products);

/*********************************** Formulaire ***********************************/
//Récupérer le formulaire
let orderForm = document.querySelector('.cart__order__form');

//Ecouter la modification du champ "prénom"
orderForm.firstName.addEventListener('change', function() {
    validFirstName(this);
})
//Vérifier le champ "prénom"
function validFirstName(inputFirstName) {
    let firstNameRegExp = new RegExp('^[A-Za-z éèëôîï-]+$', 'g');
    let testFirstName = firstNameRegExp.test(inputFirstName.value);
    if (testFirstName) {
        document.querySelector('#firstNameErrorMsg').innerText = '';
        return true;
    } else {
        document.querySelector('#firstNameErrorMsg').innerText = 'Veuillez saisir un prénom valide.';
        return false;
    }
}

//Ecouter la modification du champ "nom"
orderForm.lastName.addEventListener('change', function() {
    validLastName(this);
})
//Vérifier le champ "nom"
function validLastName(inputLastName) {
    let lastNameRegExp = new RegExp("^[A-Za-z éèëôîï'-]+$", "g");
    let testLastName = lastNameRegExp.test(inputLastName.value);
    if (testLastName) {
        document.querySelector('#lastNameErrorMsg').innerText = '';
        return true;
    } else {
        document.querySelector('#lastNameErrorMsg').innerText = 'Veuillez saisir un nom valide.';
        return false;
    }
}

//Ecouter la modification du champ "adresse"
orderForm.address.addEventListener('change', function() {
    validAddress(this);
})
//Vérifier le champ "adresse"
function validAddress(inputAddress) {
    let addressRegExp = new RegExp('[A-Za-zéèëôîï0-9\'\.\-\s\,]{5}', 'g');
    let testAddress = addressRegExp.test(inputAddress.value);
    if (testAddress) {
        document.querySelector('#addressErrorMsg').innerText = '';
        return true;
    } else {
        document.querySelector('#addressErrorMsg').innerText = 'Veuillez saisir une adresse valide.';
        return false;
    }
}

//Ecouter la modification du champ "ville"
orderForm.city.addEventListener('change', function() {
    validCity(this);
})
//Vérifier le champ "ville"
function validCity(inputCity) {
    let cityRegExp = new RegExp('[A-Za-zéèëôîï0-9\'\.\-\s\,]{2}', 'g');
    let testCity = cityRegExp.test(inputCity.value);
    if (testCity) {
        document.querySelector('#cityErrorMsg').innerText = '';
        return true;
    } else {
        document.querySelector('#cityErrorMsg').innerText = 'Veuillez saisir un nom de ville valide.';
        return false;
    }
}

//Ecouter la modification du champ "email"
orderForm.email.addEventListener('change', function() {
    validEmail(this);
})
//Vérifier le champ "email"
function validEmail(inputEmail) {
    let emailRegExp = new RegExp(
        '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.+-]+[.]{1}[a-z]{2,10}$', 'g'
    );
    let testEmail = emailRegExp.test(inputEmail.value);
    if (testEmail) {
        document.querySelector('#emailErrorMsg').innerText = '';
        return true;
    } else {
        document.querySelector('#emailErrorMsg').innerText = 'Veuillez saisir un email valide.';
        return false;
    }
}

//Ecouter la soumission du formulaire
orderForm.addEventListener('submit', function(event) {
    event.preventDefault(); //empêche le comportement par défaut du formulaire

    //Récupérer les données saisies dans le formulaire
    const contact = {
        firstName : document.querySelector('#firstName').value,
        lastName : document.querySelector('#lastName').value,
        address : document.querySelector('#address').value,
        city : document.querySelector('#city').value,
        email : document.querySelector('#email').value
    };

    //Si tous les champs sont correctement remplis
    if (validFirstName(orderForm.firstName) 
            && validLastName(orderForm.lastName) 
            && validAddress(orderForm.address) 
            && validCity(orderForm.city) 
            && validEmail(orderForm.email)) {

        //Inclure les données du formulaire et les ID-produit du panier dans une seule variable
        const toSendToApi = {
        products,
        contact
        };
        console.log(toSendToApi);

        //Envoi de l'objet toSendToApi vers le serveur
        let url = 'http://localhost:3000/api/products/order';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(toSendToApi),
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json",
            }
        }).then(function(res) {
            if (res.ok) {
                return res.json();
            }
        }).then(function(data) {
            localStorage.removeItem('itemOrdered');
            //Rediriger vers la page de confirmation
            location.replace(`./confirmation.html?id=${data.orderId}`);
        }).catch(function(err) {
            console.log('Une erreur est survenue : ' + err);
        })
    }
})
