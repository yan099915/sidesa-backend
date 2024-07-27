module.exports = {
  sendNotificationToRole: async (role, message) => {
    const { io, clients } = require("../server");
    try {
      for (const userId in clients) {
        if (clients[userId].role >= role) {
          const socketId = clients[userId].socketId;
          const pesan = io.to(socketId).emit("notification", message);
        }
      }
      return;
    } catch (error) {
      console.log(error);
    }
  },

  sendEmergencyAlertToRole: async (role, message) => {
    const { io, clients } = require("../server");
    try {
      console.log(clients, "clients");
      for (const userId in clients) {
        if (clients[userId].role >= role) {
          const socketId = clients[userId].socketId;
          const pesan = io.to(socketId).emit("emergency", message);
        }
      }
      return;
    } catch (error) {
      console.log(error);
    }
  },

  sendNotification: async (userId, message) => {
    const { io, clients } = require("../server");
    try {
      if (clients[userId]) {
        const socketId = clients[userId].socketId;
        const notification = io.to(socketId).emit("notification", message);
        return notification;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
