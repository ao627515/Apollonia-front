class Department {
  constructor({ _id = undefined, name }) {
    this.name = name;
    this._id = _id;
  }

  /**
 * Convertit l'instance en objet simple pour l'API
 */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  static toModel(data) {
    const model = new this(data);
    const validation = model.validate();

    if (!validation.isValid) {
      throw new Error(`Erreur lors de la création du modèle: ${JSON.stringify(validation.errors)}`);
    }

    return model;
  }


  /**
   * Valide les données du service
   * @returns {Object} - {isValid: boolean, errors: Array}
   */
  validate() {
    const errors = [];

    if (!this.name) errors.push('Le nom du service est requis');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default Department;