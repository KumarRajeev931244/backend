const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {next(error)})
    }

}

export {asyncHandler}


// HOF
// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
    // const asyncHandler = () => async() => {}





                        // second method
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
        
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
        
//     }
// }