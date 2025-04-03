import Employee from '../../models/Empoyee.js';
import departmentsService from '../../serivces/DepartmentsService.js';
import employeesService from '../../serivces/EmployeesService.js'
import Department from "../..//models/Departement.js";


class EmployeeManager {
  constructor() {
    this.employeesService = employeesService;
    this.departmentsService = departmentsService;
    this.employeeModal = document.getElementById('employeeModal');
    this.viewEmployeeModal = document.getElementById('viewEmployeeModal');
    this.confirmDeleteModal = document.getElementById('confirmDeleteModal');
    this.employeeForm = document.getElementById('employeeForm');
    this.employeesTableBody = document.getElementById('employeesTableBody');
    this.addEmployeeBtn = document.getElementById('addEmployeeBtn');
    this.modalTitle = document.getElementById('modalTitle');
    this.employeeId = document.getElementById('employeeId');
    this.firstname = document.getElementById('firstname');
    this.lastname = document.getElementById('lastname');
    this.departmentId = document.getElementById('departmentId');
    this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    this.closeViewBtn = document.getElementById('closeViewBtn');
    this.employeeDetails = document.getElementById('employeeDetails');
    this.alertContainer = document.getElementById('alertContainer');

    this.employeeToDelete = null;
    this.departments = [];

    this.initEventListeners();
    this.loadDepartments().then(() => this.loadEmployees());
  }

