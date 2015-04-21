CodeAnalyzer = function(){
    var self = {};

    var _functions = {};

    var _trace = [];

    var _currentFunction = null;

    var _stack = [];

    var _availableBasePositions = [[10,-14],[8,-5],[0,0]];

    var getCurrentStack = function () {
        return _stack[_stack.length-1];
    };

    var getCurrentShift = function () {
        return getCurrentStack().shiftStack[getCurrentStack().shiftStack.length-1];
    };

    self.startFunction = function (name) {
        var currentDepth = 0;
        if(_stack.length > 0){
            currentDepth = getCurrentStack().depth;
        }

        if(_functions.hasOwnProperty(name)){
            _functions[name].depth++;
            currentDepth++;
        } else {
            _functions[name] = {name: name, depth: 0, steps : {}, basePosition:_availableBasePositions.pop()};
        }

        _stack.push({shiftStack:[0],
            basePosition: _functions[name].basePosition,
            position:{line:0, shift:0},
            depth: currentDepth,
            function: _functions[name]});


        _trace.push({type:'call', functionName:name, function:_functions[name], depth: currentDepth});

        _currentFunction = _functions[name];
    };

    self.endFunction = function (name) {
        _stack.pop();
        _functions[name].depth--;
        if(_stack.length > 0){
            _currentFunction = _stack[_stack.length-1].function ;

            _trace.push({type:'return',functionName:name, depth: getCurrentStack().depth,
                basePosition: getCurrentStack().basePosition, position: getCurrentStack().position});
        } else {
            _trace.push({type:'end'});
        }


    };

    self.branch = function (current, total, nested) {
        //_trace.push({type:'branch',current:current,total:total, nested:nested});

        var shift = Math.floor(current - (total/2));
        if(shift>=0){
            shift++;
        }
        var sumShift = getCurrentShift() + shift * (nested+1);

        getCurrentStack().shiftStack.push(sumShift);
    };

    self.closeBranch = function () {
        getCurrentStack().shiftStack.pop();
    };


    self.loop = function (current, total, nested) {
        _trace.push({type:'branch',current:current,total:total, nested:nested});
    };

    self.step = function(id) {
        console.log(_currentFunction.name + " " + getCurrentShift() + ' .... ' + id);
        var step = null;
        if(_currentFunction.steps.hasOwnProperty(id)){
            step = _currentFunction.steps[id];
        } else {
            step = {line:id, shift: getCurrentShift()};
            _currentFunction.steps[id] = step;
        }

        _trace.push({type:'step', position: step, depth: getCurrentStack().depth});
        getCurrentStack().position = step;
    };




    var assignPositionToFunction = function(f) {
        if(!f.pos){
            f.pos = [0,0];
        }
    };

    self.generate = function() {
        var commands = [];
        var currentFunction = _trace[0].function;
        var currentLine = 0;
        var currentShift = 0;
        var currentLevel = 0;
        var basePosition = _trace[0].function.basePosition;
        assignPositionToFunction(currentFunction);

        for (var i = 1; i < _trace.length; i++) {
            var t = _trace[i];

            if(t.type == 'step'){

                if(currentLine >= t.position.line){
                    //loop
                    commands.push( {type: 'link', linkType:'jump'});

                } else {
                    var points = [];

                    if(currentShift == t.position.shift){
                        points = [[currentLine + basePosition[0],currentShift  + basePosition[1]],
                                [t.position.line  + basePosition[0], t.position.shift  + basePosition[1]]];
                    } else {
                        points = [[currentLine  + basePosition[0],currentShift  + basePosition[1]],
                            [currentLine  + basePosition[0], t.position.shift  + basePosition[1]],
                            [t.position.line  + basePosition[0], t.position.shift  + basePosition[1]]];
                    }

                    commands.push( {type: 'code', y: currentLevel*0.3, points: points});
                }

                currentLine = t.position.line;
                currentShift = t.position.shift;


            } else if(t.type == 'call'){
                currentLevel = t.depth;
                basePosition = t.function.basePosition;
                currentLine = 0;
                currentShift = 0;
                commands.push( {type: 'link', linkType:'call'});
            } else if(t.type == 'return'){
                currentLevel = t.depth;
                basePosition = t.basePosition;
                currentLine = t.position.line;
                currentShift = t.position.shift;
                commands.push( {type: 'link', linkType:'call'});
            }

        }


        return commands;
    };





    var init = function(){

    }();

    return self;
};