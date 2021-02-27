import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";

const app: Express = express();

app.use(express.json());

app.use('/',
  express.static(path.join(__dirname, '../../client/dist'))
);

app.use(function(request: Request, response: Response, next: NextFunction){
   response.header('Access-Control-Allow-Origin', '*');
   response.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
   response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   next();
});

app.get('/mailboxes',
  async ( request: Request, response: Response ) => {
     try { 
       const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
       const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
       response.json(mailboxes); 
     } catch ( error ) {
        response.send('error');
     }
  }
);

app.get('/mailboxes/:mailbox',
  async ( request: Request, response: Response ) => {
     try {
       const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
       const messages: IMAP.IMessage[] = await imapWorker.listMessages({
          mailbox: request.params.mailbox
       });
       response.json(messages);   

     } catch ( error ) {
       response.send('error'); 
     }
  }
);

app.get('/messages/:mailbox/:id',
  async ( request: Request, response: Response ) => {
     try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messageBody: string = await imapWorker.getMessageBody({
           mailbox: request.params.mailbox,
           id: parseInt(request.params.id, 10)
        });
        response.send(messageBody);
     } catch ( error ) {
       response.send( 'error '); 
     }
  }
);

app.delete('/messages/:mailbox/:id',
  async ( request: Request, response: Response ) => {
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      await imapWorker.deleteMessage({
         mailbox: request.params.mailbox,
         id: parseInt(request.params.id, 10)
      });
      response.send( 'ok' );
    } catch ( error ) {
       response.send( 'error' );
    }
  }
);

app.post('/messages', 
  async ( request: Request, response: Response ) => {
     try {
       const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
       await smtpWorker.sendMessage(request.body);
       response.send( 'ok' );
     } catch ( error ) {
       response.send( 'error' );
     }
  }
);

app.get('/contacts',
  async ( request: Request, response: Response ) => {
    try {
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contacts: IContact[] = await contactsWorker.listContacts();
      response.json(contacts);
    } catch ( error ) {
       response.send( 'error' );
    }     
  }
);

app.post('/contacts',
  async ( request: Request, response: Response ) => {
     try {
       const contactsWorker: Contacts.Worker = new Contacts.Worker();
       const contact: IContact = await contactsWorker.addContact(request.body);
       response.json(contact);
     } catch ( error ) {
       response.send( 'error ');
     }
  }
);

app.delete('/contacts/:id',
  async ( request: Request, response: Response ) => {
     try {
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        await contactsWorker.deleteContact(request.params.id);
        response.send( 'ok' );
     } catch ( error ) {
        response.send( 'error' );
     }
  }
);