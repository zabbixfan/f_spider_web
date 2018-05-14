const Host = process.env.API_HOST

export default {
    requestLogin: Host + '/login/',
    getUserByToken: Host + '/userinfo/',
    jobs: Host + '/jobs/',
    job: (jobId) => Host + '/job/' + jobId,
    users: Host + '/users/',
    user: (userId) => Host + '/user/' + userId,
    categoryTree: Host + '/categorytree/',
    category: (categoryrId) => Host + '/category/' + categoryrId,
    categories: Host + '/categories/',
    getArticleList: Host + '/article/',
    getArticleDetail: (articleId) => Host + '/article/' + articleId,
    getSearchList: Host + '/search/',
    getSearchDetail: (searchId) => Host + '/search/' + searchId,
    CheckArticle: (articleId) => Host + '/check_article/' + articleId,
    getUserDetail: (userId) => Host + '/user/' + userId,
    getCategoryDetail: (categoryId) => Host + '/category/' + categoryId,
    getCategoryTree: Host + '/categorytree/',
    logs: Host + '/logs/',
    getPreviousArticleById: (articleId) => Host + '/previousarticle/' + articleId,
    deleteFile: Host + '/delete_file/'
}
