document.addEventListener('DOMContentLoaded', function() {
    // Verifica si el usuario está autenticado
    if (localStorage.getItem('authenticated') !== 'true') {
      // Redirige a la página de inicio de sesión si no está autenticado
      window.location.href = 'login'; // Cambia a la URL de la página de inicio de sesión
    }
  });