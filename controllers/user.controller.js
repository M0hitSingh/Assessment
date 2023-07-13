const asyncWrapper = require("../util/asyncWrapper");
const request = require('request');
const https = require('https');
const fs = require('fs');
const {createCustomError} = require('../errors/customAPIError')
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");
const testcase = require("../model/testcase");
const { resolve } = require("path");
const problem = require("../model/problem");
const APIFeatures = require("../util/APIfeature");
const Email = require('../util/sendgrid')
// submit a solution

const submit = asyncWrapper(async(req,res,next)=>{
    try{
        const questionId = req.body.questionId;
        const tests = await testcase.findOne({questionId:questionId});
        request({
            url:'https://' +process.env.ENDPOINT + '/api/v4/submissions?access_token=' + process.env.ACCESS_TOKEN,
            method:'POST',
            form : {
                compilerId: req.body.compilerId,
                source: `${req.body.source}`,
                input: tests.input
            }
        },async function(error,response,body){
            if (error) {
                console.log('Connection problem');
            }
            if (response) {
                if (response.statusCode === 201) {
                    await Email.sendEmail(req.user.details.email,response.body);
                    return res.json(sendSuccessApiResponse(JSON.parse(response.body),200));
                } else {
                    if (response.statusCode === 401) {
                        const msg = 'Invalid access token';
                        return next(createCustomError(msg,400));
                    } else if (response.statusCode === 402) {
                        const msg = 'Unable to create submission';
                        return next(createCustomError(msg,400));
                    } else if (response.statusCode === 400) {
                        const msg = 'Error code: ' + body.error_code + ', details available in the message: ' + body.message;
                        return next(createCustomError(msg,400));
                    }
                }
            }
        })

    }
    catch(err){
        return next(createCustomError(err,400));
    }
});
const result = asyncWrapper(async (req,res,next)=>{
    try{
        const submissionId = req.params.id;
        let data ='';
        const questionId = req.query.questionId
        const tests = await testcase.findOne({questionId:questionId});
        let doc;
        const myPromise = new Promise((resolve,reject)=>{
        
            request({
                url: 'https://' + process.env.ENDPOINT + '/api/v4/submissions/' + submissionId + '?access_token=' + process.env.ACCESS_TOKEN,
                method: 'GET'
            },function (error, response, body) {
                if (error) {
                    console.log('Connection problem');
                }
                
                // process response
                if (response) {
                    response.body = JSON.parse(response.body)
                    if (response.statusCode === 200) {
                        doc = response.body;
                        if(response.body.result.streams.error){
                            return next(createCustomError(response.body.result.streams.error,301));
                        }
                        // return res.json(sendSuccessApiResponse(response.body,200));

                        resolve();
                    } else {
                        if (response.statusCode === 401) {
                            const msg = 'Invalid access token';
                            return next(createCustomError(msg,400));
                        }
                        if (response.statusCode === 403) {
                            const msg = 'Access denied';
                            return next(createCustomError(msg,400));
                        }
                        if (response.statusCode === 404) {
                            const msg = 'Submision not found';
                            return next(createCustomError(msg,400));
                        }
                    }
                    // reject();
                }
            });
        }).then(async()=>{
            data ='';
            const sleep = ms => new Promise(res => setTimeout(res, ms));
            const url = (doc.result.streams.output==null)? doc.result.streams.cmpinfo.uri : doc.result.streams.output.uri;
            https.get(url,(res)=>{
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    // console.log(data);
                });
                res.on("error", (err) => {
                    console.log("Error: " + err.message);
                })
            })
            await sleep(2000);
            const result = {
                "status":doc.result.status.name,
                "time":doc.result.time,
                "memory":doc.result.memory,
                "output":data,
                "solution": (tests.output==data)? "Correct Output" : `Incorrect Output : ${data}`
            }
            await Email.sendEmail(req.user.details.email,result);
            return res.json(sendSuccessApiResponse(result,200));

        })
        .catch((err)=>{
            return next(createCustomError(err,400));
        })
    }
    catch(err){
        return next(createCustomError(err,400));
    }
})

const allProblem = asyncWrapper(async(req,res,next)=>{
    try{
        const total = await problem.countDocuments();
        const {
            query,
            page:page,
            limit:limit,
        } = new APIFeatures(problem.find(),req.query)
        .page();
        const data = await query.query;
        res.json(sendSuccessApiResponse(data,{
            "total":total,
            "pages":limit,
            "page":page
        }));
    }
    catch(err){
        return next(createCustomError(err,400));
    }
});

module.exports = {submit,result,allProblem}