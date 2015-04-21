var __ = CodeAnalyzer();

function foo1(a) {
    __.startFunction('foo1');

    __.step(1);



    for (var i = 0; i < 4; i++) {

        __.step(2);
        __.step(3);

        if(a % 2 == 0 ){     __.branch(0,1,1);

            __.step(4);

            if(i == 0){     __.branch(0,1,0);
                __.step(5);
            } else {        __.branch(1,1,0);
                __.step(6);
            }
            __.closeBranch();

        } else {            __.branch(1,1,1);

            __.step(7);

            if(i == 1){     __.branch(0,1,0);
                __.step(8);
                foo2(a)

            } else {        __.branch(1,1,0);
                __.step(9);
            }
            __.closeBranch();
            __.step(10);
        }

        __.closeBranch();

        __.step(11);


    }

    if(a<5)
        foo1(a+1);


    __.endFunction('foo1');
}

function foo2(b){
    __.startFunction('foo2');
    __.step(1);
    __.step(2);


    for (var i = 0; i < 4; i++) {
        __.step(4);
        if(b % 2 == 0){  __.branch(0,1,0);
            __.step(5);
        }           __.closeBranch();
        __.step(6);
    }

    __.endFunction('foo2');
}


function fact(x) {
    __.startFunction('fact');
    __.step(1);

    if(x==0) {
        __.branch(0,1,0);
        __.step(2);
        __.closeBranch();
        return 1;
    }


    __.step(3);
    var value = x * fact(x-1);

    __.startFunction('fact');
    return value;
}


function swap(items, firstIndex, secondIndex){
    __.startFunction('swap');

    for (var i = 0; i < 2; i++) {

        __.step(1);
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
        __.step(3);

    }

    __.endFunction('swap');
}


function partition(items, left, right) {
    __.startFunction('partition');

    var pivot   = items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;
    __.step(1);


    while (i <= j) {
        __.step(2);
        __.step(3);

        while (items[i] < pivot) {
            i++;
            __.step(4);
            __.step(5);
        }

        while (items[j] > pivot) {
            j--;
            __.step(6);
            __.step(7);
        }

        if (i <= j) {
            __.branch(0,1,0);
            __.step(8);
            swap(items, i, j);
            __.step(9);
            i++;
            j--;
            __.closeBranch();
        }
    }

    __.endFunction('partition');
    return i;
}



function quickSort(items, left, right) {
    __.startFunction('quick');

    __.step(1);
    var index;

    if (items.length > 1) {
        __.branch(0,1,1);

        __.step(2);
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;

        index = partition(items, left, right);

        __.step(4);

        if (left < index - 1) {
            __.branch(0,1,0);
            quickSort(items, left, index - 1);
            __.step(5);
            __.closeBranch();
        }

        if (index < right) {
            __.branch(0,1,0);
            quickSort(items, index, right);
            __.step(6);
            __.closeBranch();
        }

        __.closeBranch();
    }

    __.step(7);

    __.endFunction('quick');
    return items;
}


//
//foo1();
//console.log(JSON.stringify(__.generate()));

