import { GeminiService } from "./AiService.js";

// Get references to DOM elements
const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const fileInput = document.getElementById('file-input');
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
 * @param {string} prompt - The user's message
 */
async function sendMessage(prompt, file) {
  console.log('[sendMessage] User message:', prompt);
  
  conversation.push({ role: 'user', content: prompt });
  addMessage('user', prompt);
  userInput.value = '';
  addMessage('ai', '...'); // Placeholder while waiting for response
  
  const aiMsgDiv = messagesDiv.lastChild;
  
  try {
    const aiReply = await GeminiService.generateText(prompt, file)
        
    conversation.push({ role: 'assistant', content: aiReply });
    // Format the AI reply as markdown
    aiMsgDiv.innerHTML = formatMarkdown(aiReply);

  } catch (e) {
    console.error('[sendMessage] Error:', e);
    aiMsgDiv.textContent = 'Error: ' + e.message;
  }
}

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

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Event listener for when the file is successfully loaded
    reader.onload = () => {
      // reader.result will be a data URL (e.g., "data:image/png;base64,iVBORw0KGgo...")
      // We need to extract only the Base64 part after the comma
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };

    // Event listener for errors during file reading
    reader.onerror = (error) => {
      reject(error);
    };

    // Read the file as a Data URL
    reader.readAsDataURL(file);
  });
}

// Listen for form submission (user sends a message)
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = userInput.value.trim();
  const file = fileInput.files[0];
  console.log('[form submit] User input file:', file);
  
  const base64File = await fileToBase64(file);
  console.log('[form submit] User input:', msg);
  console.log('[form submit] User input file:', base64File);
  if (msg) sendMessage(msg, base64File);
});
