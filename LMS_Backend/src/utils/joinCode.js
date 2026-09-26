// Short, human-friendly codes for students to self-register with. The
// alphabet skips 0/O and 1/I so a code is easy to read aloud or copy from a
// whiteboard without ambiguity.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

function generateJoinCode() {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

module.exports = { generateJoinCode };
