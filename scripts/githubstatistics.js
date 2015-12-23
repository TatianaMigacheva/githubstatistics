/* Note!
!!Personal token is hardcoded!!
set your personal GitHub API token to "token" variable before running the script 
*/

"use strict";
// Buttons
var buttonGetStat = document.getElementById('getstats');
var buttonTest = document.getElementById('test');

// PR JSON properties list
var arrayPRFields = ["number", "state", "title", "created_at", "closed_at", "merged_at"];
// nested properties which are not array PRFields: "user.login",, "base.ref"
//var arrayPRNestedFields = {"user":"login", "base":"ref"};
//fields labels for result CSV
var arrayPRLabels = ["number", "state", "title", "created_at", "closed_at", "merged_at", "author", "target_branch", "bug_number", "files_changed", "loc_added", "loc_deleted", "loc_changed"];
// PR Files JSON properties list
var arrayFilePRFields = ["filename", "additions", "deletions", "changes", "PR_number"];

function parsePRNumber(responseURL) {
                    var prNumber = /(\d+)\/files/.exec(responseURL);
                    if ( prNumber != null) {
                        prNumber = prNumber[1];
                    }
                    return prNumber;
};

function parsePR(arr,xmlhttp,arrayCommon) {
    "use strict";
    if (!/\/files.*/g.exec(xmlhttp.responseURL)) {
        //debugger;
        //parse PR api request
            var onePR={};
            //adding values from fileds in arrayPRFields
            for (var i in arrayPRFields) {
                //parsing data fields - T and Z symbols removed
                if ( arrayPRFields[i].indexOf("_at") != "-1" && arr[arrayPRFields[i]] != null)  {
                    arr[arrayPRFields[i]] = arr[arrayPRFields[i]].replace(/T/gi," ");
                    arr[arrayPRFields[i]] = arr[arrayPRFields[i]].replace(/Z/gi,"");
                }
                onePR[arrayPRFields[i]] = arr[arrayPRFields[i]];
            }
            //adding values from sub fields: "user.login",, "base.ref" for PR request
            onePR["author"] = arr["user"].login;
            onePR["target_branch"] = arr["base"].ref;
            //adding value to "bug_number" field 
            var bugNumber = onePR["title"].match(/^Bug\s(\d+)\s.*/i);
            if (bugNumber !=null && bugNumber[1] !=null) {
                onePR["bug_number"] = bugNumber[1];
            } else {
                onePR["bug_number"] = "undefined";
            }
            //debugger;
            onePR["files_changed"] = 0;
            onePR["loc_added"] = 0;
            onePR["loc_deleted"] = 0;
            onePR["loc_changed"] = 0; 
            arrayCommon.arrayPR.push(onePR);
            return arrayCommon;
    } else {
        //parse PR Files api request
        //debugger;
            var sumAdditions=0;
            var sumDeletions=0;
            var sumChanges=0;
            var sumFiles=0;
            var subArrayPRFiles={};
            var prNumber;
            for (var i in arr) {
                subArrayPRFiles={};
                for (var j in arrayFilePRFields) {
                    if (arrayFilePRFields[j] === "PR_number") {
                        prNumber = parsePRNumber(xmlhttp.responseURL);
                        subArrayPRFiles["PR_number"] = prNumber;
                    } else {
                        subArrayPRFiles[arrayFilePRFields[j]] = arr[i][arrayFilePRFields[j]];
                        switch (arrayFilePRFields[j]) {
                            case "additions":
                                sumAdditions += arr[i][arrayFilePRFields[j]];
                                break;
                            case "deletions":
                                sumDeletions += arr[i][arrayFilePRFields[j]];
                                break;
                            case "changes":
                                sumChanges += arr[i][arrayFilePRFields[j]];
                                break;
                        }
                    }
                }
                //debugger;
                arrayCommon.arrayFiles.push(subArrayPRFiles);
            }
            //debugger;
            arrayCommon.arrayPR[prNumber-1]["files_changed"] += Number(i)+1;
            arrayCommon.arrayPR[prNumber-1]["loc_added"] += sumAdditions;
            arrayCommon.arrayPR[prNumber-1]["loc_deleted"] += sumDeletions;
            arrayCommon.arrayPR[prNumber-1]["loc_changed"] += sumChanges;          
            return arrayCommon;
    }
}

