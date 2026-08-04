import {
  db,
  collection,
  addDoc,
  getDocs,
  getCountFromServer,
  serverTimestamp
} from "./firebase.js";

const categoriesContainer = document.getElementById("categories-container");
const commencerButton = document.getElementById("commencer");
const modalElement = document.getElementById("engagementModal");
const modalTitle = document.getElementById("engagementModalLabel");
const listeMitsvot = document.getElementById("liste-mitsvot");
const listeDurees = document.getElementById("liste-durees");
const engagementForm = document.getElementById("engagement-form");
const messageErreur = document.getElementById("message-erreur");
const boutonValidation = document.getElementById("bouton-validation");
const bandeauEngagements =
    document.getElementById("bandeau-engagements");

const nombreTotalEngagements =
    document.getElementById("nombre-total-engagements");

const engagementModal = new bootstrap.Modal(modalElement);

let categorieSelectionnee = null;

/**
 * Affiche les cartes des catégories.
 */
function afficherCategories() {
  categoriesContainer.innerHTML = "";

  categories.forEach((categorie) => {
    const colonne = document.createElement("div");

    colonne.className = "col-12 col-md-6 col-lg-4";

    colonne.innerHTML = `
  <button
    type="button"
    class="carte-categorie"
    data-category-id="${categorie.id}"
  >
    <span class="illustration-categorie">
      <img
        src="${categorie.image}"
        alt="Illustration de la catégorie ${categorie.titre}"
      >
    </span>

    <span class="contenu-categorie">
  <strong>${categorie.titre}</strong>

  <span class="nombre-mitsvot">
    ${categorie.mitsvot.length} engagements proposés
  </span>
</span>

    <span class="fleche-categorie">
      <i class="bi bi-arrow-right"></i>
    </span>
  </button>
`;
    categoriesContainer.appendChild(colonne);
  });
}

/**
 * Ouvre la fenêtre correspondant à une catégorie.
 */
function ouvrirCategorie(categorieId) {
  categorieSelectionnee = categories.find(
    (categorie) => categorie.id === categorieId
  );

  if (!categorieSelectionnee) {
    return;
  }

  modalTitle.textContent = categorieSelectionnee.titre;

  afficherMitsvot(categorieSelectionnee.mitsvot);
  afficherDurees();

  messageErreur.textContent = "";
  boutonValidation.disabled = false;

  engagementModal.show();
}

/**
 * Affiche les mitsvot sous forme de boutons radio.
 */
function afficherMitsvot(mitsvot) {
  listeMitsvot.innerHTML = "";

  mitsvot.forEach((mitsva, index) => {
    const identifiant = `mitsva-${index}`;

    const option = document.createElement("label");
    option.className = "option-mitsva";
    option.setAttribute("for", identifiant);

    option.innerHTML = `
      <input
        type="radio"
        name="mitsva"
        id="${identifiant}"
        value="${mitsva}"
      >

      <span class="radio-personnalise"></span>

      <span>${mitsva}</span>
    `;

    listeMitsvot.appendChild(option);
  });
}

/**
 * Affiche les différentes durées.
 */
function afficherDurees() {
  listeDurees.innerHTML = "";

  durees.forEach((duree, index) => {
    const identifiant = `duree-${index}`;

    const option = document.createElement("label");
    option.className = "option-duree";
    option.setAttribute("for", identifiant);

    option.innerHTML = `
      <input
        type="radio"
        name="duree"
        id="${identifiant}"
        value="${duree}"
      >

      <span>${duree}</span>
    `;

    listeDurees.appendChild(option);
  });
}

/**
 * Descend jusqu'aux catégories.
 */
commencerButton.addEventListener("click", () => {
  document.getElementById("mitsvot").scrollIntoView({
    behavior: "smooth"
  });
});

/**
 * Détecte le clic sur une carte.
 */
categoriesContainer.addEventListener("click", (event) => {
  const carte = event.target.closest(".carte-categorie");

  if (!carte) {
    return;
  }

  ouvrirCategorie(carte.dataset.categoryId);
});

/**
 * Vérifie le formulaire.
 *
 * Pour le moment, les données sont seulement affichées dans la console.
 * Nous les enregistrerons ensuite dans Firebase.
 */
engagementForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const mitsvaSelectionnee = document.querySelector(
    'input[name="mitsva"]:checked'
  );

  const dureeSelectionnee = document.querySelector(
    'input[name="duree"]:checked'
  );

  if (!mitsvaSelectionnee || !dureeSelectionnee) {
    messageErreur.textContent =
      "Veuillez choisir une mitsva et une durée avant de valider.";

    return;
  }

  messageErreur.textContent = "";

  boutonValidation.disabled = true;

  boutonValidation.innerHTML = `
    <span
      class="spinner-border spinner-border-sm me-2"
      aria-hidden="true"
    ></span>

    Validation...
  `;

const engagement = {
  categorie: categorieSelectionnee.titre,
  categorieId: categorieSelectionnee.id,
  mitsva: mitsvaSelectionnee.value,
  duree: dureeSelectionnee.value,
  date: serverTimestamp()
};

try {
  await addDoc(
    collection(db, "engagements"),
    engagement
  );

  boutonValidation.innerHTML = `
    Engagement validé
    <i class="bi bi-check-circle-fill ms-2"></i>
  `;

  boutonValidation.classList.add("validation-reussie");

  setTimeout(() => {
    window.location.href = "merci.html";
  }, 900);

} catch (erreur) {
  console.error("Erreur Firebase :", erreur);

  messageErreur.textContent =
    "Une erreur est survenue pendant l'enregistrement. Veuillez réessayer.";

  boutonValidation.disabled = false;

  boutonValidation.innerHTML = `
    Valider mon engagement
    <i class="bi bi-check-circle ms-2"></i>
  `;
}
});

async function afficherStatistiques() {
  try {
    const engagementsRef = collection(db, "engagements");

    const resultatComptage =
      await getCountFromServer(engagementsRef);

    const total = resultatComptage.data().count;

    // Pendant les tests : affichage dès 1 engagement
    if (total < 0 ) {
    bandeauEngagements.classList.add("d-none");
    return;
}

nombreTotalEngagements.textContent = total;

bandeauEngagements.classList.remove("d-none");;

  } catch (erreur) {
    console.error(
      "Impossible de charger les statistiques :",
      erreur
    );
  }
}

afficherCategories();
afficherStatistiques();

const anneeFooter = document.getElementById("annee-footer");

if (anneeFooter) {
  anneeFooter.textContent = new Date().getFullYear();
}