const mongoose = require('mongoose'); // IMPORTAÇÃO OBRIGATÓRIA
const Schema = mongoose.Schema;

const PostagemSchema = new Schema({
    titulo: { type: String, required: true },
    slug: { type: String, required: true },
    descricao: { type: String, required: true },
    conteudo: { type: String, required: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'categorias', required: true },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('postagens', PostagemSchema); // Certifica-te que este é o nome correto
