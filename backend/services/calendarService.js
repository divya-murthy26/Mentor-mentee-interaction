const { google } = require('googleapis');

const createCalendarEvent = async (interaction, mentorUser, menteeUser) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.log('Google Calendar credentials not configured. Skipping calendar event creation.');
      return null;
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const startDateTime = new Date(interaction.dateTime);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour

    let description = `Topic: ${interaction.topic}\n`;
    description += `Session Type: ${interaction.sessionType}\n`;

    if (interaction.sessionType === 'online') {
      description += `Platform: ${interaction.platform}\n`;
      description += `Meeting Link: ${interaction.meetingLink}\n`;
    } else {
      description += `Location: ${interaction.location}\n`;
    }

    const event = {
      summary: `Mentoring Session: ${interaction.topic}`,
      description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      attendees: [
        { email: mentorUser.email, displayName: mentorUser.name },
        { email: menteeUser.email, displayName: menteeUser.name }
      ],
      location: interaction.sessionType === 'offline' ? interaction.location : interaction.meetingLink,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all'
    });

    console.log('Calendar event created:', response.data.id);
    return response.data.id;
  } catch (error) {
    console.error('Calendar event creation error:', error.message);
    return null;
  }
};

module.exports = { createCalendarEvent };
