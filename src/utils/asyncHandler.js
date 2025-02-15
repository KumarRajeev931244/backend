const asyncHandler = (requestHandler) => {
     return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((error) => {
            next(error)
        })
    }

}

export default asyncHandler


// HOF
// const asyncHandler = () => {}
// const asyncHandler = (func) => { () => {} }
    // const asyncHandler = () => async() => {}





                        // second method
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
            // await function(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
        
//     }
// }