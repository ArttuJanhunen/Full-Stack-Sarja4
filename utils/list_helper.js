const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likemap = blogs.map(blog => blog.likes)

    const reducer = (sum, likes) => {
        return sum + likes
    }

    return likemap.reduce(reducer, 0)

}

const favoriteBlog = (blogs) => {
    let favorite = blogs[0]
    for (i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > favorite.likes) {
            favorite = blogs[i]
        }
    }

    return favorite
}

const mostBlogs = (blogs) => {
    
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}