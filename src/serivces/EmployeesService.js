// import apiService from './ApiService';

class EmployeesService {

  constructor() {
    this._apiService = apiService;
    this._endpoint = '/employees';
  }

  // Méthodes pour la gestion des employés
  async getAllEmployees() {
    return this.request(`${this._apiService.baseUrl}${this._endpoint.employees}`);
  }

  async getEmployeeById(id) {
    return this.request(`${this._apiService.baseUrl}${this._endpoint.employees}/${id}`);
  }

  async createEmployee(employee) {
    return this.request(`${this._apiService.baseUrl}${this._endpoint.employees}`, 'POST', employee);
  }

  async updateEmployee(id, employee) {
    return this.request(`${this._apiService.baseUrl}${this._endpoint.employees}/${id}`, 'PUT', employee);
  }

  async deleteEmployee(id) {
    return this.request(`${this._apiService.baseUrl}${this._endpoint.employees}/${id}`, 'DELETE');
  }

}

const employeesService = new EmployeesService();
export default employeesService;