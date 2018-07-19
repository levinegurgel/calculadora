class CalcController{

    constructor(){

        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcE1 = document.querySelector("#display");
        this._dateE1 = document.querySelector("#data");
        this._timeE1 = document.querySelector("#hora");
        this._currentDate;
        this._audioOn = false;
        this._audio = new Audio('click.mp3');
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    initialize(){

        this.displayCalc;

        this.setDisplayDateTime();

        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach( btn => {

            btn.addEventListener('dblclick', e =>{
                console.log(this._audioOn);
                this.toggleAudio();
            });
        });
    }

    toggleAudio(){

        this._audioOn = !this._audioOn;
        
    }

    playAudio(){
        
        if(this._audioOn){

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy');

        input.remove();
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e =>{
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);
        });
    }

    initKeyboard(){
        document.addEventListener('keyup', e =>{

            this.playAudio();

            switch(e.key){

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                this.clearEntry();
                    break;
    
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case 'Enter':
                case '=':
                        this.calc();
                        break;    

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });

    }

    clearAll(){

        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";

        this.setLastNumberToDisplay();

    }

    clearEntry(){

        this._operation.pop();

        this.setLastNumberToDisplay();

    }

    getLastOperation(){

        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value){

        this._operation[this._operation.length -1] = value;

    }

    isOperator(value){

        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);

    }

    pushOperation(value){
        
        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();

            console.log(this._operation);

        }
        
    }

    getResult()
    {
        try {
            return eval(this._operation.join(""));    
        } catch (error) {
            
            setTimeout(() => {
                this.setError();    
            }, 0);
            
        }
        
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            if(this.getLastOperation() == '040808') return this.displayCalc = 'Rosinha';

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];


        }
        
        if(this._operation.length > 3){
            
            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }

        if(this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if(last == '%'){

            result /= 100;

            this._operation = [result];    

        }else{

            this._operation = [result];

            if(last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        
        let lastItem;

        for(let i = this._operation.length -1; i >= 0; i --){

            if(this.isOperator(this._operation[i]) == isOperator){

                lastItem = this._operation[i];

                break;

            }

        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    }

    setLastNumberToDisplay(){

        let LastNumber = this.getLastItem(false);
        for(let i = this._operation.length -1; i >= 0; i --){

        if(!this.isOperator(this._operation[i])){

            LastNumber = this._operation[i];

            break;

        }
    }
        if(!LastNumber) LastNumber = 0;
        
        this.displayCalc = LastNumber;
    }


    addOperation(value){

        // console.log('A', value, isNaN(this.getLastOperation()), this._operation);

        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){

                this.setLastOperation(value);

            }else{

                // this._operation.push(value);
                this.pushOperation(value);
                this.setLastNumberToDisplay();
                
            }

        }else{

            if(this.isOperator(value)){

                this.pushOperation(value);

            }else{

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }

        }

    }

    setError(){

        this.displayCalc = "Error";

    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    execBtn(value){
        
        this.playAudio();
        
        switch(value){
            case 'ac':
                this.clearAll();
                break;

            case 'ce':
            this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;    

            case 'divisao':
                this.addOperation('/');
                break;    

            case 'porcento':
                this.addOperation('%');
                break;    

            case 'ponto':
                this.addDot('.');
                break;

            case 'igual':
                this.calc();
                break;    

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
        }

    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) =>{
           
            this.addEventListenerAll(btn, "click drag", e =>{
                let text = btn.className.baseVal.replace("btn-","");
                this.execBtn(text);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            });
        });

    }

    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    get currentDate(){

        return new Date();

    }

    set currentDate(value){

        this._currentDate = value;

    }

    get displayTime(){

        return this._timeE1.innerHTML;

    }

    set displayTime(value){

        this._timeE1.innerHTML = value;

    }

    get displayDate(){

        return this._dateE1.innerHTML;

    }

    set displayDate(value){

        this._dateE1.innerHTML = value;

    }
    
    get displayCalc(){

        return this._displayCalcE1.innerHTML;

    }

    set displayCalc(value){

        if(value.length > 10 || value.toString().length > 10){

            this.setError();
            return false;
        }
        
        this._displayCalcE1.innerHTML = value;

    }

}