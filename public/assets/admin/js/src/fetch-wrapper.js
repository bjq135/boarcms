import {getCookie, setCookie} from './cookie.js';


export default function (url, options = {}) {
  let _csrf = getCookie('_csrf');
  
  let reqOptions = {};

  if( url.slice(0,4) !== 'http'){
    url = document.querySelector('input[name="site_url"]').value + url;
  }

  // console.log('url',url)
  let urlObj = new URL(url);

  let searchString = urlObj.search;
  let searchArr = new URLSearchParams(searchString);
  searchArr.append('_csrf', _csrf);

  url = urlObj.pathname + '?' + searchArr.toString();

  reqOptions = Object.assign(options, reqOptions);

  return fetch(url, reqOptions).then(handleResponse);
}


async function handleResponse(response) {
  // console.log('response: ', response)
  // if (!response.ok) {
  //   const error = response.statusText;
  //   return Promise.reject(error);
  // }
  
  return response;
}

