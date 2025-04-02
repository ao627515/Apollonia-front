import apiService from './ApiService';

class DepartmentsService {
  constructor() {
    this._apiService = apiService;
    this._endpoint = '/departments';
  }
  // Méthodes pour la gestion des services (departments)
  async getAllDepartments() {
    return this.request(`${this._apiService.baseUrl}${this._endpoint.departments}`);
  }

  async getDepartmentById(id) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint.departments}/${id}`);
  }

  async createDepartment(department) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint.departments}`, 'POST', department);
  }

  async updateDepartment(id, department) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint.departments}/${id}`, 'PUT', department);
  }

  async deleteDepartment(id) {
    return this._apiService.request(`${this._apiService.baseUrl}${this._endpoint.departments}/${id}`, 'DELETE');
  }
}

const departmentsService = new DepartmentsService();
export default departmentsService;