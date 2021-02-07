import { createElement, render, hydrate } from 'jsx2';
import { App, Raf } from './App.js';
import './index.css';

const r = document.createElement('root');
const root = document.getElementById('root');
render(<App />, r);
root.innerHTML = r.innerHTML;
hydrate(<App />, root);
