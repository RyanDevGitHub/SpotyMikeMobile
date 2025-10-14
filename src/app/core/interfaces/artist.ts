export interface IArtistContainer {
  cover: string;
  name: string;
  id: string;
}
export interface IArtistInfo {
  id: string; // identifiant unique de l'artiste
  userId: string; // identifiant de l'utilisateur associé
  firstName: string; // prénom ou nom affiché
  label?: string; // label ou groupe (optionnel)
  avatar?: string; // URL de l'image de profil (optionnel)
}
