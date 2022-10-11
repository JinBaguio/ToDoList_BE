"use strict"

var gulp = require('gulp');
const install = require('gulp-install')
var run = require('gulp-run');
var del = require('del');
const util = require('gulp-util')
var concat = require('concat');
var taskListing = require('gulp-task-listing');
var tslint = require('gulp-tslint');
var fs = require('fs');
var shell = require('shelljs');
const sls = require('serverless-gulp');
const _ = require('lodash');
var flag;
// const paths = {
//     space: ['./**/serverless.yml', '!node_modules/**/serverless.yml']
// }

gulp.task('help', taskListing);
gulp.task('default', gulp.series('help'));

gulp.task('lint', function () {
    console.log('Started code analysis');
    return executeCodeAnalysis();
});

function executeCodeAnalysis() {
    return gulp.src('src/**/*.ts')
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint({
            formatter: 'checkstyle'
        }))       
}


gulp.task('run-test', function (done) {
        var shell = require('shelljs');
        shell.exec('npm run test', function (code, stdout, stderr) {
            console.log('Completed unit test');
            console.log(stdout);
            done();
        });
});

gulp.task('clean-pkg_dist', function () {
    return del(['pkg_dist']);
});

// Gulp task which will create zip file for all the environments specified in the config folder.
gulp.task('package-service', gulp.series('clean-pkg_dist', function (done) {
    var fs = require('fs');
    var shell = require('shelljs');
    shell.exec('npm run package', function (code, stdout, stderr) {
            console.log('Completed serverless package');
            //console.log(stdout);
            done();       
    });
}));

// This task loops through the available configs and creates zip file. ,['build-lambdaFunc']
gulp.task('create-sourceZip', gulp.series('package-service', function (done) {
        console.log('Started compressing the content');
        var fileName;
        var env;
        var fs = require('fs');
        var dir = 'pkg_dist';//var dir = '.package';//

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        
        createEnvSpecificZip('dev');
        createEnvSpecificZip('test');
        createEnvSpecificZip('stg');
        createEnvSpecificZip('prod');
        done();
}));

// This function will create zip for a given environment.
function createEnvSpecificZip(env) {
    // Timer keeps checking whether any other process which is executing this method is completed.
    var timerId = setTimeout(function request() {
        if (flag == false || flag == undefined) {
            flag = true;
            var fs = require('fs');
            var archiver = require('archiver');
            var zipFileName = "pkg_dist/source-" + env + ".zip"
            // var zipFileName = ".package/source-" + env + ".zip"

            var output = fs.createWriteStream(zipFileName);
            var zipArchive = archiver('zip');
            
            // MANUAL REMEDIATION of serverless-state.json
            fixPackageArtifactPath(env);

            // Event which gets executed once the compression process is completed.
            output.on('close', function () {
                clearTimeout(timerId);
                console.log('Completed compressing files for ' + zipFileName);
                flag = false;
                return true;
            });

            zipArchive.pipe(output);

            // Add all the files and folders to be compressed.
           // zipArchive.append(fs.createReadStream('buildspec.yml'), { name: 'buildspec.yml' });
            zipArchive.append(fs.createReadStream('buildspec.' + env + '.yml'), { name: 'buildspec.yml' });
            zipArchive.append(fs.createReadStream('serverless.yml'), { name: 'serverless.yml' });
           // zipArchive.append(fs.createReadStream('config/serverless.config.dev.yml'), { name: 'config/serverless.config.dev.yml' });
           //zipArchive.append(fs.createReadStream('serverless-request-template.txt'), { name: 'serverless-request-template.txt' });
            zipArchive.append(fs.createReadStream('package.json'), { name: 'package.json' });
            // zipArchive.append(fs.createReadStream('serverless.config.' + env + '.yml'), { name: 'serverless.config.' + env + '.yml' });
            zipArchive.directory('ToDoListdshbrd-sls-pkg-' + env + '/', 'ToDoListdshbrd-sls-pkg-' + env + '/');
            //zipArchive.directory('2731-Service-sls-pkg-' + env + '/', '2731-Service-sls-pkg-' + env + '/');
            //zipArchive.directory('LambdaFunc/node_modules/', 'node_modules/');

            zipArchive.finalize(function (err, bytes) {
                if (err) {
                    throw err;
                }
                console.log('done:', base, bytes);
            });
        }
        else {
            timerId = setTimeout(request, 500); // (*)     
        }
    }, 500);
}
function fixPackageArtifactPath(stage){
    var fs = require('fs');
    var packagePath = 'ToDoListdshbrd-sls-pkg-' + stage + '/serverless-state.json'
    
    var stateObj = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    var functions = stateObj.service.functions;

    var newFunctions = _.mapValues(functions, (func) => {
                            // func.package.artifact = _.replace(func.package.artifact, ".serverless\\", "serverless\/");
                            func.package.artifact = _.replace(func.package.artifact, ".serverless\\", "serverless\/");
                            return func;
                        });
    
    // Remediated package path
    stateObj.service.functions = newFunctions;
    // Removed AWS profile
    // delete stateObj.service.provider.profile;
    // delete stateObj.service.custom.configFile.profile;
    
    // fs.writeFileSync(packagePath, JSON.stringify(stateObj, null, '  '));
};

module.exports = gulp;

// gulp.task('clean-build', function () {
//     return del('build');
// });