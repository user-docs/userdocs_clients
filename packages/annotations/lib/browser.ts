import {applyAnnotation} from './annotations'
declare global { interface Window { applyAnnotation: Function } }
window.applyAnnotation = applyAnnotation