import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Если есть стили, если нет - удалите эту строку

// Находим элемент root в HTML
const rootElement = document.getElementById('root');

if (rootElement) {
  // Создаем корень приложения (новый стандарт React 18)
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("НЕ НАЙДЕН элемент с id='root' в index.html");
}
