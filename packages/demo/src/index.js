import { createElement, render } from '/jsx2/jsx2';
import { App, SyncSetState } from './App.js';
import './index.css';

render(<SyncSetState />, document.getElementById('root'));
