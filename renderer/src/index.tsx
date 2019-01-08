import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from 'styled-components';
import { BasicTheme } from './style/theme/themes/basic.theme';
import App from './components/App';

ReactDOM.render(
    <ThemeProvider theme={BasicTheme}>
        <App />
    </ThemeProvider>
    , document.getElementById('root'));
