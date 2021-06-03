const { v4 : uuidV4 } = require('uuid')

class Band {

    constructor( name = 'void' ){
        this.id = uuidV4() //identificador unico
        this.name = name
        this.votes = 0
    }
}

module.exports = Band;