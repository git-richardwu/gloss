// const db = require('../db/database')
// const OpenLibraryService = require('./openLibraryService');
// const BookModel = require('../models/bookModel');
// const BookDBService = require('./bookDBService');
// const GlossaryDBService = require('./glossaryDBService');
// const GlossaryModel = require('../models/glossaryModel')
// const BookController = require('../controllers/bookController')

// const openLibraryService = new OpenLibraryService()
// const bookModel = new BookModel(db)
// const glossModel = new GlossaryModel(db)
// const bookService = new BookDBService(bookModel, openLibraryService)

// const glossaryDBService = new GlossaryDBService(glossModel)

// async function bookServiceTests() {
//     console.log('Running searchOpenLibraryAndSave Test 🏮');

//     console.log('Test: Book already exists in database 🏮');
//     const alreadyExists = await bookService.searchOpenLibraryAndSave('Zombies Vs. Unicorns', 1)
//     console.log(alreadyExists)

//     console.log('Test: No query provided 🏮');
//     const noQuery = await bookService.searchOpenLibraryAndSave('', 1)
//     console.log(noQuery)

//     console.log('Test: No search results in OpenLibrary 🏮');
//     const noBook = await bookService.searchOpenLibraryAndSave('asdfghjkl', 2)
//     console.log(noBook)

//     console.log('Test: Fetch from both database and openlibrary 🏮');
//     const bothOLandDB = await bookService.searchOpenLibraryAndSave('The Name of the Wind', 1)
//     console.log(bothOLandDB)

//     console.log('Test: Fetch book details from database 🏮');
//     const loadDescription = await bookService.getOrFetchDescription("OL22427505W") //already in database
//     console.log(loadDescription)

//     console.log('Test: No work id provided 🏮');
//     const missingWorkID = await bookService.getOrFetchDescription("")
//     console.log(missingWorkID)

//     console.log('Test: Book not found in database 🏮');
//     const bookNotFound = await bookService.getOrFetchDescription("OL2")
//     console.log(bookNotFound)

//     console.log('Test: Get book description from OpenLibrary 🏮');
//     const updateDescriptionFromOL = await bookService.getOrFetchDescription("OL81632W")
//     console.log(updateDescriptionFromOL)
// }

// async function glossaryServiceTests() {
//     console.log('Running fetchCommunityGlossaryByID Test 🏮');
//     console.log('Test: Get glossary by ID 🏮');
//     const getGlossary = await glossaryDBService.getOrCreateGlossary("OL80763W")
//     console.log(getGlossary.glossary)

//     const fetchChapters = await glossModel.fetchChaptersAndCharacters("OL80763W")
//     console.log(fetchChapters.glossary_details.version_number)
//     console.log(fetchChapters.glossary_chapters)



//     console.log('Test: Invalid work id 🏮');
//     const invalidID = await glossaryDBService.getGlossaryByWorkID("W")
//     console.log(invalidID)
//     console.log('Test: Create new glossary 🏮');
//     const newGlossary = await glossaryDBService.createEmptyCommunityGlossary("OL80763W")
//     console.log(newGlossary)

//     console.log('Test: Update chapter 🏮');
//     const getGlossary = await glossaryDBService.updateChapter("b57dd15b-73ae-4c92-877e-b65db6ee9b1e", "Chapter 4.1", "3.2")
//     console.log(getGlossary)

//     console.log('Test: Update chapter 🏮');
//     const getGlossary = await glossaryDBService.deleteChapter("b57dd15b-73ae-4c92-877e-b65db6ee9b1e")
//     console.log(getGlossary)

//     console.log('Test: Update character 🏮');
//     const sampleChar = {
//         chapter_id: "fcfb52ec-78fc-43ea-a2fa-b4cbf8f60b81",
//         character_name: "Updated Character",
//         character_id: "6b4e8eb6-1c6b-4596-bf55-95378d796395",
//         character_description: "bleh",
//         central_character: true,
//         work_id: "OL80763W",
//     }
//     const getGlossary = await glossaryDBService.updateCharacter("6b4e8eb6-1c6b-4596-bf55-95378d796395", sampleChar)
//     console.log(getGlossary)

//     const sample = {
//         chapters: [
//             {
//                 chapter_id: 'fcfb52ec-78fc-43ea-a2fa-b4cbf8f60b81',
//                 work_id: 'OL80763W',
//                 chapter_name: 'Placeholder Chapter',
//                 position: 0,
//                 characters: {
//                     chapters: [
//                         {
//                             chapter_id: 'fcfb52ec-78fc-43ea-a2fa-b4cbf8f60b81',
//                             work_id: 'OL80763W',
//                             chapter_name: 'Placeholder Chapter',
//                             position: 0,
//                             characters: [Array]
//                         },
//                         {
//                             chapter_id: '2e8d242a-fa03-4b9b-8632-f52608b75737',
//                             work_id: 'OL80763W',
//                             chapter_name: 'Chapter 2',
//                             position: 1,
//                             characters: []
//                         }
//                     ]
//                 }
//             },
//             {
//                 chapter_id: '2e8d242a-fa03-4b9b-8632-f52608b75737',
//                 work_id: 'OL80763W',
//                 chapter_name: 'Chapter 2',
//                 position: 1,
//                 characters: []
//             }
//         ]
//     }

//     const getGlossary = await glossaryDBService.updateCommunityGlossary()
//     console.log(getGlossary)


//     console.log('Test: Update character 🏮');
//     const sampleChar = {
//         chapter_id: "fcfb52ec-78fc-43ea-a2fa-b4cbf8f60b81",
//         character_name: "New New Character",
//         character_id: "6b4e8eb6-1c6b-4596-bf55-95378d796395",
//         character_description: "new description",
//         central_character: true,
//         work_id: "OL80763W",
//     }
//     const getGlossary = await glossaryDBService.addNewCharacter("fcfb52ec-78fc-43ea-a2fa-b4cbf8f60b81", sampleChar)
//     console.log(getGlossary)

//     console.log('Test: Delete character glossary 🏮');
//     const updateGlossary = await glossaryDBService.deleteCharacter("4812531c-0f8a-4b16-98c8-e207a7183366")
//     console.log(updateGlossary)

//     console.log(updatingGloss)
//     console.log(updat
//     ingGloss)
// }

// bookServiceTests();
// glossaryServiceTests();
// bookControllerTest();