const searchLeft = document.getElementById('search-left');
const searchRight = document.getElementById('search-right');

function isMatching(full, chunk) {
    if (full.toLowerCase().includes(chunk.toLowerCase())) {
        return true;
    }

    return false;    
}

function filter() {

}

export {
    filter
}