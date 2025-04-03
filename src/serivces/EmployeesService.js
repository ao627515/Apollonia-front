import apiService from './ApiService.js';

class EmployeesService {

  constructor() {
    this._apiService = apiService;
    this._endpoint = '/employees';
  }

  // Méthodes pour la gestion des employés
  async getAllEmployees() {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}`);
  }

  async getEmployeeById(id) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}/${id}`);
  }

  async createEmployee(employee) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}`, 'POST', employee);
  }

  async updateEmployee(id, employee) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}/${id}`, 'PUT', employee);
  }

  async deleteEmployee(id) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}/${id}`, 'DELETE');
  }

}

const employeesService = new EmployeesService();
export default employeesService;