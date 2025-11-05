//asyncHandler is the one who catches problems and forwards them.


const asyncHandler = (requestHandler) => {
    return(req , res , next) => {
        Promise
        .resolve(requestHandler(req, res ,next))
        .catch((err) => next(err))
    }
}

export {asyncHandler}