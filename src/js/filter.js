
function isMatching(full, chunk) {
    if (full.toLowerCase().includes(chunk.toLowerCase())) {
        return true;
    }

    return false;    
}

function filter() {

}

export {
    isMatching
}