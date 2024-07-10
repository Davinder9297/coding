import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function executeCode(req, res) {
  const { language, code, input } = req.body;
  let command;
  const filename = path.join(__dirname, 'temp');

  switch (language) {
    case 'python':
      command = `echo "${input}" | python3 -c "${code.replace(/"/g, '\\"')}"`;
      break;
    case 'javascript':
      command = `echo "${input}" | node -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case 'ruby':
      command = `echo "${input}" | ruby -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case 'java':
      try {
        fs.writeFileSync(`${filename}.java`, code);
        command = `javac ${filename}.java && echo "${input}" | java -cp ${__dirname} temp`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'golang':
      try {
        fs.writeFileSync(`${filename}.go`, code);
        command = `echo "${input}" | go run ${filename}.go`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'php':
      try {
        fs.writeFileSync(`${filename}.php`, code);
        command = `echo "${input}" | php ${filename}.php`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'csharp':
      try {
        fs.writeFileSync(`${filename}.cs`, code);
        command = `csc ${filename}.cs && echo "${input}" | mono ${filename}.exe`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'swift':
      try {
        fs.writeFileSync(`${filename}.swift`, code);
        command = `echo "${input}" | swift ${filename}.swift`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'r':
      try {
        fs.writeFileSync(`${filename}.R`, code);
        command = `echo "${input}" | Rscript ${filename}.R`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'c':
      try {
        fs.writeFileSync(`${filename}.c`, code);
        command = `gcc ${filename}.c -o ${filename}.out && echo "${input}" | ${filename}.out`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'cpp':
      try {
        fs.writeFileSync(`${filename}.cpp`, code);
        command = `g++ ${filename}.cpp -o ${filename}.out && echo "${input}" | ${filename}.out`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'matlab':
      try {
        fs.writeFileSync(`${filename}.m`, code);
        command = `matlab -nodisplay -nosplash -r "run('${filename}.m'); exit;"`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'typescript':
      try {
        fs.writeFileSync(`${filename}.ts`, code);
        command = `tsc ${filename}.ts && echo "${input}" | node ${filename}.js`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'scala':
      try {
        fs.writeFileSync(`${filename}.scala`, code);
        command = `scalac ${filename}.scala && echo "${input}" | scala ${filename}`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    case 'sql':
      try {
        fs.writeFileSync(`${filename}.sql`, code);
        command = `echo "${input}" | sqlite3 :memory: < ${filename}.sql`;
      } catch (writeError) {
        return res.status(500).json({ error: 'File writing error', details: writeError.message });
      }
      break;
    default:
      return res.status(400).json({ error: 'Language not supported' });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    } else {
      return res.status(200).json({ result: stdout });
    }
  });
}
