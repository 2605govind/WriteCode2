import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { getLanguageForMonaco, langMap } from '../helpers';

export default function CodeEditorTab({
  selectedLanguage,
  code,
  handleEditorChange,
  handleEditorDidMount,
  handleLanguageChange,
  handleRun,
  handleSubmitCode,
  loading,
  setActiveRightTab
}) {
  const [fontSize, setFontSize] = useState(14);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
      {/* Language Selector and Font Controls */}
      <div className="flex justify-between items-center p-2 border-b border-gray-700 bg-[#252526]">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {Object.keys(langMap).map((lang) => (
            <button
              key={lang}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                selectedLanguage === lang
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-gray-300'
              }`}
              onClick={() => handleLanguageChange(lang)}
            >
              {langMap[lang]}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <button 
            className="px-1.5 py-0.5 rounded hover:bg-[#2d2d2d]"
            onClick={() => setFontSize(f => Math.max(10, f - 1))}
          >
            -
          </button>
          <span className="w-8 text-center">{fontSize}px</span>
          <button 
            className="px-1.5 py-0.5 rounded hover:bg-[#2d2d2d]"
            onClick={() => setFontSize(f => Math.min(24, f + 1))}
          >
            +
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageForMonaco(selectedLanguage)}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line-thin',
            mouseWheelZoom: true,
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="p-2 border-t border-gray-700 bg-[#252526] flex justify-between items-center">
        <button 
          className="px-2 py-1 text-xs text-gray-400 hover:text-gray-300 hover:bg-[#2d2d2d] rounded transition-colors flex items-center gap-1"
          onClick={() => setActiveRightTab('testcase')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Console
        </button>
        
        <div className="flex gap-1">
          <button
            className={`px-3 py-1 text-xs rounded border border-gray-600 text-gray-300 hover:bg-[#2d2d2d] transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run'}
          </button>
          <button
            className={`px-3 py-1 text-xs rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleSubmitCode}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}