class ApiError extends Error{
    constructor(statusCode, message = "something went wrong", errors = [], stack = ""){
        super(message)      //this will overwrite the message
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false   //it indicate that the operation that resulted in this error was not successful.
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
           Error.captureStackTrace(this, this.constructor)
        }


    }
}

export {ApiError}