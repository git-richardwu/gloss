jest.mock('../services/bookDBService')

const BookDBService = require("../services/bookDBService");
const BookController = require('../controllers/bookController');

describe('Book Controller tests', () => {
    let mockBookService;
    let bookController;
    let mockReq;
    let mockRes;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockBookService = new BookDBService();
        bookController =  new BookController(mockBookService);
        mockReq = { query:{} }
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })
    test('should call service with correct parameters', async () => {

    mockReq.query = { q: 'javascript', limit: 5 };
    
    mockBookService.searchAndSaveBooks = jest.fn()
      .mockResolvedValue([{ id: 1, title: 'Test Book' }]);

    await bookController.searchBooks(mockReq, mockRes);

    expect(mockBookService.searchAndPartialSaveBooks).toHaveBeenCalledWith(
      'javascript',
      5
    );
  });
})