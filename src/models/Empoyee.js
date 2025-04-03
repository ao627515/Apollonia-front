import Department from "./Departement.js";

class Employee {
  constructor({ _id = undefined, firstname, lastname, department }) {
    this.id = _id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.department = Department.toModel(department);
  }

  toJSON() {
    return {
      firstname: this.firstname,
      lastname: this.lastname,
      department: this.department._id
    }
  }

  static toModel(data) {
    const model = new this(data);
    const validation = model.validate();

    if (!validation.isValid) {
      throw new Error(`Erreur lors de la création du modèle: ${JSON.stringify(validation.errors)}`);
    }

    return model;
  }

  validate() {
    const errors = [];

    if (!this.firstname) errors.push('Le prenom de l\'emplee est requis');
    if (!this.lastname) errors.push('Le nom de famille de l\'emplee est requis');
    if (!this.department) errors.push('Le department de l\'emplee est requis');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default Employee;