import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 - Página no encontrada</h1>
      <p className="not-found-message">Lo sentimos, la página que buscas no existe.</p>
      <a href="/" className="not-found-link">Volver a la página de inicio</a>
    </div>
  );
}

export default NotFound;
