/**
 * Service API pour la gestion des communications avec le backend
 */
class ApiService {
  constructor() {
    this.baseUrl = 'http://127.0.0.1:3000';
  }

  /**
   * Méthode générique pour effectuer des requêtes
   * @param {string} url - URL de l'endpoint
   * @param {string} method - Méthode HTTP (GET, POST, PUT, DELETE)
   * @param {Object} body - Corps de la requête (optionnel)
   * @returns {Promise} - Promesse avec les données ou l'erreur
   */
  async request(url, method = 'GET', body = null) {
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Pour les méthodes qui ne retournent pas de contenu
      if (method === 'DELETE') {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

}

// Exportation comme singleton pour utilisation dans toute l'application
const apiService = new ApiService();
export default apiService;
