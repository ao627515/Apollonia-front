import apiService from './ApiService.js';

class DepartmentsService {
  constructor() {
    this._apiService = apiService;
    this._endpoint = '/departments';
  }
  // Méthodes pour la gestion des services (departments)
  async getAllDepartments() {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}`);
  }

  async getDepartmentById(id) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}/${id}`);
  }

  async createDepartment(department) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}`, 'POST', department);
  }

  async updateDepartment(id, department) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}/${id}`, 'PUT', department);
  }

  async deleteDepartment(id) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint}/${id}`, 'DELETE');
  }
}

const departmentsService = new DepartmentsService();
export default departmentsService;