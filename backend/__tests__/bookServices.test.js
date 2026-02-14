// jest.mock('../models/bookModel')
// jest.mock('../services/openLibraryService')
// require('dotenv').config()
// const BookDBService = require('../services/bookDBService')
// const BookModel = require("../models/bookModel");
// const openLibraryService = require('../services/openLibraryService');
// const db = require('../database')

// describe('Book Service tests', () => {
//     let service;
//     let mockModel;
//     let mockAPI;

//     beforeAll(async () => {
//         mockModel = new BookModel(db);
//     })

//     beforeEach(async () => {
//         mockAPI = new openLibraryService()
//         service = new BookDBService(mockModel, mockAPI)
//         client = await db.pool.connect()
//         await client.query('BEGIN')
//     })

//     afterEach(async () => {
//         await client.query('ROLLBACK');
//         client.release();
//     })

//     afterAll(async () => {
//         await db.pool.end();
//     })

//     describe('searchAndPartialSaveBooks', () => {
//         test('should search api and save to db', async () => {
//             mockAPI.searchBooks = jest.fn().mockResolvedValue([
//                 {
//                     work_id: 'OL262463W',
//                     title: 'Memoirs of Sherlock Holmes [11 stories]',
//                     author: '{"Arthur Conan Doyle"}',
//                     descript: null,
//                     cover_url: 'https://covers.openlibrary.org/b/id/9246429-',
//                     cached_at: '2026-01 - 20T03: 36: 47.407Z',
//                     is_fully_added: false,
//                 }
//             ])
//             mockModel.findBookByWorkID = jest.fn().mockResolvedValue([])
//             mockModel.create = jest.fn().mockImplementation((book) =>
//                 Promise.resolve({ id: Math.random(), ...book }))

//             const result = await service.searchAndPartialSaveBooks('sherlock', 1);

//             // Verify
//             expect(mockAPI.searchBooks).toHaveBeenCalledWith('sherlock', 1);
//             expect(mockModel.findBookByWorkID).toHaveBeenCalledWith('OL262463W');
//             expect(mockModel.addPartial).toHaveBeenCalledTimes(1);
//             expect(result).toHaveLength(2);
//         })

//     })

// })