import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { axiosProblem } from "../utils/axiosClient";
import DarkModeToggle from '../components/DarkModeToggle.jsx';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import LeftTabs from '../components/ProblemPage/LeftPanel/LeftTabs';
import DescriptionTab from '../components/ProblemPage/LeftPanel/DescriptionTab';
import EditorialTab from '../components/ProblemPage/LeftPanel/EditorialTab';
import SolutionsTab from '../components/ProblemPage/LeftPanel/SolutionsTab';
import SubmissionsTab from '../components/ProblemPage/LeftPanel/SubmissionsTab';
import ChatAITab from '../components/ProblemPage/LeftPanel/ChatAITab';
import RightTabs from '../components/ProblemPage/RightPanel/RightTabs';
import CodeEditorTab from '../components/ProblemPage/RightPanel/CodeEditorTab';
import TestCaseTab from '../components/ProblemPage/RightPanel/TestCaseTab';
import ResultTab from '../components/ProblemPage/RightPanel/ResultTab';
import { langMap } from '../components/ProblemPage/helpers.js';

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [leftPanelWidth, setLeftPanelWidth] = useState('50%');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  let { problemId } = useParams();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosProblem.get(`/problem/problemById/${problemId}`);
        setProblem(response.data.data);
        const initialCodeObj = response?.data?.data?.startCode?.find(
          sc => sc.language === langMap[selectedLanguage]
        );
        setCode(initialCodeObj?.initialCode || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCodeObj = problem?.startCode?.find(
        sc => sc.language === langMap[selectedLanguage]
      );
      setCode(initialCodeObj?.initialCode || '');
    }
  }, [selectedLanguage, problem]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    const newLeftWidth = (mouseX / containerWidth) * 100;
    const clampedWidth = Math.max(30, Math.min(70, newLeftWidth));
    
    setLeftPanelWidth(`${clampedWidth}%`);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosProblem.post(`problem/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
        TestCases: problem.visibleTestCases
      });

      setRunResult(response.data.data);
      setLoading(false);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosProblem.post(`/problem/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        success: false,
        error: 'Submission failed'
      });
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E0E0E0] dark:bg-[#121212]">
        <span className="loading loading-spinner loading-lg dark:text-[#E0E0E0]"></span>
      </div>
    );
  }

  return (
    <div className="bg-[#E0E0E0] dark:bg-[#121212] min-h-screen transition-colors duration-300">
      {/* Header with consistent dark background */}
      <div className="h-[7vh] bg-[#121212] py-2 px-6 flex justify-between items-center shadow-sm fixed w-full z-50">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-xl font-semibold text-orange-400">
            CodeClone
          </NavLink>
        </div>
        <div className="flex items-center gap-4 mr-4 mb-1">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-xs text-white">
                {user.fullName?.charAt(0)}
              </div>
              <span className="text-sm text-[#E0E0E0]">{user.firstName}</span>
            </div>
          )}
          <DarkModeToggle />
        </div>
      </div>

      <div ref={containerRef} className="flex pt-[7vh] h-[93vh] w-full relative">
        {/* Left Panel */}
        <div 
          className="h-full flex flex-col bg-white dark:bg-[#1e1e1e] overflow-hidden border-r border-[#B0B0B0] dark:border-[#444444]"
          style={{ 
            width: leftPanelWidth,
            minWidth: '300px',
            maxWidth: '70%'
          }}
        >
          <LeftTabs activeTab={activeLeftTab} setActiveTab={setActiveLeftTab} />
          <div className="flex-1 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {problem && (
              <>
                {activeLeftTab === 'description' && <DescriptionTab problem={problem} />}
                {activeLeftTab === 'editorial' && <EditorialTab problem={problem}/>}
                {activeLeftTab === 'solutions' && <SolutionsTab problem={problem} />}
                {activeLeftTab === 'submissions' && <SubmissionsTab problemId={problemId} />}
                {activeLeftTab === 'chatAI' && <ChatAITab problem={problem} />}
              </>
            )}
          </div>
        </div>

        {/* Resizer Bar */}
        <div 
          className={`w-2 h-full cursor-col-resize bg-[#B0B0B0] dark:bg-[#444444] hover:bg-orange-400 active:bg-orange-400 ${
            isDragging ? 'bg-orange-400' : ''
          }`}
          onMouseDown={handleMouseDown}
          style={{
            zIndex: 10,
          }}
        />

        {/* Right Panel */}
        <div 
          className="h-full flex flex-col bg-white dark:bg-[#1e1e1e] overflow-hidden"
          style={{ 
            flex: 1,
            minWidth: '300px'
          }}
        >
          <RightTabs activeTab={activeRightTab} setActiveTab={setActiveRightTab} />
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeRightTab === 'code' && (
              <CodeEditorTab
                selectedLanguage={selectedLanguage}
                code={code}
                handleEditorChange={handleEditorChange}
                handleEditorDidMount={handleEditorDidMount}
                handleLanguageChange={handleLanguageChange}
                handleRun={handleRun}
                handleSubmitCode={handleSubmitCode}
                loading={loading}
                setActiveRightTab={setActiveRightTab}
              />
            )}
            {activeRightTab === 'testcase' && <TestCaseTab runResult={runResult} />}
            {activeRightTab === 'result' && <ResultTab submitResult={submitResult} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;