const User = require('./model')
const db = require('../../data/dbconfig')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async () => {
    await db('user').truncate()
})
afterAll(async () => {
    await db.destroy()
})

describe('user', () => {
    test('sanity check', () => {
        expect(User).toBeDefined()
    })
    test('Test enviroment', () => {
        expect(process.env.DB_ENV).toBe('testing')
    })
})
describe('getAll()', () => {
    it('resolve to a list of user', async () => {
        let user = await User.getAll()
        expect(user).toHaveLength(0)
        await db('user').insert({ name: 'sam' })
        user = await User.getAll()
        expect(user).toHaveLength(1)
        await db('user').insert({ name: 'sussan' })
        user = await User.getAll()
        expect(user).toHaveLength(2)
    })
    it('return the right information', async () => {
        await db('user').insert({ name: 'sam' })
        let user = await db('user')
        expect(user).toHaveLength(1)
        expect(user[0]).toMatchObject({ name: "sam" })
    })
})
describe('insert()', () => {
    it('add new user', async () => {
        await User.insert({ name: 'sam' })
        const user = await User.getAll()
        expect(user).toHaveLength(1)
        expect(user[0]).toMatchObject({ name: 'sam' })
    })
    it('have the correct id', async ()=>{
        const result = await User.insert({ name: "sam" })
        expect(result).toMatchObject({ id: 1, name: 'sam' })
    })
})
describe('delete()', () => {
    it('delete a user', async () => {
        await User.insert({ name: 'sam' })
        let user = await User.getAll()
        expect(user).toHaveLength(1)
        expect(user[0]).toMatchObject({ name: 'sam' })
        await User.remove(1)
        user = await User.getAll()
        expect(user).toHaveLength(0)
    })
    it('return the correct amount of deleted user', async()=>{
        await User.insert({ name: 'sam' })
        let user = await User.getAll()
        expect(user).toHaveLength(1)
        expect(user[0]).toMatchObject({ name: 'sam' })
        const amount = await User.remove(1)
        expect(amount).toBe(1)
    })
})