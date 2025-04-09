// Ton pseudo Twitch
const twitchChannel = 'lebluxtv';

// Stream Embed
const streamDiv = document.getElementById('twitch-stream');
streamDiv.innerHTML = `
  <iframe
    src="https://player.twitch.tv/?channel=${twitchChannel}&parent=${location.hostname}"
    frameborder="0"
    allowfullscreen="true"
    scrolling="no"
    height="100%"
    width="100%">
  </iframe>
`;

// Chat Embed
const chatDiv = document.getElementById('twitch-chat');
chatDiv.innerHTML = `
  <iframe
    src="https://www.twitch.tv/embed/${twitchChannel}/chat?parent=${location.hostname}"
    frameborder="0"
    height="100%"
    width="100%">
  </iframe>
`;
