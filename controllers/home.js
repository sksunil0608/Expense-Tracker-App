const path = require('path')

exports.getIndexView = (req,res)=>{
    return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
}
exports.getAboutView = (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'public', 'about.html'));
}
exports.getContactView = (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
}
