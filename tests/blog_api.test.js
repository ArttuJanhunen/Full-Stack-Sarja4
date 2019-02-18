const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)


})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect
})

test('right amount of blogs is returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length)
})

test('id is defined', async () => {
    const response = await Blog.find({})
    const blogs = response.map(blog => blog.toJSON())
    blogs.forEach((blog) => {
        expect(blog.id).toBeDefined()
    })
})

test('a new blog can be added', async () => {
    const newBlog = {
        title: "Testiblogi",
        author: "Testikirjoittaja",
        url: "testiurl",
        likes: "12"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('Testiblogi')
})

test('if likes is left empty, it is valued as zero', async () => {
    const newBlog = {
        title: "Testiblogi",
        author: "Testikirjoittaja",
        url: "testiurl"

    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const likes = response.body.map(blog => blog.likes)
    expect(likes[likes.length - 1]).toBe(0)

})

test('bad request when title is not defined', async () => {
    const newBlog = {
        author: "Testikirjoittaja",
        url: "testiurl",
        likes: "12"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('bad request when url is not defined', async () => {
    const newBlog = {
        title: "Testiblogi",
        author: "Testikirjoittaja",
        likes: "12"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('delete a blogpost', async () => {
    const newBlog = {
        title: "Testiblogi",
        author: "Testikirjoittaja",
        url: "testiurl",
        likes: "12"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length + 1)

    const deleteId = response.body[response.body.length - 1].id

    await api
        .delete(`/api/blogs/${deleteId}`)
        .expect(204)

    const response2 = await api.get('/api/blogs')
    expect(response2.body.length).toBe(initialBlogs.length)

})

/*test('update likes to last blog', async () => {
    const response = await api.get('/api/blogs')
    const toUpdate = response.body[response.body.length - 1]
    console.log('YYYY', toUpdate)

    const updatedBlog = {
        title: toUpdate.title,
        author: toUpdate.author,
        url: toUpdate.url,
        likes: toUpdate.likes + 2
    }

    console.log('RRRR', updatedBlog)

    await api
        .put(`/api/blogs/${toUpdate.id}`)
        .send(updatedBlog)
        .expect(202)

    const response2 = await api.get('/api/blogs')

    console.log('AAAA', response2)

    expect(response2[response2.length - 1].likes).toBe(4)
})*/

afterAll(() => {
    mongoose.connection.close()
})