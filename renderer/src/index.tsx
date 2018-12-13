import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CausalCanvas from './components/CausalCanvas';
import { ThemeProvider } from 'styled-components';
import { BasicTheme } from './style/theme/themes/basic.theme';

ReactDOM.render(
    <ThemeProvider theme={BasicTheme}>
        <CausalCanvas />
    </ThemeProvider>
    , document.getElementById('root'));
