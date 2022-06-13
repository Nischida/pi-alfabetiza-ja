if(process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "mongodb+srv://alfabetiza_ja:UqfXXtMnPbQUAY5d@alfabetizaja.rrpb3.mongodb.net/?retryWrites=true&w=majority"}
} else {
    module.exports = { mongoURI:  "mongodb://localhost/alfabetiza_ja"}
}