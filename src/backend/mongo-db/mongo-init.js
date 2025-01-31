db.createUser(
  {
      user: "kickzo",
      pwd: "test123",
      roles: [
          {
              role: "readWrite",
              db: "chatDB"
          }
      ]
  }
);

db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "message", "timestamp"],
      properties: {
        user: {
          bsonType: "string",
          description: "The name of the user sending the message"
        },
        message: {
          bsonType: "string",
          description: "The content of the chat message"
        },
        timestamp: {
          bsonType: "date",
          description: "The time the message was sent"
        }
      }
    }
  }
});