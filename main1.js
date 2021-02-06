//Algorithm analysis-Dr.Ghanbari-Project 2 "Plagiarism detection"
//Without editdistance
var fs = require('fs');
let extraWords = ['the', 'and', 'or','a', 'of',         //extra words that should be removed from text
 'an','to','for','is','as','in','was','that','be',
 'he','she','it','they','been','his','her',
 ,'am','are','we','on','at','those',
 'by','any','than',
 ,'this','you','your','then','what','where','who','which'] 

let commonWordsObj={}  //common words between two texts
let sumCommonWords=0; //number of commmon word
function wordCountMap(str) { //counting each word
    strLowerCase=str.toLowerCase();
    let words = strLowerCase.split(/[.,\*+!?()' ']/) //spliting each strings with specified charecter and put each in the array
//words is the array of words 
    let notIncludedSpaceArray = words.filter((word) => {  //removing extra space from the vector
        return (Boolean(word) == false ? false : true)
    })
    
    notIncludedExtraWordsArray = notIncludedSpaceArray.filter((word) => { //remove extra words from array to obtain 
                                                                                                         //better performance
        let notNecessary = extraWords.indexOf(word)  //if a word found in extraWords array,it would be not neccessary                  
        return (notNecessary == -1 ? true : false)
    })

    let wordCount = {};   //word count object   

    notIncludedExtraWordsArray.forEach((w) => {           //count each word to see how many is itrated
        wordCount[w] = (wordCount[w] || 0) + 1
    });
    return wordCount;   //reterun object that contains number of words
}
function addWordsToDictionary(wordCountmap, dict) {     //this function initilizes the object contains all the words,with the value of true
    for (let key in wordCountmap) {
        dict[key] = true;          
    }
}
function wordMapToVector(wordCountObject, dict) { //mapping wordCount object to the words Vector,"zerro padding"
    let wordCountVector = [];
    for (let term in dict) {
        wordCountVector.push(wordCountObject[term] || 0);  //if the word from WordsDictionary is available in the wordCoundObject 
    }                                                //push its count to the the Vector,else push zero
    return wordCountVector;                   //this mechanism will be concluded the two vector with the same length
}
function dotProduct(vecA, vecB) {      //calulate the dot peoduct of the two vector
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}
function normOfVector(vec) {      //calculate the norm of vector
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}
function commonWords(wordCountObjectA,wordCountObjectB,dictionary){ //common words between two text
    let commonWord={}

    for (let term in dictionary) {
        if(wordCountObjectA[term] && wordCountObjectB[term]){
            sumCommonWords=sumCommonWords + 1;
            commonWord[term]={textA:wordCountObjectA[term] ,textB:wordCountObjectB[term]}
        }
    }
    return commonWord  
}
function showCommonWords(text1,text2){  //show common words
    console.log(`\n************ => Number of common words iterations in "${text1}" and "${text2}": \n`)
    for(key in commonWordsObj){
            console.log(`"${key}" in "${text1}", "${commonWordsObj[key].textA}" times and in "${text2}",  "${commonWordsObj[key].textB}" times is itrated \n`)
    }
}


function cosineSimilarity(vecA, vecB) {   //calculate the angle between two vector      
    return dotProduct(vecA, vecB) / (normOfVector(vecA) * normOfVector(vecB));
}

function textCosineSimilarity(txtA, txtB) {   //main function
    const wordCountA = wordCountMap(txtA);  //wordCountA is the object that contains the number of the each word is itrated in the textA
    const wordCountB = wordCountMap(txtB);  //wordCountB is the object that contains the number of the each word is itrated in the textB
    let dict = {};
    addWordsToDictionary(wordCountA, dict);  //add each words from the words object into one dictionary object (dict)
    addWordsToDictionary(wordCountB, dict);   
    const vectorA = wordMapToVector(wordCountA, dict); //maping each word from the word object A to that wordsVector 
    const vectorB = wordMapToVector(wordCountB, dict); //maping each word from the word object B to that wordsVector 
    commonWordsObj=commonWords(wordCountA,wordCountB,dict)
    return cosineSimilarity(vectorA, vectorB);         //calculting similarity
}

function getSimilarityScore(val) {
    return Math.round(val * 100)
}

//Input: Reading text files
try {
    /*******************************************************************************************/
    var fileName1='t1_original1'   //*********change the file name here************************
    var fileName2='t1_original2'
    /******************************************************************************************** */
    console.log(`\n \n **** => Comparing "${fileName1}" with "${fileName2}"`)    
    var text1 = fs.readFileSync(`${fileName1}.txt`, 'utf8');
    var text2 = fs.readFileSync(`${fileName2}.txt`, 'utf8');
     text1=text1.toString();
     text2=text2.toString();
} catch(e) {
    console.log('Error:', e.stack);
}


const similarity = getSimilarityScore(textCosineSimilarity(text1, text2)); //getting similarity score

//******output******
console.log(`\n********  => similarity percentage: ${similarity}% *********\n`) 
if(similarity >= 75){
    console.log('**************************Plagiarism detected************************** \n')
    console.log(`\t *Number of common words ${sumCommonWords}`)
    //showCommonWords(fileName1,fileName2)
}
else if(similarity > 55 && similarity < 75) {
console.log('**************************ُToo much similarity found************************** \n')
console.log(`\t \t \t "Number of common words ${sumCommonWords}" `)
//showCommonWords(fileName1,fileName2)

}
else if(similarity >= 25 && similarity <= 55){
    console.log('*************************** Low similarity found ************************** \n')
    console.log(`\t \t \t "Number of common words ${sumCommonWords}" `)
    //showCommonWords(fileName1,fileName2)
    
}
else{
    console.log('************************** No Plagiarism detected ************************** \n')
    console.log(`\t \t \t "Number of common words ${sumCommonWords}" `)
    showCommonWords(fileName1,fileName2)
}

console.log('******************************************************************************* \n \n')