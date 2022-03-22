class Calculator{
    constructor(){
        this.expression = ""
        this.number = ""
        this.innerScreen1 = document.querySelector(".screen_inner_1")     
        this.innerScreen2 = document.querySelector(".screen_inner_2") 
        this.piledOperators = ""    
        this.ansFromSQRT = 0
    }
    pileUpOperators(opr){
        this.piledOperators += opr
    }
    getNumber(no){
        this.number += no
        if(this.number.length > 13)
        {
            this.innerScreen2.style.fontSize = "200%"
        }
        else{
            this.innerScreen2.style.fontSize = "250%"
        }
        if(this.number.length >= 16)
        {
            this.getNumber("")
        }
    }
    getExpression(exp){
        this.expression += exp
    }
    parseOperator(opr){
        if(opr == "x") opr="*"
        this.expression += " "+opr+" "
        
    }
    updateInnerScreen1(){
        this.innerScreen1.textContent = this.expression
        this.number = ""
    }
    updateInnerScreen2(){
        this.innerScreen2.textContent = this.number
    }
    backspace(){
        
        this.expression = this.expression.replace(/[0-9]{1}$/,"")
        this.number = this.number.replace(/[0-9]{1}$/,"")
       
        if(this.number == "") this.innerScreen2.textContent = 0
        else this.innerScreen2.textContent = this.number
        console.log(this.expression);
    }
    clearEntry(){
        this.innerScreen2.textContent = 0
        this.expression = this.expression.replace(/[0-9]*$/,"")
        this.number  = ""
    }
    clear(){
       this.innerScreen1.textContent = "" 
       this.innerScreen2.textContent = 0
       this.number = ""
       this.expression = ""
    }
    sqrtFunc(){
        
        
        if(this.expression == "")
        {
            this.innerScreen2.textContent = 0
            this.innerScreen1.textContent = "sqrt(0)"
        }
        else
        {
            try{
                this.ansFromSQRT = eval(this.expression)
                this.ansFromSQRT = Math.sqrt(this.ansFromSQRT) 
                this.innerScreen2.textContent = this.ansFromSQRT
                this.ansFromSQRT = this.ansFromSQRT.toString()
                this.innerScreen1.textContent = "sqrt("+this.ansFromSQRT+")"
                this.expression = this.ansFromSQRT
            }
            catch(e){
                this.innerScreen2.textContent = "err"
            }
        }
    }
    evalExpression()
    {
        try{
            this.innerScreen2.innerHTML = eval(this.expression)
        }
        catch(e)
        {
            this.innerScreen2.innerHTML = "err"
        }
       
    }
}

let cal = new Calculator()


    let btn = document.querySelectorAll(".btn")
    let backspaceBtn = document.querySelector(".backspace")
    let sqrtBtn = document.querySelector(".sqrt")

    let numberBtn = document.querySelectorAll(".number_btn")
    let mathOperatorBtn = document.querySelectorAll(".math_operator")
    let equalsBtn = document.querySelector(".equals_btn")


btn.forEach((v,i,a)=>{
    v.addEventListener("click",function(e){
        let value = this.textContent.trim()
        switch(value){
            case "C":
                cal.clear()
                break;
            case "CE":
                cal.clearEntry()
                break;
        }
    })
})

backspaceBtn.addEventListener("click",function(e){
    cal.backspace()
})

sqrtBtn.addEventListener("click",function(e){
    cal.sqrtFunc()
})

numberBtn.forEach((v,i,a)=>{
    v.addEventListener("click",function(e){
        let number = this.textContent.trim()
        cal.getExpression(number)
        cal.getNumber(number)
        console.log(cal.expression);
        cal.updateInnerScreen2()
    })
})

mathOperatorBtn.forEach((v,i,a)=>{
    v.addEventListener("click",function(e){
        let mathOperator = this.textContent.trim()
        cal.pileUpOperators(mathOperator)
        if(cal.piledOperators.length >= 2) cal.evalExpression()
        cal.parseOperator(mathOperator)
        cal.updateInnerScreen1()
        console.log(cal.expression);

    })
})

equalsBtn.addEventListener("click",function(e){
    cal.piledOperators = ""
    cal.updateInnerScreen1()
    cal.evalExpression()
})
