import {applyAnnotation, createBadgeAnnotation} from './annotations'
declare global { interface Window { 
    applyAnnotation: Function, 
    createBadgeAnnotation: Function 
} }
window.applyAnnotation = applyAnnotation
window.createBadgeAnnotation = createBadgeAnnotation