  initEventListeners() {
    // Ouvrir le modal d'ajout d'employé
    this.addEmployeeBtn.addEventListener('click', () => this.openEmployeeModal());

    // Fermer les modals
    document.querySelectorAll('.close').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        this.employeeModal.style.display = 'none';
        this.confirmDeleteModal.style.display = 'none';
        this.viewEmployeeModal.style.display = 'none';
      });
    });

    // Soumission du formulaire
    this.employeeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveEmployee();
    });

    // Confirmation de suppression
    this.confirmDeleteBtn.addEventListener('click', () => this.deleteEmployee());
    this.cancelDeleteBtn.addEventListener('click', () => {
      this.confirmDeleteModal.style.display = 'none';
    });

    // Fermer le modal de vue
    this.closeViewBtn.addEventListener('click', () => {
      this.viewEmployeeModal.style.display = 'none';
    });

    // Fermer les modals quand on clique en dehors
    window.addEventListener('click', (e) => {
      if (e.target === this.employeeModal) {
        this.employeeModal.style.display = 'none';
      }
      if (e.target === this.confirmDeleteModal) {
        this.confirmDeleteModal.style.display = 'none';
      }
      if (e.target === this.viewEmployeeModal) {
        this.viewEmployeeModal.style.display = 'none';
      }
    });
  }

  async loadDepartments() {
    try {
      const servicesData = await this.departmentsService.getAllDepartments();
      this.departments = (servicesData ?? []).map(service => {
        try {
          return Department.toModel(service);
        } catch (error) {
          console.warn(`Erreur de conversion pour le service: ${JSON.stringify(service)}`, error);
          return null; // Ignore les services invalides
        }
      }).filter(Boolean); // Supprime les valeurs `null`

      this.populateDepartmentsDropdown();
    } catch (error) {
      this.showAlert('Erreur: ' + error.message, 'danger');
      console.error('Erreur:', error);
    }
  }

  populateDepartmentsDropdown() {
    this.departmentId.innerHTML = '<option value="">Sélectionnez un service</option>';

    this.departments.forEach(department => {
      const option = document.createElement('option');
      option.value = department._id;
      option.textContent = department.name;
      this.departmentId.appendChild(option);
    });
  }

  async loadEmployees() {
    try {
      const employeesData = await this.employeesService.getAllEmployees();
      const employees = (employeesData ?? []).map(employee => {
        try {
          return Employee.toModel(employee);
        } catch (error) {
          console.warn(`Erreur de conversion pour l\'employe: ${JSON.stringify(employee)}`, error);
          return null; // Ignore les employees invalides
        }
      }).filter(Boolean); // Supprime les valeurs `null`

      this.displayEmployees(employees);
    } catch (error) {
      this.showAlert('Erreur: ' + error.message, 'danger');
      console.error('Erreur:', error);
    }
  }

  displayEmployees(employees) {
    if (employees.length === 0) {
      this.employeesTableBody.innerHTML = '<tr><td colspan="5">Aucun employé trouvé</td></tr>';
      return;
    }

    this.employeesTableBody.innerHTML = '';

    employees.forEach(employee => {
      // const department = this.departments.find(d => d._id == employee.department) || { name: 'Non assigné' };
      // console.log(employee);

      const row = document.createElement('tr');
      row.innerHTML = `
                        <td>${employee._id}</td>
                        <td>${employee.lastname}</td>
                        <td>${employee.firstname}</td>
                        <td>${employee.department?.name || { name: employee.department || 'Non assigné' }} </td>
                        <td class="action-buttons">
                            <button class="btn view-btn" data-id="${employee._id}">Voir</button>
                            <button class="btn btn-warning edit-btn" data-id="${employee._id}">Modifier</button>
                            <button class="btn btn-danger delete-btn" data-id="${employee._id}">Supprimer</button>
                        </td>
                    `;

      this.employeesTableBody.appendChild(row);
    });

    // Ajouter les écouteurs d'événements aux boutons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.viewEmployee(id);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.openEmployeeModal(id);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.confirmDelete(id);
      });
    });
  }

  async viewEmployee(id) {
    try {
      const employeeData = await this.employeesService.getEmployeeById(id);

      if (!employeeData) {
        throw new Error('Employé non trouvé');
      }

      const employee = Employee.toModel(employeeData);

      // const department = this.departments.find(d => d.id == employee.department) || { name: 'Non assigné' };

      this.employeeDetails.innerHTML = `
                        <div style="margin-bottom: 15px;">
                            <strong>ID:</strong> ${employee._id}
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>Nom:</strong> ${employee.lastname}
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>Prénom:</strong> ${employee.firstname}
                        </div>
                        <div>
                            <strong>Service:</strong> ${employee.department?.name || { name: employee.department || 'Non assigné' }}
                        </div>
                    `;

      this.viewEmployeeModal.style.display = 'block';
    } catch (error) {
      this.showAlert('Erreur: ' + error.message, 'danger');
    }
  }

  async openEmployeeModal(id = null) {
    this.employeeForm.reset();

    if (id) {
      // Mode édition
      this.modalTitle.textContent = 'Modifier l\'Employé';
      try {
        const employeeData = await this.employeesService.getEmployeeById(id);
        if (!employeeData) {
          throw new Error('Employé non trouvé');
        }

        const employee = Employee.toModel(employeeData);
        this.employeeId.value = employee._id;
        this.firstname.value = employee.firstname;
        this.lastname.value = employee.lastname;
        this.departmentId.value = employee.department?._id || employee.department;
        console.log(this.departmentId.value);


      } catch (error) {
        this.showAlert('Erreur: ' + error.message, 'danger');
        return;
      }
    } else {
      // Mode ajout
      this.modalTitle.textContent = 'Ajouter un Employé';
      this.employeeId.value = '';
    }

    this.employeeModal.style.display = 'block';
  }

  async saveEmployee() {
    const id = this.employeeId.value;
    const firstname = this.firstname.value.trim();
    const lastname = this.lastname.value.trim();
    const department = this.departmentId.value;

    if (!firstname || !lastname || !department) {
      this.showAlert('Tous les champs sont requis', 'warning');
      return;
    }

    console.log({ firstname, lastname, department });


    try {
      if (id) {
        await this.employeesService.updateEmployee(id, { firstname, lastname, department });
      } else {
        await this.employeesService.createEmployee({ firstname, lastname, department });
      }

      this.employeeModal.style.display = 'none';
      this.showAlert(id ? 'Employé modifié avec succès' : 'Employé ajouté avec succès', 'success');
      this.loadEmployees();
    } catch (error) {
      this.showAlert('Erreur: ' + error.message, 'danger');
    }
  }

  confirmDelete(id) {
    this.employeeToDelete = id;
    this.confirmDeleteModal.style.display = 'block';
  }

  async deleteEmployee() {
    if (!this.employeeToDelete) return;

    try {
      const response = await this.employeesService.deleteEmployee(this.employeeToDelete);

      if (!response) {
        throw new Error('Erreur lors de la suppression de l\'employé');
      }

      this.confirmDeleteModal.style.display = 'none';
      this.showAlert('Employé supprimé avec succès', 'success');
      this.loadEmployees();
    } catch (error) {
      this.showAlert('Erreur: ' + error.message, 'danger');
    }
  }

  showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    this.alertContainer.innerHTML = '';
    this.alertContainer.appendChild(alert);

    // Faire disparaître l'alerte après 3 secondes
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  const employeeManager = new EmployeeManager();
});