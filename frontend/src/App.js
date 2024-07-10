import React, { useState } from 'react';
import AceEditor from 'react-ace';

// Import modes for all supported languages
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-kotlin';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-swift';
import 'ace-builds/src-noconflict/mode-r';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-matlab';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-scala';
import 'ace-builds/src-noconflict/mode-sql';

// Import themes
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
// Add more imports for other themes here

const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [theme, setTheme] = useState('github');
  const [input, setInput] = useState(''); // State for user input
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const executeCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code, input }), // Send user input along with the code
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.result);
      } else {
        setOutput(data.error || 'Error executing code.');
      }
    } catch (error) {
      setOutput('Error executing code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Language:
          <select
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="golang">Go</option>
            <option value="java">Java</option>
            <option value="kotlin">Kotlin</option>
            <option value="php">PHP</option>
            <option value="csharp">C#</option>
            <option value="swift">Swift</option>
            <option value="r">R</option>
            <option value="ruby">Ruby</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="matlab">Matlab</option>
            <option value="typescript">TypeScript</option>
            <option value="scala">Scala</option>
            <option value="sql">SQL</option>
            {/* Add more options for other languages */}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Theme:
          <select
            onChange={(e) => setTheme(e.target.value)}
            value={theme}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="github">GitHub</option>
            <option value="monokai">Monokai</option>
            {/* Add more theme options as needed */}
          </select>
        </label>
      </div>
      <div style={{ border: '1px solid #ccc', marginTop: '10px' }}>
        <AceEditor
          mode={language}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value)}
          name="editor"
          editorProps={{ $blockScrolling: true }}
          height="400px"
          width="100%"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            useWorker: true, // Ensure worker is enabled
            tabSize: 2,
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Input:
          <textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            style={{ display: 'block', marginTop: '10px', padding: '10px', width: '100%', height: '100px' }}
          />
        </label>
      </div>
      <button
        onClick={executeCode}
        disabled={loading}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>
     
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          marginTop: '10px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {output}
      </pre>
    </div>
  );
};

export default App;
