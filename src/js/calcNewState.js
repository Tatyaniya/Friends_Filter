import notSelected from '../index.js';
import selected from '../index.js';

// добавление/удаление элементов в массивы
function calcNewState(action, id) {
    if (action === 'add') {
        const result = notSelected.reduce((res, current) => {

            if (current.id == id) {
                res.selected.push(current);

                return res;
            }
            res.notSelected.push(current);

            return res;
        }, {
            notSelected: [],
            selected: []
        })
  
        notSelected = [...result.notSelected];
        selected = [...selected, ...result.selected];
    }

    if (action === 'remove') {
        const result = selected.reduce((res, current) => {

            if (current.id == id) {
                res.notSelected.push(current);

                return res;
            }
            res.selected.push(current);

            return res;
        }, {
            notSelected: [],
            selected: []
        })
  
        notSelected = [...notSelected, ...result.notSelected];
        selected = [...result.selected];
    }
}

export {
    calcNewState
}