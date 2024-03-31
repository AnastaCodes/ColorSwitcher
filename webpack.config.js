const path = require('path');

module.exports = {
    mode: 'development', // Или 'production' для оптимизации размера и скорости загрузки
    entry: './js/index.js', // Точка входа в ваше приложение
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'), // Папка для собранных файлов
        filename: 'bundle.js', // Имя собранного файла
    }
};
