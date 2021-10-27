import { requestInterceptor } from "./requestInterceptor";
console.log('Hey! This code is executed in the background, you will not see it in the browser console...');

const test = new requestInterceptor();
console.dir(`jackbg xAuthToken: ${test.xAuthToken}`);