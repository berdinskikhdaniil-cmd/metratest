import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Пишем в консоль, что скрипт вообще запустился
console.log("🚀 ЗАПУСК: index.tsx начал выполнение");

const rootElement = document.getElementById('root');

// 2. Проверяем, нашел ли он div в HTML
if (!rootElement) {
  console.error("❌ ОШИБКА: Не найден элемент с id='root' в index.html");
  document.body.innerHTML = "<h1 style='color:red'>ОШИБКА: Нет root элемента</h1>";
} else {
  console.log("✅ Элемент root найден. Пытаюсь отрисовать App...");
  
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("🎉 Рендер вызван успешно");
  } catch (e) {
    console.error("❌ ОШИБКА при рендере:", e);
  }
}
