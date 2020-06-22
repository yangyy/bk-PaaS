const Base = require('./base')
const { Entity, Column } = require('typeorm')

@Entity()
class Test extends Base {
    @Column({ type: 'varchar' })
    projectName

    @Column({ type: 'varchar' })
    projectEnglish
}

module.exports = Test