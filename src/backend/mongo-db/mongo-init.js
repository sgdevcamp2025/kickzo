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

db = db.getSiblingDB("chatDB");

db.createCollection("messages", {
  validator: {}
});