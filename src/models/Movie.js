const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  img: {
    type: String
  }
});

module.exports = mongoose.model("Movie", movieSchema);

/*

class Product {

    constructor() {
        this.name = "";
        this.price = 1;
        this.description = "Produto Genérico";
        this.img = "PRODUTO SEM IMAGEM";
    }

    async salvar(){
        let query = `INSERT INTO products (name, price, description, img) VALUES ('${this.name}', '${this.price}', '${this.description}', '${this.img}');`;
        let result = await db.execute(query);
        return result;
    }

    static getAll(funcaoParaExecutar){
        db.execute("SELECT * FROM products")
        .then(resultado => {
            funcaoParaExecutar(resultado[0]);
        })
        .catch(erro => {
            console.log("ERRO AO CONECTAR COM A TABELA. ERRO: " + erro);
        })

    }

    static excluir(id) {
        return db.execute("DELETE FROM products WHERE id = " +  id);
       
    }

    static getById(id){

        return new Promise(
            (resolve, reject) => {
                db.execute("SELECT * FROM products where id = " + id)
                .then(resultado => {
                    //console.log("Retornei da consulta: " + JSON.stringify(resultado[0]))
                    resolve(resultado[0]);
                })
            }
        )
    } */

/*static getAll() {

        let conteudoArquivo = fs.readFileSync(
            path.join(__dirname, '..', 'data', 'prods.json')
        );
    
        return JSON.parse(conteudoArquivo); 

    }


    static getProductByName(nomeBusca) {

        let todosProdutos = Product.getAll();

        for (let i = 0; i < todosProdutos.length; i++) {
            if (todosProdutos[i].name == nomeBusca) {
                return todosProdutos[i];
            }
        }
    }


}

module.exports = Product; */
