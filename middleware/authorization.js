const { StatusCodes } = require("http-status-codes")

const authorization = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            res.status(StatusCodes.UNAUTHORIZED).json({
                errorMsg : "You are not Authorized to access this route."
            })
        }
        next()
    }
}

/* AUTHORIZATION ALTERNATE FUNCTION
const authorization = (req,res,next) =>{
    if(!req.user.role === 'admin'){
        res.status(StatusCodes.UNAUTHORIZED).json({
                errorMsg : "You are not Authorized to access this route."
            })
    }
}
*/

// NOTE --> TRY TOI UNDERSTAND THIS -->

//          --> HERE, IN MAIN AUTHORIZATION FUNCTION WE GAVE DEFINED (...roles)
//          --> THAT TAKES ENDLESS VALUES AS IN LIST,
//          --> SO WHAT WE ARE DOING HERE, IS THINKING FOR FUTURE
//          --> THERE MIGHT BE CHANCES THAT THERE ARE MANY ROLES LIKE ADMIN, USER, OWNER AND MANY MANY MORE
//          --> SO NOW FOR THEM WE AIN'T GONE MAKE R=SEPERATE COND.

//          --> SO THIS IS GENERAL LOGIC THAT IF USER'S ROLE IS INSIDE THAT LIST OF AUTHORIZED ROLES THEN
//          --> OK GOOD TO GO ELSE ISSUE


module.exports = authorization