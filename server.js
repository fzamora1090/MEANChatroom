const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const express = require('express');


const documents = {};

app.use(express.static( __dirname + '/public/dist/public' ));

app.all('*', (req, res) => res.sendFile(
    path.join(__dirname, 'public/dist/public/index.html')
));

io.on('connection', socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    }

    socket.on('getDoc', docId => {
        safeJoin(docId);
        socket.emit('document', documents[docId]);
    });

    socket.on('addDoc', doc => {
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit('documents', Object.keys(documents));
        socket.emit('document', doc);
    });

    socket.on('editDoc', doc => {
        documents[doc.id] = doc;
        socket.to(doc.id).emit('document', doc);
    });

    io.emit('documents', Object.keys(documents));

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});

// const app = require('express')();
// const express = require('express');
// const http = require('http').Server(app);
// const path = require('path');


// const io = require('socket.io')(http);

// app.use(express.static( __dirname + '/public/dist/public' ));

// app.all('*', (req, res) => res.sendFile(
//     path.join(__dirname, 'public/dist/public/index.html')
// ));

// const documents = {
    
// };

// io.on('connection', socket => {
//     let previousId;

//     const safeJoin = currentId => {
//         socket.leave(previousId);
//         socket.join(previousId , () => console.log(`Socket ${socket.id} joined room ${currentId}`));
//         previousId = currentId;
//     }
    
//     socket.on('getDoc', docId => {
//         safeJoin(docId);
//         socket.emit('document', documents[docId]);
//     });

//     socket.on('addDoc', doc => {
//         documents[doc.id] = doc;
//         safeJoin(doc.id);
//         io.emit('documents', Object.keys(documents));
//         socket.emit('document', doc);
//     });

//     socket.on('editDoc', doc => {
//         documents[doc.id] = doc;
//         socket.to(doc.id).emit('document', doc);
//     });

//     io.emit('documents' , Object.keys(documents));


//     console.log(`Socket ${socket.id} has connected`);


// });


// const server = app.listen(4444);