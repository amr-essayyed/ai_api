
// Get references to DOM elements
const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
import { COHORT_API_SECRET_KEY } from "./constants.js";
// Store the conversation history
let conversation = [];


/**
 * Add a message to the chat window.
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - The message text
 */
function addMessage(role, content) {
  console.log(`[addMessage] role: ${role}, content:`, content);
  const msg = document.createElement('div');
  msg.className = 'message ' + (role === 'user' ? 'user' : 'ai');
  msg.textContent = content;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


/**
 * Send a user message to the Cohere API and display the AI's response.
 * @param {string} message - The user's message
 */
async function sendMessage(message) {
  console.log('[sendMessage] User message:', message);
  conversation.push({ role: 'user', content: message });
  addMessage('user', message);
  userInput.value = '';
  addMessage('ai', '...'); // Placeholder while waiting for response
  const aiMsgDiv = messagesDiv.lastChild;
  try {
    // Prepare request payload
    const payload = {
      model: 'command-a-03-2025',
      messages: conversation
    };
    console.log('[sendMessage] Sending payload:', payload);
    const res = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${COHORT_API_SECRET_KEY}`
      },
      body: JSON.stringify(payload)
    });
    console.log('[sendMessage] Response status:', res.status);
    const data = await res.json();
    console.log('[sendMessage] API response:', data);
    // Try to extract the AI's reply from the response
    const aiReply = data.message.content[0].text || 'Sorry, no response.';
    conversation.push({ role: 'assistant', content: aiReply });
    // Format the AI reply as markdown
    aiMsgDiv.innerHTML = formatMarkdown(aiReply);

/**
 * Format markdown text to HTML (basic support for code, bold, italics, links, line breaks).
 * @param {string} text - Markdown text
 * @returns {string} - HTML string
 */
function formatMarkdown(text) {
  if (!text) return '';
  // Escape HTML
  let html = text.replace(/[&<>]/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[tag]));
  // Code blocks (```...```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  // Inline code (`...`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Headings (#, ##, ###, etc.)
  html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  // Bold (**...** or __...__)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  html = html.replace(/__([^_]+)__/g, '<b>$1</b>');
  // Italic (*...* or _..._)
  html = html.replace(/\*([^*]+)\*/g, '<i>$1</i>');
  html = html.replace(/_([^_]+)_/g, '<i>$1</i>');
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  return html;
}
  } catch (e) {
    console.error('[sendMessage] Error:', e);
    aiMsgDiv.textContent = 'Error: ' + e.message;
  }
}


// Listen for form submission (user sends a message)
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = userInput.value.trim();
  console.log('[form submit] User input:', msg);
  if (msg) sendMessage(msg);
});
