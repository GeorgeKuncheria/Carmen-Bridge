//- this is the middleware that will be loaded before the user logs in
//- from the log in page, incase he doesn't have an account to get into
//- sign in page. This part of the page loads before the 'app.get' from 
//- app.js executes its function

//- the advantage of creating an extra file like this is to simply pass in this middleware 
//- variable to any place where the user isn't supposed to be accessing without being logged in.
exports.requireLogin = (req, res, next) => {
    // once the session variable is set we also check for user variable
    //- is user vairiable is also true that means the user has logged in,
    //- which if they haven't it'll redirect them to the '/login' page
    //- if they are logged in, it will redirect them to the 'home' page from
    //- 'app.get' function form the 'app.js' file
    if (req.session && req.session.user) {
        return next();
    }
    else {
        return res.redirect('/login');
    }
}