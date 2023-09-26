/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// const getAllBooksHandler = (request, h) => {
//   const { name, reading, finished } = request.query;

//   if (name !== undefined) {
//     const BooksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
//     const response = h
//       .response({
//         status: 'success',
//         data: {
//           books: BooksName.map((book) => ({
//             id: book.id,
//             name: book.name,
//             publisher: book.publisher,
//           })),
//         },
//       });
//     response.code(200);
//     return response;
//   } if (reading !== undefined) {
//     const BooksReading = books.filter(
//       (book) => Number(book.reading) === Number(reading),
//     );

//     const response = h
//       .response({
//         status: 'success',
//         data: {
//           books: BooksReading.map((book) => ({
//             id: book.id,
//             name: book.name,
//             publisher: book.publisher,
//           })),
//         },
//       });
//     response.code(200);
//     return response;
//   } if (finished !== undefined) {
//     const BooksFinished = books.filter(
//       (book) => book.finished == finished,
//     );

//     const response = h
//       .response({
//         status: 'success',
//         data: {
//           books: BooksFinished.map((book) => ({
//             id: book.id,
//             name: book.name,
//             publisher: book.publisher,
//           })),
//         },
//       });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: 'success',
//     data: {
//       books: books.map((book) => ({
//         id: book.id,
//         name: book.name,
//         publisher: book.publisher,
//       })),
//     },
//   });
//   response.code(200);
//   return response;
// };
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = [...books];

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  } else if (reading !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => Number(book.reading) === Number(reading)
    );
  } else if (finished !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished == finished
    );
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
};