buttonGetStat.onclick = function getGHStatistics (){
    "use strict";
    var getPRUrl;
    var getPRFilesUrl;
    var getPRFilesUrlPage;
    var pageLink;
    var nextPage;
    var token = "";//set your personal GitHub API token before running the script
    var xmlhttp = new XMLHttpRequest();
    var xmlhttpErrorFlag;
    var ghRepoPath = document.getElementById('ghRepoPath').value;
    ghRepoPath = ghRepoPath.trim();
    //todo
    //var startDate;
    //var endDate;
    //startDate = document.getElementById('startDate').value;
    //endDate = document.getElementById('endDate').value;
    if ( ghRepoPath === "" ) {
        alert("Please fill 'GitHub repo link'");
        return;
    }
    //Set Report title in first row or line
    var reportPRTitle = ghRepoPath+" PR Statistics";
    var reportFilesTitle = ghRepoPath+" Files Statistics";
    var arrayCommon=[];
    var arrayPR = [];
    var arrayFiles = [];
    var pageLink;
    var nextPage;
    arrayCommon = {arrayPR:arrayPR, arrayFiles:arrayFiles};
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onload = function() {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                var arrayGH = JSON.parse(xmlhttp.responseText);
                arrayCommon = parsePR(arrayGH, xmlhttp, arrayCommon);
                debugger;
                if (/\/files.*/g.exec(xmlhttp.responseURL)) {
                    pageLink = xmlhttp.getResponseHeader('Link');
                    if ( pageLink != null) {
                        pageLink=pageLink.split(",");
                        pageLink[0]=pageLink[0].split(";");
                        pageLink[0][0]=pageLink[0][0].replace(/^<|>$/gm,'');
                        var foundPage = /page=(\d+)$/.exec(pageLink[0][0]);
                        nextPage=foundPage[1];
                        if (nextPage == 1) {
                            nextPage = 0;
                        } else {
                            getPRFilesUrlPage=getPRFilesUrl+"&page="+nextPage;
                        }
                    } else {
                        nextPage = 0;
                    }
                }
            } else {
                xmlhttpErrorFlag=true;
                nextPage = 0
            }
        }
    };
    //debugger;
    var i = 1;
    xmlhttpErrorFlag=false;
    while(!xmlhttpErrorFlag){
        getPRUrl = "https://api.github.com/repos/"+ghRepoPath+"/pulls/"+i+"?access_token="+token;
        //getting PR info and parse it to arrayCommon.arrayPR 
        xmlhttp.open("GET", getPRUrl, false);
        xmlhttp.send();
        i+=1;
    }
    i = 1;
    xmlhttpErrorFlag=false;
    if (arrayCommon.arrayPR.length != 0){
        while(!xmlhttpErrorFlag){
            getPRFilesUrl = "https://api.github.com/repos/"+ghRepoPath+"/pulls/"+i+"/files"+"?access_token="+token;
            nextPage=1;
            getPRFilesUrlPage=getPRFilesUrl;            
            //getting File info for PR info and parse it to arrayCommon.arrayFiles
            // if there are several pages with file so go thru all pages.
            while (nextPage > 0){
                xmlhttp.open("GET", getPRFilesUrlPage, false);
                xmlhttp.send();
            }
            i+=1;
        }
        csvGeneration(reportPRTitle,arrayCommon,arrayPRLabels);
        csvGeneration(reportFilesTitle,arrayCommon,arrayFilePRFields);
    } else {
        alert("Report is blank. Please check correctness of Repo link and PR #");
        return;
    }
}
function csvGeneration(ReportTitle,arrayCommon,arrayLabels){
    "use strict";
    //debugger;
    //Generate a file name
    //this will remove the blank-spaces from the title and replace it with an underscore
    var fileName = ReportTitle.replace(/\s|\//g,"_");
    var csvContentArray = [];
    var array = [];
    //debugger;
    switch (arrayLabels) {
        case arrayPRLabels:
            array = arrayCommon.arrayPR;
            break;
        case arrayFilePRFields:
            array = arrayCommon.arrayFiles;
            break;
    }
    //debugger;
    array.forEach(function(infoArray, index){
        var dataString="";
        for (var j in arrayLabels){
            dataString += infoArray[arrayLabels[j]]+",";
        }
        dataString = dataString.slice(0, -1);
        csvContentArray.push(dataString);
    });

    var uri = 'data:text/csv;charset=utf-8,' +  encodeURI(ReportTitle + '\r\n\n' + arrayLabels+'\r\n'+csvContentArray.join("\r\n"));
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;
    //set the visibility hidden so it will not effect on your web-layout
    link.setAttribute('style', "visibility:hidden");
    link.download = fileName + ".csv"; 
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}