import './assets/index.css';
import hello from './hello';
import world from './world';

import logo from './assets/logo.jpg';
$('.imgblock').attr('src',logo);

const str1 = hello();
const str2 = world();
$('.hello').html(str1);
$('.world').html(str2);

