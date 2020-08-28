const xss = require('xss');

const CategoriesService = {
    getAllCategories(knex) {
        return knex
            .from('categories')
            .select('*')
            .orderBy('id');
    },
    getCategoryById(knex, id) {
        return knex
            .from('categories')
            .select('*')
            .where('id', id)
            .first();
    },
    serializeCategoryItem(item) {
        return {
            id: item.id,
            name: xss(item.name)
        };
    }
};

module.exports = CategoriesService