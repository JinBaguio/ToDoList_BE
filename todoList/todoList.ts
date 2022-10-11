import { todoListService } from '../src/services/todoListService';

let response: object;
const svc = new todoListService();
var AWS = require('aws-sdk'); 
AWS.config.update({region:'us-east-1'});

export function handler (event: any, context: any, callback: (...args: any[]) => void): void {
    if(event.invocationType == "warmer"){
        setTimeout(function() {
            var response = {
                contentType: "application/json",
                statusCode: 200,
                message: 'warming up lambda: todoListHandler...'
            };
            callback(null, response);
        }, 10000);
    } else {  

        getToDoList().then(function (result) { 
            response = {
                headers: {
                    "Access-Control-Allow-Origin": "*", //To be updated based on application URL
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
                    "Content-Security-Policy": "'Include default-src 'self' 'unsafe-eval' 'unsafe-inline' ; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self'  data:; connect-src 'self' ; font-src 'self'  report-uri /csp_report; form-action 'self''",
                    "Strict-Transport-Security": "'max-age=31536000; includeSubDomains'",
                    "X-Content-Type-Options": "nosniff",
                    "X-XSS-Protection": "1",
                    "X-Frame-Options": "SAMEORIGIN",
                    "Cache-Control": "no-store",
                    "Referrer-Policy": "no-referrer"
                    },
                body: JSON.stringify(result.Items)               
                    };                       
                    callback(null, result.Items);
                }); 

        getListByNo(event, svc).then(function (result) { 
            response = {
                headers: {
                    "Access-Control-Allow-Origin": "*", //To be updated based on application URL
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
                    "Content-Security-Policy": "'Include default-src 'self' 'unsafe-eval' 'unsafe-inline' ; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self'  data:; connect-src 'self' ; font-src 'self'  report-uri /csp_report; form-action 'self''",
                    "Strict-Transport-Security": "'max-age=31536000; includeSubDomains'",
                    "X-Content-Type-Options": "nosniff",
                    "X-XSS-Protection": "1",
                    "X-Frame-Options": "SAMEORIGIN",
                    "Cache-Control": "no-store",
                    "Referrer-Policy": "no-referrer"
                    },
                body: JSON.stringify(result.Items)               
                    };                       
                    callback(null, result.Items);
                }); 

        addToDoList(event, svc).then(function (result) { 
            var response = {
                headers: {
                    "Access-Control-Allow-Origin": "*", //To be updated based on application URL
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
                    "Content-Security-Policy": "'Include default-src 'self' 'unsafe-eval' 'unsafe-inline' ; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self'  data:; connect-src 'self' ; font-src 'self'  report-uri /csp_report; form-action 'self''",
                    "Strict-Transport-Security": "'max-age=31536000; includeSubDomains'",
                    "X-Content-Type-Options": "nosniff",
                    "X-XSS-Protection": "1",
                    "X-Frame-Options": "SAMEORIGIN",
                    "Cache-Control": "no-store",
                    "Referrer-Policy": "no-referrer"
                },
                contentType: "application/json",
                statusCode: 200,
                message: 'Successfully added!'
                };
            callback(null, response);
            });
            
        updateToDoList(event, svc).then(function (result) { 
            var response = {
                headers: {
                    "Access-Control-Allow-Origin": "*", //To be updated based on application URL
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
                    "Content-Security-Policy": "'Include default-src 'self' 'unsafe-eval' 'unsafe-inline' ; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self'  data:; connect-src 'self' ; font-src 'self'  report-uri /csp_report; form-action 'self''",
                    "Strict-Transport-Security": "'max-age=31536000; includeSubDomains'",
                    "X-Content-Type-Options": "nosniff",
                    "X-XSS-Protection": "1",
                    "X-Frame-Options": "SAMEORIGIN",
                    "Cache-Control": "no-store",
                    "Referrer-Policy": "no-referrer"
                },
                contentType: "application/json",
                statusCode: 200,
                message: 'Successfully updated!'
                };
            callback(null, response);
            }); 

        deletToDoList(event, svc).then(function (result) { 
            var response = {
                headers: {
                    "Access-Control-Allow-Origin": "*", //To be updated based on application URL
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS 
                    "Content-Security-Policy": "'Include default-src 'self' 'unsafe-eval' 'unsafe-inline' ; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self'  data:; connect-src 'self' ; font-src 'self'  report-uri /csp_report; form-action 'self''",
                    "Strict-Transport-Security": "'max-age=31536000; includeSubDomains'",
                    "X-Content-Type-Options": "nosniff",
                    "X-XSS-Protection": "1",
                    "X-Frame-Options": "SAMEORIGIN",
                    "Cache-Control": "no-store",
                    "Referrer-Policy": "no-referrer"
                },
                contentType: "application/json",
                statusCode: 200,
                message: 'Successfully deleted!'
                };
            callback(null, response);
        }); 
    }

    function getToDoList(): Promise<any> {
        return svc.getToDoList();
    }

    function getListByNo(event: any, svc: todoListService): Promise<any> {
        return svc.getListByNo(event.queryStringParameters.no);
    }

    function addToDoList(event: any, svc: todoListService): Promise<any> {
        return svc.addToDoList(event.queryStringParameters.id, event.queryStringParameters.dtDue, event.queryStringParameters.no, event.queryStringParameters.status, event.queryStringParameters.taskAssingd, event.queryStringParameters.taskDesc);
    }

    function updateToDoList(event: any, svc: todoListService): Promise<any> {
        return svc.updateToDoList(event.queryStringParameters.id, event.queryStringParameters.dtDue, event.queryStringParameters.no, event.queryStringParameters.status, event.queryStringParameters.taskAssingd, event.queryStringParameters.taskDesc);
    }

    function deletToDoList(event: any, svc: todoListService): Promise<any> {
        return svc.deletToDoList(event.queryStringParameters.id);
    }
}
