// встречается ли подстрока chunk в строке full
function isMatching(full, chunk) {
    if (full.toLowerCase().includes(chunk.toLowerCase())) {
        return true;
    }

    return false;    
}

// фильтрация
function searchAffect(which) {
    if (which === 'left') {
        let value = searchLeft.value;

        return notSelected.filter((friend) => {
            return isMatching(friend.first_name, value) || isMatching(friend.last_name, value); 
        })
    }
    if (which === 'right') {
        let value = searchRight.value;

        return selected.filter((friend) => {
            return isMatching(friend.first_name, value) || isMatching(friend.last_name, value); 
        })
    }
}

export {
    isMatching,
    searchAffect
}