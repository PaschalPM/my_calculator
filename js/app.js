class Calculator {
    /**
     * Run at instantiation of a new Calculator 
     */
    constructor() {
        this.setTitle("JS Calculator")
        this.setScreen1("")
        this.setScreen2("0")
        this.exitBtn(() => window.location.reload())
        this.pressedKey = null
        this.isOprKey = false
        this.lastRes = null
        this.keys = document.querySelectorAll(".btn")
        this.screenWidth = document.querySelector(".screen")
            .getBoundingClientRect().width
        this.entryNoScreen2 = 0
        this.keys.forEach((keyObj) => {
            keyObj.addEventListener("click", () => this.execute(keyObj))
        })
        const resizeObs = new ResizeObserver((entries) => {
            let screen1Width = entries[0].contentRect.width;
            if (screen1Width >= this.screenWidth - 10) {
                document.querySelector(".over_sym").classList.remove("display_none")
            } else {
                document.querySelector(".over_sym").classList.add("display_none")

            }
        })
        resizeObs.observe(this.screen1Div)
    }
    /**
     * Set the Title of the calculator
     *  
     * @param {string} v 
     */
    setTitle(v) {
        this.title = v
        document.getElementsByClassName("title")[0].innerText = v
    }
    /**
     * Sets the math expression that is displayed on
     * the first inner screen
     * 
     * @param {function|string} v 
     */
    setMathExpress(v) {
        if (typeof (v) == "function")
            this.mathExpress = v(this.mathExpress)
        else
            this.mathExpress = v
    }
    /**
     * Sets the math expression that is displayed on
     * the first inner screen
     * 
     * @param {function|string} v 
     */
    setScreen1(v) {
        if (typeof (v) == "function")
            this.screen1 = v(this.screen1)
        else
            this.screen1 = v
        this.screen1Div = document.querySelector(".screen_inner_1 .expr")
        this.screen1Div.innerText = this.screen1
    }
    /**
     * Sets the math expression that is displayed on
     * the second inner screen
     * 
     * @param {function|string} v 
     */
    setScreen2(v) {
        if (typeof (v) == "function")
            this.screen2 = v(this.screen2)
        else
            this.screen2 = v
        document.querySelector(".screen_inner_2").innerText = this.screen2
    }
    /**
     * Controls the exit button
     * 
     * @param {function} cb 
     */
    exitBtn(cb) {
        document.getElementsByClassName("exit")[0]
            .addEventListener("click", cb)
    }
    /**
     * Constraints for numeric keys from [1 to 9]
     */
    generalConstraint() {
        
            

        if (this.isOprKey) {
            this.setScreen2("")
            this.setMathExpress((v) => v + " ")
        }
        if (this.screen2 == "0") {
            this.setScreen2(this.pressedKey)
            this.setMathExpress(this.pressedKey)
        } else {
            this.setScreen2((v) => v + this.pressedKey)
            this.setMathExpress((v) => v + this.pressedKey)
        }
        this.entryNoScreen2++
        this.isOprKey = false
    }
    zeroConstraint() {
        if (this.screen2.match(/[1-9\.]+/)) {
            this.setMathExpress(v => v + this.pressedKey)
            this.setScreen2(v => v + this.pressedKey)
        }
    }
    pointConstraint() {
        if (this.screen2 == "0") {
            this.setMathExpress("0.")
            this.setScreen2("0.")
        } else if (!this.screen2.match(/\.[0-9]*$/)) {
            this.setMathExpress((v) => v + ".")
            this.setScreen2((v) => v + ".")
        }
    }
    /**
     * Prevents repetitive use of operators
     */
    operatorConstraint() {

        if (this.mathExpress && this.mathExpress.match(/[0-9]$/)) {
            this.setMathExpress((v) => v + " " + this.pressedKey)
            this.setScreen1(this.mathExpress)
        } else if (this.mathExpress && this.mathExpress.match(/[/*+-]$/)) {
            this.setMathExpress((v) => v.slice(0, -1) + this.pressedKey)
            this.setScreen1((v) => v.slice(0, -1) + this.pressedKey)
        }
        if (this.mathExpress && this.mathExpress.match(/[/*+-]/g).length > 1) {
            if (this.lastRes == null) {
                let expToResolve = this.mathExpress.slice(0, -1)

                this.lastRes = eval(expToResolve)
                this.lastRes = this.lastRes.toString().slice(0, 17)
                this.setScreen2(this.lastRes)
            } else {
                if (this.isOprKey) {
                    this.setMathExpress((v) => v.slice(0, -1) + this.pressedKey)
                    this.setScreen1((v) => v.slice(0, -1) + this.pressedKey)
                } else {
                    let pattern = /[/*+-]\s\d+/g
                    let matchLen = this.mathExpress.match(pattern).length
                    let res = eval(this.lastRes + this.mathExpress.match(pattern)[matchLen - 1])
                    res = res.toString().slice(0, 17)

                    this.setScreen2(res)
                    this.lastRes = res
                }
            }
        }
        this.isOprKey = true
        this.entryNoScreen2 = 0
    }

    backspaceConstraint() {
        if (this.entryNoScreen2) {
            this.setMathExpress((v) => v.slice(0, -1))
            this.setScreen2((v) => v.slice(0, -1))
            this.entryNoScreen2--
        }
        if (this.screen2 == "")
            this.setScreen2("0")
    }
    resetConstraint() {
        this.setMathExpress("")
        this.setScreen2("0")
        this.setScreen1("")
    }
    resetScreen2Constraint() {
        this.setMathExpress(v => v.replace(/[0-9]+$/, ""))
        this.setScreen2("0")
    }
    equalsToConstraint() {
        if (this.lastRes) {
            try {
                this.setScreen2(
                    eval(this.lastRes + this.mathExpress.match(/[/\*-+]\s\d+$/)[0])
                    .toString());
            } catch (e) {
                this.setScreen2("Err")
            }
        } else {
            try {
                this.setScreen2(
                    eval(this.mathExpress)
                    .toString());
            } catch (e) {
                this.setScreen2("Err")
            }
        }
    }
    /**
     * Main function - an entry point into the 
     * core of the calculator
     * 
     * @param {{ "data-key":string, "class":string }} keyObj 
     */
    execute(keyObj) {

        this.pressedKey = keyObj.dataset.key

        if (this.screen2.length >= 17 && this.pressedKey.match(/[0-9]/) && !this.isOprKey){
            let errorAlertTone = new Audio("../mixkit-wrong-long-buzzer-954.wav")
            errorAlertTone.play()
            return;
        }
        if (this.pressedKey == "c")
            this.resetConstraint()

        else if (this.pressedKey == "ce")
            this.resetScreen2Constraint()

        else if (this.pressedKey == "backspace")
            this.backspaceConstraint()

        else if (this.pressedKey.match(/^[1-9]$/))
            this.generalConstraint()

        else if (this.pressedKey == "0")
            this.zeroConstraint()

        else if (this.pressedKey == ".")
            this.pointConstraint()

        else if (this.pressedKey.match(/^[*+/-]$/))
            this.operatorConstraint()

        else if (this.pressedKey == "=") {
            this.equalsToConstraint()
        }
        this.pressedKey = null
        console.log(this.mathExpress);
    }
}

(new Calculator)