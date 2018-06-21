/* Simple function to test all incoming Header, Query String and URI, 
* at CF Entry or Origin Entry.
* For CF entry point - copy paste the following code in Viewer Request hook in Lambda@Edge for CF
* For Origin entry point - copy paste the following code in Origin Request hook in Lambda@Edge for CF
*  Vivek Sharma 
*/

'use strict';
const querystring = require('querystring');

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    let url_c = 'Uri: ' + request.uri+ '\n';
    let url_b =  '<p><strong>Uri: </strong>'+ request.uri + '</p>';
    
    if (request.querystring){
        url_c = 'Uri: ' + request.uri + '?' + request.querystring + '\n';
        url_b =  '<p><strong>Uri: </strong>'+ request.uri + '?' + request.querystring + '</p>';
    }

    var content ='';
    let curl_output = url_c;
    let browser_output= url_b;

    for (var key in headers) {
        if (headers.hasOwnProperty(key)) {
            for (var val in headers[key]) { 
                if (headers[key].hasOwnProperty(val)){
                    curl_output = curl_output + ( headers[key][val].key + ' : ' +  headers[key][val].value ) + '\n';
                    browser_output += '<p><strong>'+ headers[key][val].key + '</strong>: '+ headers[key][val].value + '</p>';
                }
            }
        }
    }
    if (headers['user-agent']) {
       if ((headers['user-agent'][0].value).indexOf('curl') >= 0){
            content = curl_output;
        }else{
            content = browser_output;
        }
    }

    const response = {
        status: '200',
        statusDescription: 'OK',
        headers: {
            'cache-control': [{
                key: 'Cache-Control',
                value: 'no-store'
            }],
            'content-type': [{
                key: 'Content-Type',
                value: 'text/html'
            }],
            'content-encoding': [{
                key: 'Content-Encoding',
                value: 'UTF-8'
            }],
        },
        body: content,
    };
    callback(null, response);
};
