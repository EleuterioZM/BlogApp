if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: "mongodb+srv://eleuteriomabecuane5:eleuteriomabecuane5@blogapp.ynwjp.mongodb.net/?retryWrites=true&w=majority&appName=BlogApp"}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}


