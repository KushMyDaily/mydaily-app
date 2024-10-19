'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert(
            'score_mappings',
            [
                {
                    id: 1,
                    scoreRange: `[[0,2],[2,4],[4,6],[6,8],[8,10],[10,Infinity]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    scoreRange: `[[0,11],[11,21],[21,31],[31,41],[41,51],[51,Infinity]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    scoreRange: `[[0,21],[21,41],[41,61],[61,81],[81,101],[101,Infinity],]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    scoreRange: `[[0,11],[11,21],[21,31],[31,41],[41,51],[51,Infinity]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    scoreRange: `[[0,6],[6,11],[11,16],[16,21],[21,26],[26,Infinity]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    scoreRange: `[[15,Infinity],[12,14],[9,11],[5,8],[2,4],[0,1],]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 6,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 7,
                    scoreRange: `[[5,Infinity],[4,4],[3,3],[2,2],[1,1],[0,0]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 7,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 8,
                    scoreRange: `[[30,Infinity],[25,29],[20,24],[15,19],[10,14],[0,9]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 8,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 9,
                    scoreRange: `[[0,0],[1,2],[3,4],[5,6],[7,8],[9,Infinity]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 9,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 10,
                    scoreRange: `[[0,0],[1,2],[3,4],[5,6],[7,8],[9,Infinity]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 11,
                    scoreRange: `[[0,10],[11,20],[21,30],[31,40],[41,50],[51,Infinity]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 11,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 12,
                    scoreRange: `[[15,Infinity],[12,14],[9,11],[6,8],[3,5],[0,2]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 12,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 13,
                    scoreRange: `[[26,Infinity],[21,25],[16,20],[11,15],[6,10],[0,2]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 13,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 14,
                    scoreRange: `[[10,Infinity],[8,9],[6,7],[4,5],[2,3],[0,1]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 14,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 15,
                    scoreRange: `[[9,10],[7,8],[5,6],[3,4],[1,2],[0,0]]`,
                    score: `[10,8,6,4,2,0]`,
                    dataPointId: 15,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('score_mappings', null, {})
    },
}
