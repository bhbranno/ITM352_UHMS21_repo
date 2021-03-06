function checkIt(item, index) {
    console.log(`part ${index} is ${(isNonNegInt(item)?'a':'not a')} quantity`);  
}

function isNonNegInt(q, returnErrors=false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}

pieces = 'Ben;52;52.25;-51.5;'.split(";");

//pieces.forEach(checkIt);

pieces.forEach((item,index) => {console.log(`part ${index} is ${(isNonNegInt(item)?'a':'not a')} quantity`);}); 