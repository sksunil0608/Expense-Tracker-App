const path = require('path')

exports.viewIndex = (req,res)=>{
    return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
}
exports.viewAbout = (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'public', 'about.html'));
}
exports.viewContact = (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
}
