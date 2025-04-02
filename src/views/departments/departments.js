// Classe pour la gestion des services
import departmentsService from "../../serivces/DepartmentsService.js";

class DepartmentManager {
  constructor() {
    this.deparmentService = departmentsService;
    this.serviceModal = document.getElementById('serviceModal');
    this.confirmDeleteModal = document.getElementById('confirmDeleteModal');
    this.serviceForm = document.getElementById('serviceForm');
    this.servicesTableBody = document.getElementById('servicesTableBody');
    this.addServiceBtn = document.getElementById('addServiceBtn');
    this.modalTitle = document.getElementById('modalTitle');
    this.serviceId = document.getElementById('serviceId');
    this.serviceName = document.getElementById('serviceName');
    this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    this.alertContainer = document.getElementById('alertContainer');

    this.serviceToDelete = null;

    this.initEventListeners();
    this.loadServices();
  }

  initEventListeners() {
    // Ouvrir le modal d'ajout de service
    this.addServiceBtn.addEventListener('click', () => this.openServiceModal());

    // Fermer les modals
    document.querySelectorAll('.close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        this.serviceModal.style.display = 'none';
        this.confirmDeleteModal.style.display = 'none';
      });
    });

    // Soumission du formulaire
    this.serviceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveService();
    });

    // Confirmation de suppression
    this.confirmDeleteBtn.addEventListener('click', () => this.deleteService());
    this.cancelDeleteBtn.addEventListener('click', () => {
      this.confirmDeleteModal.style.display = 'none';
    });

    // Fermer les modals quand on clique en dehors
    window.addEventListener('click', (e) => {
      if (e.target === this.serviceModal) {
        this.serviceModal.style.display = 'none';
      }
      if (e.target === this.confirmDeleteModal) {
        this.confirmDeleteModal.style.display = 'none';
      }
    });
  }

  async loadServices() {
    try {
      const services = await this.deparmentService.getAllDepartments() ?? [];
      this.displayServices(services);
    } catch (error) {
      this.showAlert('Erreur: ' + error.message, 'danger');
      console.error('Erreur:', error);
    }
  }

  displayServices(services) {
    if (services.length === 0) {
      this.servicesTableBody.innerHTML = '<tr><td colspan="3">Aucun service trouvé</td></tr>';
      return;
    }

    this.servicesTableBody.innerHTML = '';

    services.forEach(service => {
      const row = document.createElement('tr');
      row.innerHTML = `
                        <td>${service._id}</td>
                        <td>${service.name}</td>
                        <td class="action-buttons">
                            <button class="btn btn-warning edit-btn" data-id="${service._id}">Modifier</button>
                            <button class="btn btn-danger delete-btn" data-id="${service._id}">Supprimer</button>
                        </td>
                    `;

      this.servicesTableBody.appendChild(row);
    });

    // Ajouter les écouteurs d'événements aux boutons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.openServiceModal(id);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.confirmDelete(id);
      });
    });
  }

  async openServiceModal(id = null) {
    this.serviceForm.reset();

    if (id) {
      // Mode édition
      this.modalTitle.textContent = 'Modifier le Service';
      try {
        const response = await fetch(`${this.apiBaseUrl}/departments/${id}`);
        if (!response.ok) {
          throw new Error('Service non trouvé');
        }

        const service = await response.json();
        this.serviceId.value = service.id;
        this.serviceName.value = service.name;
      } catch (error) {
        this.showAlert('Erreur: ' + error.message, 'danger');
        return;
      }
    } else {
      // Mode ajout
      this.modalTitle.textContent = 'Ajouter un Service';
      this.serviceId.value = '';
    }

    this.serviceModal.style.display = 'block';
  }

  async saveService() {
    const id = this.serviceId.value;
    const name = this.serviceName.value.trim();

    if (!name) {
      this.showAlert('Le nom du service est requis', 'warning');
      return;
    }

    try {
      let url = `${this.apiBaseUrl}/departments`;
      let method = 'POST';

      if (id) {
        url = `${url}/${id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du service');
      }

      this.serviceModal.style.display = 'none';
      this.showAlert(id ? 'Service modifié avec succès' : 'Service ajouté avec succès', 'success');
      this.loadServices();
    } catch (error) {
      this.showAlert('Erreur: ' + error.message, 'danger');
    }
  }

  confirmDelete(id) {
    this.serviceToDelete = id;
    this.confirmDeleteModal.style.display = 'block';
  }

  async deleteService() {
    if (!this.serviceToDelete) return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/departments/${this.serviceToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du service');
      }

      this.confirmDeleteModal.style.display = 'none';
      this.showAlert('Service supprimé avec succès', 'success');
      this.loadServices();
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
  const departmentManager = new DepartmentManager();
});